import { ListDataResponse } from '@/app/http/list-data'
import { prisma } from '@/lib/prisma'
import dayjs from 'dayjs'
import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const { local, graphVariation, tableVariation, startDate, endDate } =
    await req.json()
  if (!local || !graphVariation || !startDate || !endDate) {
    return NextResponse.json({ message: 'Missing data!' }, { status: 400 })
  }

  const formattedStartDate = dayjs(startDate).format('YYYY-MM-DDTHH:mm:ss[Z]')
  const formattedEndDate = dayjs(endDate)
    .add(1, 'minute')
    .format('YYYY-MM-DDTHH:mm:ss[Z]')
  const formattedEndDateNotAdd = dayjs(endDate).format('YYYY-MM-DDTHH:mm:ss[Z]')

  const union = await prisma.unionInstruments.findUnique({
    where: { id: local },
    select: {
      id: true,
      name: true,
      firstInstrument: {
        select: {
          temperatures: {
            where: {
              temperature: {
                createdAt: {
                  gte: formattedStartDate,
                  lte: formattedEndDate,
                },
              },
            },
            include: {
              temperature: {
                select: {
                  id: true,
                  editValue: true,
                  createdAt: true,
                  userUpdatedAt: true,
                  updatedAt: true,
                },
              },
            },
            orderBy: {
              temperature: {
                createdAt: 'asc',
              },
            },
          },
          pressures: {
            where: {
              pressure: {
                createdAt: {
                  gte: formattedStartDate,
                  lte: formattedEndDate,
                },
              },
            },
            include: {
              pressure: {
                select: {
                  id: true,
                  editValue: true,
                  createdAt: true,
                  userUpdatedAt: true,
                  updatedAt: true,
                },
              },
            },
            orderBy: {
              pressure: {
                createdAt: 'asc',
              },
            },
          },
        },
      },
      secondInstrument: {
        select: {
          temperatures: {
            where: {
              temperature: {
                createdAt: {
                  gte: formattedStartDate,
                  lte: formattedEndDate,
                },
              },
            },
            include: {
              temperature: {
                select: {
                  id: true,
                  editValue: true,
                  createdAt: true,
                  userUpdatedAt: true,
                  updatedAt: true,
                },
              },
            },
            orderBy: {
              temperature: {
                createdAt: 'asc',
              },
            },
          },
          pressures: {
            where: {
              pressure: {
                createdAt: {
                  gte: formattedStartDate,
                  lte: formattedEndDate,
                },
              },
            },
            include: {
              pressure: {
                select: {
                  id: true,
                  editValue: true,
                  createdAt: true,
                  userUpdatedAt: true,
                  updatedAt: true,
                },
              },
            },
            orderBy: {
              pressure: {
                createdAt: 'asc',
              },
            },
          },
        },
      },
    },
  })

  type FilterByIntervalItem = {
    id: string
    editValue: number
    createdAt: Date
    userUpdatedAt: string | null
    updatedAt: Date | null
  }

  type FilterByIntervalType<T extends 'temperature' | 'pressure'> = {
    [K in T]: FilterByIntervalItem
  }[]

  function filterByInterval<T extends 'temperature' | 'pressure'>({
    data,
    intervalMinutes,
    key,
  }: {
    data: FilterByIntervalType<T>
    intervalMinutes: number
    key: T
  }) {
    let lastTime: number | null = null
    const filtered: FilterByIntervalType<T> = []

    for (const item of data) {
      const tempTime = dayjs(item[key].createdAt).valueOf()

      if (!lastTime || tempTime >= lastTime + intervalMinutes * 60 * 1000) {
        filtered.push(item)
        lastTime = tempTime
      }
    }

    if (data.length > 0) {
      const lastTempTime = dayjs(data[data.length - 1][key].createdAt).valueOf()
      if (filtered.length === 0 || lastTempTime > lastTime!) {
        filtered.push(data[data.length - 1])
      }
    }

    return filtered.filter(
      (item, index, self) =>
        index ===
        self.findIndex((r) =>
          dayjs(r[key].createdAt).isSame(dayjs(item[key].createdAt), 'minute'),
        ),
    )
  }

  if (union) {
    const temp =
      union.firstInstrument.temperatures.length > 1
        ? union.firstInstrument.temperatures
        : union.secondInstrument.temperatures
    const press =
      union.firstInstrument.pressures.length > 1
        ? union.firstInstrument.pressures
        : union.secondInstrument.pressures
    const chartTemperature = filterByInterval({
      data: temp,
      intervalMinutes: graphVariation,
      key: 'temperature',
    })
    const chartPressure = filterByInterval({
      data: press,
      intervalMinutes: graphVariation,
      key: 'pressure',
    })
    const response: ListDataResponse = {
      id: union.id,
      name: union.name,
      chartType: 'temp/press',
      dateClose: formattedStartDate,
      dateOpen: formattedEndDateNotAdd,
      chartTemperature: chartTemperature.map((temp) => ({
        id: temp.temperature.id,
        time: temp.temperature.createdAt.toISOString(),
        value: temp.temperature.editValue,
        updatedUserAt: temp.temperature.userUpdatedAt,
        updatedAt: String(temp.temperature.updatedAt),
      })),
      chartPressure: chartPressure.map((press) => ({
        id: press.pressure.id,
        time: press.pressure.createdAt.toISOString(),
        value: press.pressure.editValue,
        updatedUserAt: press.pressure.userUpdatedAt,
        updatedAt: String(press.pressure.updatedAt),
      })),
    }

    if (tableVariation) {
      const tableTemperatureRange = filterByInterval({
        data: temp,
        intervalMinutes: tableVariation,
        key: 'temperature',
      })
      const tablePressureRange = filterByInterval({
        data: press,
        intervalMinutes: tableVariation,
        key: 'pressure',
      })
      response.tableTemperatureRange = tableTemperatureRange.map((temp) => ({
        id: temp.temperature.id,
        time: temp.temperature.createdAt.toISOString(),
        value: temp.temperature.editValue,
        updatedAt: String(temp.temperature.updatedAt),
        updatedUserAt: String(temp.temperature.userUpdatedAt),
      }))
      response.tablePressureRange = tablePressureRange.map((press) => ({
        id: press.pressure.id,
        time: press.pressure.createdAt.toISOString(),
        pressure: press.pressure.editValue,
      }))
    }

    return NextResponse.json(response, { status: 200 })
  }

  const data = await prisma.instrument.findUnique({
    where: {
      id: local,
    },
    select: {
      id: true,
      name: true,
      type: true,
      temperatures: {
        where: {
          temperature: {
            createdAt: {
              gte: formattedStartDate,
              lte: formattedEndDate,
            },
          },
        },
        include: {
          temperature: {
            select: {
              id: true,
              editValue: true,
              createdAt: true,
              userUpdatedAt: true,
              updatedAt: true,
            },
          },
        },
        orderBy: {
          temperature: {
            createdAt: 'asc',
          },
        },
      },
      pressures: {
        where: {
          pressure: {
            createdAt: {
              gte: formattedStartDate,
              lte: formattedEndDate,
            },
          },
        },
        include: {
          pressure: {
            select: {
              id: true,
              editValue: true,
              createdAt: true,
              userUpdatedAt: true,
              updatedAt: true,
            },
          },
        },
        orderBy: {
          pressure: {
            createdAt: 'asc',
          },
        },
      },
    },
  })

  if (!data) {
    return NextResponse.json({ message: 'Data is not locale' }, { status: 400 })
  }

  const chartTemperature = filterByInterval({
    data: data.temperatures,
    intervalMinutes: graphVariation,
    key: 'temperature',
  })
  const chartPressure = filterByInterval({
    data: data.pressures,
    intervalMinutes: graphVariation,
    key: 'pressure',
  })

  const response: ListDataResponse = {
    id: data.id,
    name: data.name,
    chartType: data.type === 'press' ? 'temp/press' : 'temp',
    dateClose: formattedStartDate,
    dateOpen: formattedEndDateNotAdd,
    chartTemperature: chartTemperature.map((temp) => ({
      id: temp.temperature.id,
      time: temp.temperature.createdAt.toISOString(),
      value: temp.temperature.editValue,
      updatedUserAt: temp.temperature.userUpdatedAt,
      updatedAt: String(temp.temperature.updatedAt),
    })),
    chartPressure: chartPressure.map((press) => ({
      id: press.pressure.id,
      time: press.pressure.createdAt.toISOString(),
      value: press.pressure.editValue,
      updatedUserAt: press.pressure.userUpdatedAt,
      updatedAt: String(press.pressure.updatedAt),
    })),
  }

  if (tableVariation) {
    const tableTemperatureRange = filterByInterval({
      data: data.temperatures,
      intervalMinutes: tableVariation,
      key: 'temperature',
    })
    response.tableTemperatureRange = tableTemperatureRange.map((temp) => ({
      id: temp.temperature.id,
      time: temp.temperature.createdAt.toISOString(),
      value: temp.temperature.editValue,
      updatedAt: String(temp.temperature.updatedAt),
      updatedUserAt: String(temp.temperature.userUpdatedAt),
    }))
  }

  return NextResponse.json(response, { status: 200 })
}
