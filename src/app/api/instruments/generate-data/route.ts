import { GenerateDataModeType } from '@/types/generate-data-mode'
import { Pressure, PrismaClient, Temperature } from '@prisma/client'
import dayjs from 'dayjs'
import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient()

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

export async function POST(request: NextRequest) {
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return NextResponse.json([], { status: 200 })
  }
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
        where: {
          instruments: {
            some: { instrument_id: instrumentId },
          },
        },
        take: 20,
      })
    } else if (instrument.type === 'temp') {
      historicalData = await prisma.temperature.findMany({
        where: {
          instruments: {
            some: { instrument_id: instrumentId },
          },
        },
        take: 20,
      })
    }

    const avgValue =
      averageValue ??
      (historicalData.length
        ? historicalData.reduce(
            (sum: number, record: Pressure | Temperature) => sum + record.value,
            0,
          ) / historicalData.length
        : instrument.type === 'temp'
          ? 10
          : 3.5)

    const sensorData: SensorData[] = []
    const variationSensorData: SensorData[] = []
    let currentDate = formattedStartDate
    const value = initialValue ?? (instrument.type === 'temp' ? 15 : 0)
    let lastVariationMinute = -1
    let pressureCycleStart = currentDate
    let pressureCyclePhase = 'initial'

    while (currentDate.isBefore(formattedEndDate)) {
      let currentValue = value

      if (instrument.type === 'temp') {
        if (generateMode === 'n1') {
          currentValue = currentDate.isBefore(formattedStartDate.add(5, 'hour'))
            ? currentValue - Math.random() * 0.7
            : avgValue + (Math.random() * 4 - 2)
        } else if (generateMode === 'n2') {
          currentValue = currentDate.isBefore(formattedStartDate.add(4, 'hour'))
            ? currentValue - Math.random() * 0.7
            : avgValue + (Math.random() * 4 - 2)
        } else if (generateMode === 'n3') {
          currentValue = currentDate.isBefore(formattedStartDate.add(3, 'hour'))
            ? currentValue - Math.random() * 0.7
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
          pressureCycleStart = currentDate
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
        minutesDiff > 0 &&
        minutesDiff % variation === 0 &&
        minutesDiff !== lastVariationMinute
      ) {
        variationSensorData.push(sensorItem)
        lastVariationMinute = minutesDiff
      }

      currentDate = currentDate.add(10, 'seconds')
    }

    // let existingRecords = []

    // if (instrument.type === 'press') {
    //   existingRecords = await prisma.pressure.findMany({
    //     where: {
    //       instruments: {
    //         some: { instrument_id: instrumentId },
    //       },
    //       createdAt: { in: sensorData.map((d) => dayjs(d.time).toDate()) },
    //     },
    //   })
    // } else if (instrument.type === 'temp') {
    //   existingRecords = await prisma.temperature.findMany({
    //     where: {
    //       instruments: {
    //         some: { instrument_id: instrumentId },
    //       },
    //       createdAt: { in: sensorData.map((d) => dayjs(d.time).toDate()) },
    //     },
    //   })
    // }

    // if (existingRecords.length > 0) {
    //   return NextResponse.json(
    //     { error: 'Records already exist for the provided dates.' },
    //     { status: 409 },
    //   )
    // }

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
