import { prisma } from '@/lib/prisma'
import type { GenerateDataModeType } from '@/types/generate-data-mode'
import { Prisma } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import type { InstrumentData, SensorData } from '../../../../../types'

import { convertToUTC } from '@/utils/date-timezone-converter'
import { filterByInterval } from '@/utils/filter-by-interval'
import {
  generateSimulatedData,
  getAvgValue,
  getInitialValue,
} from '@/utils/generate-data'

import dayjs from 'dayjs'

interface GenerateDataRequest {
  startDate: string
  defrostDate: string
  endDate: string
  instrumentId: string
  variation: number
  initialTemp?: number
  averageTemp?: number
  generateMode?: GenerateDataModeType
  instrumentType: 'TEMPERATURE' | 'PRESSURE'
}

interface ValidationResult {
  isValid: boolean
  error?: string
}

function validateRequestData(body: GenerateDataRequest): ValidationResult {
  const { startDate, defrostDate, endDate, instrumentId, variation } = body

  if (!startDate || !defrostDate || !endDate || !instrumentId || !variation) {
    return { isValid: false, error: 'Missing required data.' }
  }

  const start = dayjs(startDate)
  const end = dayjs(endDate)
  const defrost = dayjs(defrostDate)

  if (!start.isValid() || !end.isValid() || !defrost.isValid()) {
    return { isValid: false, error: 'Invalid date format.' }
  }

  if (start.isAfter(end)) {
    return { isValid: false, error: 'Start date must be before end date.' }
  }

  return { isValid: true }
}

async function getHistoricalData(instrumentType: 'TEMPERATURE' | 'PRESSURE') {
  try {
    return await prisma.instrumentData.findMany({
      where: {
        instrument: {
          type: instrumentType as 'TEMPERATURE' | 'PRESSURE',
        },
      },
      select: {
        data: true,
        id: true,
      },
      take: 20,
    })
  } catch (error) {
    console.warn('Failed to fetch historical data:', error)
    return []
  }
}

function formatInstrumentData(
  sensorData: SensorData[],
  instrumentId: string,
): InstrumentData[] {
  return sensorData.map((item) => ({
    instrumentId,
    id: item.id,
    createdAt: convertToUTC(item.time),
    updatedAt: convertToUTC(item.updatedAt),
    data: item.value,
    editData: item.value,
    userEditData: null,
  }))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function saveInstrumentData(formatInstrumentDataResult: any[]) {
  if (formatInstrumentDataResult.length === 0) return

  const batchSize = 5000

  for (let i = 0; i < formatInstrumentDataResult.length; i += batchSize) {
    const batch = formatInstrumentDataResult.slice(i, i + batchSize)

    const values = Prisma.join(
      batch.map(
        (d) =>
          Prisma.sql`(
          gen_random_uuid(),
          ${d.createdAt},
          now(),
          ${d.instrumentId},
          ${d.data},
          ${d.editData},
          ${d.generateData ?? null},
          ${d.userEditData ?? null}
        )`,
      ),
    )

    await prisma.$executeRaw`
    INSERT INTO "instrument_data" (
      id,
      created_at,
      updated_at,
      instrument_id,
      data,
      edit_data,
      generate_data,
      user_edit_data
    )
    VALUES ${values}
    ON CONFLICT ("instrument_id", "created_at")
    DO UPDATE SET "edit_data" = EXCLUDED."edit_data"
  `
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateDataRequest = await request.json()

    const validation = validateRequestData(body)
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const {
      startDate,
      defrostDate,
      endDate,
      instrumentId,
      variation,
      averageTemp,
      initialTemp,
      generateMode = 'n1',
    } = body

    const instrument = await prisma.instrument.findUnique({
      where: { id: instrumentId },
      select: { type: true },
    })

    if (!instrument) {
      return NextResponse.json(
        { message: 'Instrument not found.' },
        { status: 404 },
      )
    }

    const historicalData = await getHistoricalData(instrument.type)

    const avgValue = getAvgValue(
      instrument.type as 'TEMPERATURE' | 'PRESSURE',
      averageTemp,
      historicalData,
    )

    const initValue = getInitialValue(
      instrument.type as 'TEMPERATURE' | 'PRESSURE',
      initialTemp,
    )

    const sensorData = generateSimulatedData({
      startDate,
      endDate,
      instrumentType: instrument.type as 'TEMPERATURE' | 'PRESSURE',
      initialValue: initValue,
      averageValue: avgValue,
      generateMode,
      defrostDate,
    })

    const formatInstrumentDataResult = formatInstrumentData(
      sensorData,
      instrumentId,
    )

    const variationSensorData = await filterByInterval({
      data: formatInstrumentDataResult,
      intervalMinutes: variation,
      endDate,
      instrumentId,
    })

    const formatReturnData = variationSensorData.map((item) => {
      return {
        id: item.id,
        updatedUserAt: item.userEditData,
        updatedAt: item.updatedAt,
        time: item.createdAt,
        value: item.editData,
      }
    })

    await saveInstrumentData(formatInstrumentDataResult)

    return NextResponse.json(
      {
        message: 'Data successfully generated.',
        data: formatReturnData,
        instrumentType: instrument.type,
      },
      { status: 201 },
    )
  } catch (error: unknown) {
    console.error('Error generating or saving data:', error)
    return NextResponse.json(
      {
        error: 'Internal server error.',
      },
      { status: 500 },
    )
  }
}
