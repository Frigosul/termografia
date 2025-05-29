import { prisma } from '@/lib/prisma'
import { GenerateDataModeType } from '@/types/generate-data-mode'
import { Pressure, Temperature } from '@prisma/client'
import dayjs from 'dayjs'
import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

interface SensorData {
  id: string
  updatedAt: string
  time: string
  value: number
}

interface GenerateDataRequest {
  startDate: string
  defrostDate: string
  endDate: string
  instrumentId: string
  variation: number
  initialValue?: number
  averageValue?: number
  generateMode?: GenerateDataModeType
  instrumentType: 'temp' | 'press'
}

function getInitialValue(type: 'temp' | 'press', initialValue?: number) {
  if (typeof initialValue === 'number') return initialValue
  return type === 'temp' ? 15 : 0
}

function getAvgValue(
  type: 'temp' | 'press',
  averageValue: number | undefined,
  historicalData: Temperature[] | Pressure[],
) {
  if (typeof averageValue === 'number') return averageValue
  if (historicalData.length) {
    return (
      historicalData.reduce(
        (sum: number, record: Pressure | Temperature) => sum + record.value,
        0,
      ) / historicalData.length
    )
  }
  return type === 'temp' ? 10 : 3.5
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateDataRequest = await request.json()
    const {
      startDate,
      defrostDate,
      endDate,
      instrumentId,
      variation,
      averageValue,
      initialValue,
      generateMode = 'n1',
    } = body

    if (!startDate || !defrostDate || !endDate || !instrumentId || !variation) {
      return NextResponse.json({ error: 'Missing data.' }, { status: 400 })
    }

    const formattedStartDate = dayjs(startDate)
    const formattedEndDate = dayjs(endDate).add(1, 'minute')
    const formattedDefrostDate = dayjs(defrostDate)

    const instrument = await prisma.instrument.findUnique({
      where: { id: instrumentId },
      select: { type: true },
    })

    if (!instrument) {
      return NextResponse.json(
        { message: 'Instrument not found.' },
        { status: 400 },
      )
    }

    let historicalData: Temperature[] | Pressure[] = []
    if (instrument.type === 'press') {
      historicalData = await prisma.pressure.findMany({
        where: { instruments: { some: { instrument_id: instrumentId } } },
        take: 20,
      })
    } else {
      historicalData = await prisma.temperature.findMany({
        where: { instruments: { some: { instrument_id: instrumentId } } },
        take: 20,
      })
    }

    if (instrument.type !== 'temp' && instrument.type !== 'press') {
      return NextResponse.json(
        { message: 'Invalid instrument type.' },
        { status: 400 },
      )
    }
    const avgValue = getAvgValue(instrument.type, averageValue, historicalData)
    let currentValue = getInitialValue(instrument.type, initialValue)

    const sensorData: SensorData[] = []
    const variationSensorData: SensorData[] = []
    let currentDate = formattedStartDate.clone()
    let lastVariationMinute = -1
    let pressureCycleStart = currentDate.clone()
    let pressureCyclePhase: 'initial' | 'varying' | 'zero' = 'initial'
    const n1Limit = formattedStartDate.clone().add(5, 'hour')
    const n2Limit = formattedStartDate.clone().add(4, 'hour')
    const n3Limit = formattedStartDate.clone().add(3, 'hour')

    while (currentDate.isBefore(formattedEndDate)) {
      if (instrument.type === 'temp') {
        if (generateMode === 'n1') {
          currentValue = currentDate.isBefore(n1Limit)
            ? getInitialValue(instrument.type, initialValue) -
            Math.random() * 0.7
            : avgValue + (Math.random() * 4 - 2)
        } else if (generateMode === 'n2') {
          currentValue = currentDate.isBefore(n2Limit)
            ? getInitialValue(instrument.type, initialValue) -
            Math.random() * 0.7
            : avgValue + (Math.random() * 4 - 2)
        } else if (generateMode === 'n3') {
          currentValue = currentDate.isBefore(n3Limit)
            ? getInitialValue(instrument.type, initialValue) -
            Math.random() * 0.7
            : avgValue + (Math.random() * 4 - 2)
        }
        if (currentDate.isAfter(formattedDefrostDate)) {
          currentValue += Math.random() * 3
        }
      } else if (instrument.type === 'press') {
        const minutesInCycle = currentDate.diff(pressureCycleStart, 'minute')
        if (pressureCyclePhase === 'initial' && minutesInCycle >= 3) {
          currentValue = 3.5
          pressureCyclePhase = 'varying'
        } else if (pressureCyclePhase === 'varying') {
          currentValue = minutesInCycle < 23 ? 3.5 + Math.random() : 0
          if (minutesInCycle >= 23) pressureCyclePhase = 'zero'
        } else if (pressureCyclePhase === 'zero' && minutesInCycle >= 33) {
          pressureCycleStart = currentDate.clone()
          pressureCyclePhase = 'initial'
          currentValue = 0
        }
      }

      const sensorItem: SensorData = {
        id: uuidv4(),
        time: currentDate.format('YYYY-MM-DDTHH:mm:ss'),
        value: Number(currentValue.toFixed(1)),
        updatedAt: currentDate.format('YYYY-MM-DDTHH:mm:ss'),
      }
      sensorData.push(sensorItem)

      const minutesDiff = currentDate.diff(formattedStartDate, 'minute')
      if (
        minutesDiff === 0 || // sempre inclui o valor inicial
        (minutesDiff > 0 &&
          minutesDiff % variation === 0 &&
          minutesDiff !== lastVariationMinute)
      ) {
        variationSensorData.push(sensorItem)
        lastVariationMinute = minutesDiff
      }

      currentDate = currentDate.add(1, 'minute')
    }

    for (const record of sensorData) {
      await prisma.instrument.update({
        where: { id: instrumentId },
        data: {
          temperatures: {
            create: {
              temperature: {
                create: {
                  id: record.id,
                  value: record.value,
                  editValue: record.value,
                  createdAt: dayjs(record.time).toDate(),
                  updatedAt: dayjs(record.updatedAt).toDate(),
                },
              },
            },
          },
        },
      })
    }

    return NextResponse.json(
      {
        message: 'Data successfully generated.',
        data: variationSensorData,
        instrumentType: instrument.type,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('Error generating or saving data:', error)
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 },
    )
  }
}
