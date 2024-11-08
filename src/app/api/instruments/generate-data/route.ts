import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
const prisma = new PrismaClient();

interface TemperatureData {
  id: string
  updatedAt: string
  time: string
  temperature: number
}

interface GenerateTemperatureRequest {
  startDate: string;
  defrostDate: string;
  endDate: string;
  instrumentId: string;
  variation: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateTemperatureRequest = await request.json();
    const { startDate, defrostDate, endDate, instrumentId, variation } = body;

    if (!startDate || !defrostDate || !endDate || !instrumentId || !variation) {
      return NextResponse.json({ error: 'Missing data.' }, { status: 400 });
    }
    const formattedStartDate = dayjs(startDate).format('YYYY-MM-DDTHH:mm:ss[Z]')
    const formattedEndDate = dayjs(endDate).add(1, 'minute').format('YYYY-MM-DDTHH:mm:ss[Z]')
    const formattedDefrostDate = dayjs(defrostDate).format('YYYY-MM-DDTHH:mm:ss[Z]')


    const historicalData = await prisma.temperature.findMany({
      where: {
        instruments: {
          some: {
            instrument_id: instrumentId
          }
        },
      },
      take: 20,
    })


    const avgTemperature = historicalData.length
      ? historicalData.reduce((sum, record) => sum + record.value, 0) / historicalData.length
      : 10;


    const data: TemperatureData[] = [];
    let currentDate = dayjs(formattedStartDate);
    let temperature = 15; // initial temp


    while (currentDate.isBefore(dayjs(formattedEndDate))) {
      if (currentDate.isBefore(dayjs(formattedStartDate).add(5, 'hour'))) {
        temperature -= Math.random() * 0.7; // Diminui gradualmente.
      } else {
        temperature = avgTemperature + (Math.random() * 4 - 2); // Variação de ±2 graus.
      }

      if (currentDate.isAfter(formattedDefrostDate)) {
        temperature += Math.random() * 3; // Aumenta em até 3 graus durante o degelo.
      }

      data.push({
        id: uuidv4(),
        time: currentDate.format('YYYY-MM-DDTHH:mm'),
        temperature: Number(temperature.toFixed(1)),
        updatedAt: currentDate.format('YYYY-MM-DDTHH:mm'),
      });

      currentDate = currentDate.add(variation, 'minute');
    }
    const existingRecords = await prisma.temperature.findMany({
      where: {
        instruments: {
          some: {
            instrument_id: instrumentId
          }
        },
        createdAt: {
          in: data.map(d => dayjs(d.time).toDate())
        }
      }
    });

    if (existingRecords.length > 0) {
      return NextResponse.json({ error: 'Registros já existem para as datas fornecidas.' }, { status: 409 });
    }

    for (const record of data) {
      await prisma.instrument.update({
        where: { id: instrumentId },
        data: {
          temperatures: {
            create: {
              temperature: {
                create: {
                  id: record.id,
                  value: record.temperature,
                  editValue: record.temperature,
                  createdAt: dayjs(record.time).toDate(),
                  updatedAt: dayjs(record.updatedAt).toDate(),
                }
              }
            }
          }
        }
      });
    }

    return NextResponse.json({ message: 'Dados salvos com sucesso.', data }, { status: 201 });
  } catch (error) {
    console.error('Erro ao gerar ou salvar dados de temperatura:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
