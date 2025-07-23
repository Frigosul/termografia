import { ListDataResponse } from '@/app/http/list-data'
import { prisma } from '@/lib/prisma'
import { convertToUTC } from '@/utils/date-timezone-converter'
import { filterByInterval, type DataItem } from '@/utils/filter-by-interval'
import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const { local, graphVariation, tableVariation, startDate, endDate } =
    await req.json()

  if (!local || !graphVariation || !startDate || !endDate) {
    return NextResponse.json({ message: 'Missing data!' }, { status: 400 })
  }

  const instrumentData = await prisma.instrument.findUnique({
    where: {
      id: local,
    },
    select: {
      id: true,
      name: true,
      type: true,
      instrumentData: {
        select: {
          editData: true,
          createdAt: true,
          updatedAt: true,
          userEditData: true,
          id: true,
        },
        where: {
          createdAt: {
            gte: convertToUTC(startDate),
            lte: convertToUTC(endDate),
          },
        },
      },
    },
  })
  if (!instrumentData) {
    const joinInstrumentData = await prisma.joinInstrument.findUnique({
      where: {
        id: local,
      },
      select: {
        id: true,
        name: true,
        firstInstrument: {
          select: {
            type: true,
          },
          include: {
            instrumentData: {
              select: {
                editData: true,
                createdAt: true,
                updatedAt: true,
                userEditData: true,
                id: true,
              },
              where: {
                createdAt: {
                  gte: convertToUTC(startDate),
                  lte: convertToUTC(endDate),
                },
              },
            },
          },
        },
        secondInstrument: {
          select: {
            type: true,
          },
          include: {
            instrumentData: {
              select: {
                editData: true,
                createdAt: true,
                updatedAt: true,
                userEditData: true,
                id: true,
              },
              where: {
                createdAt: {
                  gte: convertToUTC(startDate),
                  lte: convertToUTC(endDate),
                },
              },
            },
          },
        },
      },
    })

    if (!joinInstrumentData) {
      return NextResponse.json({ Message: 'Local not found' }, { status: 400 })
    }
    interface chartTemperaturePressure {
      id: string
      createdAt: Date
      updatedAt: Date
      editData: number
      userEditData: string | null
    }

    let chartTemperature: chartTemperaturePressure[] = []

    if (joinInstrumentData?.firstInstrument?.type === 'TEMPERATURE') {
      chartTemperature = filterByInterval(
        joinInstrumentData.firstInstrument.instrumentData as [],
        graphVariation,
      )
    } else if (joinInstrumentData?.secondInstrument?.type === 'TEMPERATURE') {
      chartTemperature = filterByInterval(
        joinInstrumentData.secondInstrument.instrumentData as [],
        graphVariation,
      )
    }
    let chartPressure: chartTemperaturePressure[] = []

    if (joinInstrumentData?.firstInstrument?.type === 'TEMPERATURE') {
      chartPressure = filterByInterval(
        joinInstrumentData.firstInstrument.instrumentData as [],
        graphVariation,
      )
    } else if (joinInstrumentData?.secondInstrument?.type === 'TEMPERATURE') {
      chartPressure = filterByInterval(
        joinInstrumentData.secondInstrument.instrumentData as [],
        graphVariation,
      )
    }

    const response: ListDataResponse = {
      id: local,
      name: joinInstrumentData.name,
      chartType: 'temp/press',
      dateClose: startDate,
      dateOpen: endDate,
      chartTemperature: chartTemperature!.map((temp) => ({
        id: temp.id,
        time: temp.createdAt.toISOString(),
        value: temp.editData,
        updatedUserAt: temp.userEditData,
        updatedAt: temp.updatedAt,
      })),
      chartPressure: chartPressure!.map((press) => ({
        id: press.id,
        time: press.createdAt.toISOString(),
        value: press.editData!,
        updatedUserAt: press.userEditData,
        updatedAt: press.updatedAt,
      })),
    }

    if (tableVariation) {
      let tableTemperatureRange: chartTemperaturePressure[] = []

      if (joinInstrumentData?.firstInstrument?.type === 'TEMPERATURE') {
        tableTemperatureRange = filterByInterval(
          joinInstrumentData.firstInstrument.instrumentData as [],
          graphVariation,
        )
      } else if (joinInstrumentData?.secondInstrument?.type === 'TEMPERATURE') {
        tableTemperatureRange = filterByInterval(
          joinInstrumentData.secondInstrument.instrumentData as [],
          graphVariation,
        )
      }
      let tablePressureRange: chartTemperaturePressure[] = []

      if (joinInstrumentData?.firstInstrument?.type === 'TEMPERATURE') {
        tablePressureRange = filterByInterval(
          joinInstrumentData.firstInstrument.instrumentData as [],
          graphVariation,
        )
      } else if (joinInstrumentData?.secondInstrument?.type === 'TEMPERATURE') {
        tablePressureRange = filterByInterval(
          joinInstrumentData.secondInstrument.instrumentData as [],
          graphVariation,
        )
      }

      response.tableTemperatureRange = tableTemperatureRange.map((temp) => ({
        id: temp.id,
        time: temp.createdAt.toISOString(),
        value: temp.editData,
        updatedAt: temp.updatedAt,
        updatedUserAt: temp.userEditData,
      }))

      response.tablePressureRange = tablePressureRange.map((press) => ({
        id: press.id,
        time: press.createdAt.toISOString(),
        pressure: press.editData!,
      }))
    }

    return NextResponse.json(response, { status: 200 })
  }

  const chartTemperature = filterByInterval(
    instrumentData?.instrumentData,
    graphVariation,
  )


  let chartPressure: DataItem[] = []
  if (instrumentData.type === 'PRESSURE') {
    chartPressure = filterByInterval(
      instrumentData?.instrumentData,
      graphVariation,
    )
  }

  const response: ListDataResponse = {
    id: local,
    name: instrumentData.name,
    chartType: instrumentData.type === 'PRESSURE' ? 'temp/press' : 'temp',
    dateClose: startDate,
    dateOpen: endDate,
    chartTemperature: chartTemperature.map((temp) => ({
      id: temp.id,
      time: temp.createdAt.toISOString(),
      value: temp.editData,
      updatedUserAt: temp.userEditData,
      updatedAt: temp.updatedAt,
    })),
    chartPressure: chartPressure.map((press) => ({
      id: press.id,
      time: press.createdAt.toISOString(),
      value: press.editData!,
      updatedUserAt: press.userEditData,
      updatedAt: press.updatedAt,
    })),
  }

  if (tableVariation) {
    const tableTemperatureRange = filterByInterval(
      instrumentData?.instrumentData,
      tableVariation,
    )
    const tablePressureRange =
      instrumentData.type === 'PRESSURE'
        ? filterByInterval(instrumentData?.instrumentData, tableVariation)
        : []

    response.tableTemperatureRange = tableTemperatureRange.map((temp) => ({
      id: temp.id,
      time: temp.createdAt.toISOString(),
      value: temp.editData,
      updatedAt: temp.updatedAt,
      updatedUserAt: temp.userEditData,
    }))

    response.tablePressureRange = tablePressureRange.map((press) => ({
      id: press.id,
      time: press.createdAt.toISOString(),
      pressure: press.editData!,
    }))
  }

  return NextResponse.json(response, { status: 200 })
}
