import { GenerateDataModeType } from '@/types/generate-data-mode';
import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
const prisma = new PrismaClient();

interface SensorData {
  id: string
  updatedAt: string
  time: string
  value: number
}

interface GenerateDataRequest {
  startDate: string;
  defrostDate: string;
  endDate: string;
  instrumentId: string;
  variation: number;
  initialValue?: number
  averageValue?: number
  generateMode?: GenerateDataModeType
  instrumentType: 'temperature' | 'pressure'
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateDataRequest = await request.json();
    const { startDate, defrostDate, endDate, instrumentId, variation, averageValue, initialValue, generateMode = 'n1' } = body;
    let lastVariationMinute = -1
    if (!startDate || !defrostDate || !endDate || !instrumentId || !variation) {
      return NextResponse.json({ error: 'Missing data.' }, { status: 400 });
    }
    const formattedStartDate = dayjs(startDate).format('YYYY-MM-DDTHH:mm:ss[Z]')
    const formattedEndDate = dayjs(endDate).add(1, 'minute').format('YYYY-MM-DDTHH:mm:ss[Z]')
    const formattedDefrostDate = dayjs(defrostDate).format('YYYY-MM-DDTHH:mm:ss[Z]')

    const instrumentType = await prisma.instrument.findUnique({
      where: {
        id: instrumentId
      },
      select: {
        type: true
      }
    })

    if (!instrumentType) {
      return NextResponse.json({ message: "instrument not exist" }, { status: 400 })
    }

    let historicalData = []

    if (instrumentType.type === 'press') {
      historicalData = await prisma.pressure.findMany({
        where: {
          instruments: {
            some: {
              instrument_id: instrumentId
            }
          },
        },
        take: 20,
      })
    } else {
      historicalData = await prisma.temperature.findMany({
        where: {
          instruments: {
            some: {
              instrument_id: instrumentId
            }
          },
        },
        take: 20,
      })
    }

    const avgValue = averageValue !== undefined
      ? averageValue
      : (historicalData.length
        ? historicalData.reduce((sum, record) => sum + record.value, 0) / historicalData.length
        : instrumentType.type === 'temp' ? 10 : 3.5);

    const sensorData: SensorData[] = [];
    const variationSensorData: SensorData[] = [];
    let currentDate = dayjs(formattedStartDate);
    let value = initialValue !== undefined ? initialValue : (instrumentType.type === 'temp' ? 15 : 0);
    let pressureCycleStart = currentDate;
    let pressureCyclePhase = 'initial';

    while (currentDate.isBefore(dayjs(formattedEndDate))) {
      let currentValue = value;

      if (instrumentType.type === 'temp') {
        if (generateMode === 'n1') {
          if (currentDate.isBefore(dayjs(formattedStartDate).add(5, 'hour'))) {
            currentValue -= Math.random() * 0.7; // Diminui gradualmente.
          } else {
            currentValue = avgValue + (Math.random() * 4 - 2); // Variação de ±2 graus.
          }
        } else if (generateMode === 'n2') {
          if (currentDate.isBefore(dayjs(formattedStartDate).add(4, 'hour'))) {
            currentValue -= Math.random() * 0.7; // Diminui gradualmente.
          } else {
            currentValue = avgValue + (Math.random() * 4 - 2); // Variação de ±2 graus.
          }
        } else if (generateMode === 'n3') {
          if (currentDate.isBefore(dayjs(formattedStartDate).add(3, 'hour'))) {
            currentValue -= Math.random() * 0.7; // Diminui gradualmente.
          } else {
            currentValue = avgValue + (Math.random() * 4 - 2); // Variação de ±2 graus.
          }
        }

        if (currentDate.isAfter(formattedDefrostDate)) {
          currentValue += Math.random() * 3; // Aumenta em até 3 graus durante o degelo.
        }
      } else if (instrumentType.type === 'press') {
        const minutesInCycle = currentDate.diff(pressureCycleStart, 'minute');
        if (pressureCyclePhase === 'initial' && minutesInCycle >= 3) {
          currentValue = 3.5;
          pressureCyclePhase = 'varying';
        } else if (pressureCyclePhase === 'varying') {
          if (minutesInCycle < 23) {
            currentValue = 3.5 + Math.random(); // Varies between 3.5 and 4.5
          } else {
            currentValue = 0;
            pressureCyclePhase = 'zero';
          }
        } else if (pressureCyclePhase === 'zero' && minutesInCycle >= 33) {
          pressureCycleStart = currentDate;
          pressureCyclePhase = 'initial';
          currentValue = 0;
        }
      }

      const sensorItem: SensorData = {
        id: uuidv4(),
        time: currentDate.format('YYYY-MM-DDTHH:mm:ss'),
        value: Number(currentValue.toFixed(1)),
        updatedAt: currentDate.format('YYYY-MM-DDTHH:mm:ss')
      }
      sensorData.push(sensorItem);

      const minutesDiff = currentDate.diff(dayjs(formattedStartDate), 'minute');
      if (minutesDiff > 0 && minutesDiff % variation === 0 && minutesDiff !== lastVariationMinute) {
        variationSensorData.push(sensorItem);
        lastVariationMinute = minutesDiff;
      }
      currentDate = currentDate.add(10, 'seconds');
    }

    // Commented out database operations
    // const existingRecords = await prisma.temperature.findMany({
    //   where: {
    //     instruments: {
    //       some: {
    //         instrument_id: instrumentId
    //       }
    //     },
    //     createdAt: {
    //       in: sensorData.map(d => dayjs(d.time).toDate())
    //     }
    //   }
    // });

    // if (existingRecords.length > 0) {
    //   return NextResponse.json({ error: 'Registros já existem para as datas fornecidas.' }, { status: 409 });
    // }

    // for (const record of sensorData) {
    //   await prisma.instrument.update({
    //     where: { id: instrumentId },
    //     data: {
    //       temperatures: {
    //         create: {
    //           temperature: {
    //             create: {
    //               id: record.id,
    //               value: record.value,
    //               editValue: record.value,
    //               createdAt: dayjs(record.time).toDate(),
    //               updatedAt: dayjs(record.updatedAt).toDate(),
    //             }
    //           }
    //         }
    //       }
    //     }
    //   });
    // }
    return NextResponse.json({
      message: 'Dados gerados com sucesso.',
      data: variationSensorData,
      instrumentType: instrumentType.type
    }, { status: 201 });
  } catch (error) {
    console.error('Erro ao gerar ou salvar dados:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
