import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const prisma = new PrismaClient()
  const { local, graphVariation, tableVariation, limit, detour, variationTemp, minValue, maxValue, startDate, endDate } = await req.json()
  if (!local || !graphVariation || !tableVariation || !limit || !detour || !variationTemp || !minValue || !maxValue || !startDate || !endDate) {
    return NextResponse.json(
      { message: 'Missing data!' },
      { status: 400 },
    )
  }

  const formattedStartDate = new Date(startDate).toISOString()
  const formattedEndDate = new Date(endDate).toISOString()

  const data = await prisma.instrument.findUnique({
    where: {
      name: local,

    },
    select: {
      id: true,
      name: true,
      temperatures: {
        where: {
          temperature: {
            createdAt: {
              gte: formattedStartDate,
              lte: formattedEndDate,
            }
          }
        },
        include: {
          temperature: {
            select: {
              editValue: true,
              createdAt: true,
            }
          }
        },
        orderBy: {
          temperature: {
            createdAt: 'asc'
          }
        }
      }
    }
  })
  if (!data) {
    return NextResponse.json({ message: "Data is not locale" }, { status: 400 })
  }

  type filterByIntervalType = {
    temperatures: {
      temperature: {
        editValue: number,
        createdAt: Date,
      }
    }[],
    intervalMinutes: number
  }

  function filterByInterval({ temperatures, intervalMinutes }: filterByIntervalType) {
    const filtered = [];
    let lastTime = null;

    for (const temp of temperatures) {
      const tempTime = new Date(temp.temperature.createdAt).getTime();


      if (!lastTime || tempTime >= lastTime + intervalMinutes * 60 * 1000) {
        filtered.push(temp);
        lastTime = tempTime;
      }
    }

    return filtered;
  }

  const chartTemperature = filterByInterval({ temperatures: data.temperatures, intervalMinutes: graphVariation }); // Variação de 10 minutos
  const tableTemperatureRange = filterByInterval({ temperatures: data.temperatures, intervalMinutes: tableVariation }); // Variação de 5 minutos



  const formattedData = {
    id: data?.id,
    name: data?.name,
    chartType: 'temp',
    dateClose: startDate,
    dateOpen: endDate,
    chartTemperature: chartTemperature.map(temp => ({
      time: temp.temperature.createdAt.toISOString(),
      temperature: temp.temperature.editValue,
    })),
    tableTemperatureRange: tableTemperatureRange.map(temp => ({
      time: temp.temperature.createdAt.toISOString(),
      temperature: temp.temperature.editValue,
    })),
  };

  return NextResponse.json(formattedData, { status: 200 })

}
