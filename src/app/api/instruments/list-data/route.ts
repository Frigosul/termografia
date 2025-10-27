/* eslint-disable prettier/prettier */
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
      chartTemperature = await filterByInterval({
        data: joinInstrumentData.firstInstrument.instrumentData,
        intervalMinutes: graphVariation,
        endDate,
        instrumentId: joinInstrumentData.firstInstrument.id,
      })
    } else if (joinInstrumentData?.secondInstrument?.type === 'TEMPERATURE') {
      chartTemperature = await filterByInterval({
        data: joinInstrumentData.secondInstrument.instrumentData,
        intervalMinutes: graphVariation,
        endDate,
        instrumentId: joinInstrumentData.secondInstrument.id,
      })
    }
    let chartPressure: chartTemperaturePressure[] = []

    if (joinInstrumentData?.firstInstrument?.type === 'PRESSURE') {
      chartPressure = await filterByInterval({
        data: joinInstrumentData.firstInstrument.instrumentData,
        intervalMinutes: graphVariation,
        endDate,
        instrumentId: joinInstrumentData.firstInstrument.id,
      })
    } else if (joinInstrumentData?.secondInstrument?.type === 'PRESSURE') {
      chartPressure = await filterByInterval({
        data: joinInstrumentData.secondInstrument.instrumentData,
        intervalMinutes: graphVariation,
        endDate,
        instrumentId: joinInstrumentData.secondInstrument.id,
      })
    }

    const response: ListDataResponse = {
      id: local,
      name: joinInstrumentData.name,
      chartType: 'temp/press',
      dateClose: startDate,
      dateOpen: endDate,
      joinInstrument: true,
      chartTemperature: chartTemperature!.map((temp) => ({
        id: temp.id,
        time: temp.createdAt.toISOString(),
        value: temp.editData,
        updatedUserAt: temp.userEditData,
        updatedAt: String(temp.updatedAt),
        originalValue: temp.editData,
      })),
      chartPressure: chartPressure!.map((press) => ({
        id: press.id,
        time: press.createdAt.toISOString(),
        value: press.editData!,
        updatedUserAt: press.userEditData,
        updatedAt: String(press.updatedAt),
        originalValue: press.editData,
      })),
    }

    if (tableVariation) {
      let tableTemperatureRange: chartTemperaturePressure[] = []

      if (joinInstrumentData?.firstInstrument?.type === 'TEMPERATURE') {
        tableTemperatureRange = await filterByInterval({
          data: joinInstrumentData.firstInstrument.instrumentData,
          intervalMinutes: tableVariation,
          endDate,
          instrumentId: joinInstrumentData.firstInstrument.id,
        })
      } else if (joinInstrumentData?.secondInstrument?.type === 'TEMPERATURE') {
        tableTemperatureRange = await filterByInterval({
          data: joinInstrumentData.secondInstrument.instrumentData,
          intervalMinutes: tableVariation,
          endDate,
          instrumentId: joinInstrumentData.secondInstrument.id,
        })
      }
      let tablePressureRange: chartTemperaturePressure[] = []

      if (joinInstrumentData?.firstInstrument?.type === 'PRESSURE') {
        tablePressureRange = await filterByInterval({
          data: joinInstrumentData.firstInstrument.instrumentData,
          intervalMinutes: tableVariation,
          endDate,
          instrumentId: joinInstrumentData.firstInstrument.id,
        })
      } else if (joinInstrumentData?.secondInstrument?.type === 'PRESSURE') {
        tablePressureRange = await filterByInterval({
          data: joinInstrumentData.secondInstrument.instrumentData,
          intervalMinutes: tableVariation,
          endDate,
          instrumentId: joinInstrumentData.secondInstrument.id,
        })
      }

      response.tableTemperatureRange = tableTemperatureRange.map((temp) => ({
        id: temp.id,
        time: temp.createdAt.toISOString(),
        value: temp.editData,
        updatedAt: String(temp.updatedAt),
        originalValue: temp.editData,
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

  const chartTemperature = await filterByInterval({
    data: instrumentData?.instrumentData,
    intervalMinutes: graphVariation,
    endDate,
    instrumentId: instrumentData.id,
  })

  let chartPressure: DataItem[] = []
  if (instrumentData.type === 'PRESSURE') {
    chartPressure = await filterByInterval({
      instrumentId: instrumentData.id,
      data: instrumentData?.instrumentData,
      intervalMinutes: graphVariation,
      endDate,
    })
  }

  const response: ListDataResponse = {
    id: local,
    name: instrumentData.name,
    chartType: instrumentData.type === 'PRESSURE' ? 'temp/press' : 'temp',
    dateClose: startDate,
    dateOpen: endDate,
    joinInstrument: false,
    chartTemperature: chartTemperature.map((temp) => ({
      id: temp.id,
      time: temp.createdAt.toISOString(),
      value: temp.editData,
      updatedUserAt: temp.userEditData,
      updatedAt: String(temp.updatedAt),
      originalValue: temp.editData,
    })),
    chartPressure: chartPressure.map((press) => ({
      id: press.id,
      time: press.createdAt.toISOString(),
      value: press.editData!,
      updatedUserAt: press.userEditData,
      updatedAt: String(press.updatedAt),
      originalValue: press.editData,
    })),
  }


  if (tableVariation) {
    const tableTemperatureRange = await filterByInterval({
      data: instrumentData?.instrumentData,
      intervalMinutes: tableVariation,
      endDate,
      instrumentId: instrumentData.id,
    })
    const tablePressureRange =
      instrumentData.type === 'PRESSURE'
        ? await filterByInterval({
          data: instrumentData?.instrumentData,
          intervalMinutes: tableVariation,
          endDate,
          instrumentId: instrumentData.id,
        })
        : []

    response.tableTemperatureRange = tableTemperatureRange.map((temp) => ({
      id: temp.id,
      time: temp.createdAt.toISOString(),
      value: temp.editData,
      updatedAt: String(temp.updatedAt),
      originalValue: temp.editData,
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
