import { prisma } from '@/lib/prisma'
import type { GenerateDataModeType } from '@/types/generate-data-mode'

import { convertToUTC } from '@/utils/date-timezone-converter'
import { filterByInterval } from '@/utils/filter-by-interval'

import { generateSimulatedData, getInitialValue } from '@/utils/generate-data'
import dayjs from 'dayjs'
import { NextRequest, NextResponse } from 'next/server'
import type { InstrumentData, SensorData } from '../../../../../types'

interface GenerateDataRequest {
  startDate: string
  defrostDate: string
  endDate: string
  instrumentId: string
  variation: number
  initialValue?: number
  averageValue?: number
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

// async function getHistoricalData(instrumentType: string) {
//   try {
//     return await prisma.instrumentData.findMany({
//       where: {
//         instrument: {
//           type: instrumentType as 'TEMPERATURE' | 'PRESSURE',
//         },
//       },
//       take: 20,
//     })
//   } catch (error) {
//     console.warn('Failed to fetch historical data:', error)
//     return []
//   }
// }

/**
 * Formata os dados do sensor para o formato do banco
 */
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

export async function POST(request: NextRequest) {
  try {
    const body: GenerateDataRequest = await request.json()

    // Validação dos dados de entrada
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
      // averageValue,
      initialValue,
      generateMode = 'n1',
    } = body

    // Busca informações do instrumento
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

    // Busca dados históricos para calcular média se necessário
    // const historicalData = await getHistoricalData(instrument.type)

    // Calcula valores iniciais e médios
    // const avgValue = getAvgValue(
    //   instrument.type as 'TEMPERATURE' | 'PRESSURE',
    //   averageValue,
    //   historicalData,
    // )
    const initValue = getInitialValue(
      instrument.type as 'TEMPERATURE' | 'PRESSURE',
      initialValue,
    )

    const sensorData = generateSimulatedData({
      startDate,
      endDate,
      instrumentType: instrument.type as 'TEMPERATURE' | 'PRESSURE',
      initialValue: initValue,

      generateMode,
      defrostDate,
    })

    const formatInstrumentDataResult = formatInstrumentData(
      sensorData,
      instrumentId,
    )

    // Aplica filtro de variação
    const variationSensorData = filterByInterval(
      formatInstrumentDataResult,
      variation,
    )

    const formatReturnData = variationSensorData.map((item) => {
      return {
        id: item.id,
        updatedUserAt: item.userEditData,
        updatedAt: item.updatedAt,
        time: item.createdAt,
        value: item.editData,
      }
    })
    await prisma.instrumentData.createMany({
      data: formatInstrumentDataResult,
    })

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
