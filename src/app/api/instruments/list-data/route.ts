import { PrismaClient } from '@prisma/client';
import dayjs from "dayjs";

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const prisma = new PrismaClient()
  const { local, graphVariation, tableVariation, startDate, endDate } = await req.json()
  if (!local || !graphVariation || !startDate || !endDate) {
    return NextResponse.json(
      { message: 'Missing data!' },
      { status: 400 },
    )
  }

  const formattedStartDate = dayjs(startDate).format('YYYY-MM-DDTHH:mm:ss[Z]')
  const formattedEndDate = dayjs(endDate).add(1, 'minute').format('YYYY-MM-DDTHH:mm:ss[Z]')
  console.log(formattedEndDate, formattedStartDate)

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
              id: true,
              editValue: true,
              createdAt: true,
              userUpdatedAt: true,
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
        id: string
        editValue: number,
        createdAt: Date,
        userUpdatedAt: string | null
      }
    }[],
    intervalMinutes: number
  }

  function filterByInterval({ temperatures, intervalMinutes }: filterByIntervalType) {
    let lastTime: number | null = null;
    const filtered = [];

    for (const temp of temperatures) {
      const tempTime = dayjs(temp.temperature.createdAt).valueOf();

      if (!lastTime || tempTime >= lastTime + intervalMinutes * 60 * 1000) {
        filtered.push(temp);
        lastTime = tempTime;
      }
    }


    if (temperatures.length > 0) {
      const lastTempTime = dayjs(temperatures[temperatures.length - 1].temperature.createdAt).valueOf();
      if (filtered.length === 0 || lastTempTime > lastTime!) {
        filtered.push(temperatures[temperatures.length - 1]);
      }
    }
    const filterUniqueFiltered = filtered.filter((item, index, self) =>
      index === self.findIndex(r =>
        dayjs(r.temperature.createdAt).isSame(dayjs(item.temperature.createdAt), 'minute')
      )
    );

    return filterUniqueFiltered;
  }


  const chartTemperature = filterByInterval({ temperatures: data.temperatures, intervalMinutes: graphVariation });
  if (tableVariation) {
    const tableTemperatureRange = filterByInterval({ temperatures: data.temperatures, intervalMinutes: tableVariation });
    const formattedData = {
      id: data?.id,
      name: data?.name,
      chartType: 'temp',
      dateClose: startDate,
      dateOpen: endDate,
      chartTemperature: chartTemperature.map(temp => ({
        id: temp.temperature.id,
        time: temp.temperature.createdAt.toISOString(),
        temperature: temp.temperature.editValue,

      })),
      tableTemperatureRange: tableTemperatureRange.map(temp => ({
        id: temp.temperature.id,
        time: temp.temperature.createdAt.toISOString(),
        temperature: temp.temperature.editValue,
      })),
    };

    return NextResponse.json(formattedData, { status: 200 })

  } else {
    const formattedData = {
      id: data?.id,
      name: data?.name,
      chartType: 'temp',
      dateClose: startDate,
      dateOpen: endDate,
      chartTemperature: chartTemperature.map(temp => ({
        id: temp.temperature.id,
        time: temp.temperature.createdAt.toISOString(),
        temperature: temp.temperature.editValue,
        updatedUserAt: temp.temperature.userUpdatedAt,
      }))
    };

    return NextResponse.json(formattedData, { status: 200 })
  }

}
