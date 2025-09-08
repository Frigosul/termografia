import { prisma } from '@/lib/prisma'
import dayjs from 'dayjs'
import { v4 as uuidv4 } from 'uuid'

export interface DataItem {
  id: string
  createdAt: Date
  updatedAt: Date
  editData: number
  userEditData: string | null
}

export function generateMissingDataItem(
  timestamp: Date,
  lastKnownValue: number | null,
): DataItem {
  const generatedEditData =
    lastKnownValue !== null
      ? lastKnownValue + 0.1 + Math.random() * 0.4 // Entre 0.1 e 0.5
      : 10.0 + Math.random() * 5 // Valor inicial entre 10 e 15

  return {
    id: uuidv4(),
    createdAt: timestamp,
    updatedAt: timestamp,
    editData: parseFloat(generatedEditData.toFixed(2)),
    userEditData: null,
  }
}

interface FilterByIntervalParams<T> {
  data: T[]
  intervalMinutes: number
  endDate: string
  instrumentId: string
}

export async function filterByInterval<T extends DataItem>({
  data,
  endDate,
  instrumentId,
  intervalMinutes,
}: FilterByIntervalParams<T>): Promise<T[]> {
  if (data.length === 0) return []

  const result: T[] = []
  const sortedData = [...data].sort(
    (a, b) => dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf(),
  )

  let currentIntervalStart = dayjs(sortedData[0].createdAt)
    .second(0)
    .millisecond(0)

  const endLimit = endDate
    ? dayjs(endDate)
    : dayjs(sortedData[sortedData.length - 1].createdAt)

  let dataIndex = 0
  let lastKnownValue: number | null = null

  // Loop pelos intervalos
  while (currentIntervalStart.valueOf() <= endLimit.valueOf()) {
    const intervalEnd = currentIntervalStart.add(intervalMinutes, 'minute')
    let foundItemInInterval = false
    let itemToPush: T | null = null

    while (dataIndex < sortedData.length) {
      const currentItem = sortedData[dataIndex]
      const itemTime = dayjs(currentItem.createdAt)

      if (
        itemTime.valueOf() >= currentIntervalStart.valueOf() &&
        itemTime.valueOf() < intervalEnd.valueOf()
      ) {
        itemToPush = currentItem
        foundItemInInterval = true
        dataIndex++
        break
      } else if (itemTime.valueOf() >= intervalEnd.valueOf()) {
        break
      }
      dataIndex++
    }

    if (foundItemInInterval && itemToPush) {
      result.push(itemToPush)
      lastKnownValue = itemToPush.editData
    } else {
      const generatedItem = generateMissingDataItem(
        currentIntervalStart.toDate(),
        lastKnownValue,
      )
      result.push(generatedItem as T)
      lastKnownValue = generatedItem.editData
    }

    currentIntervalStart = intervalEnd
  }

  // Processa o último item no endDate
  if (endDate) {
    const end = dayjs(endDate)
    const lastItem = result[result.length - 1]

    // Busca no banco primeiro
    let finalItem = await prisma.instrumentData.findFirst({
      where: {
        instrumentId,
        createdAt: end.toDate(),
      },
    })

    let finalValue: number

    if (finalItem) {
      // Valor já existente
      finalValue = finalItem.editData
    } else {
      // Gera novo item
      const generatedItem = generateMissingDataItem(
        end.toDate(),
        lastKnownValue,
      )
      finalValue = generatedItem.editData

      // Salva no banco
      finalItem = await prisma.instrumentData.create({
        data: {
          instrumentId,
          editData: finalValue,
          data: finalValue,
          createdAt: generatedItem.createdAt,
        },
      })
    }

    // Só adiciona no array se o último item tiver timestamp diferente
    if (!dayjs(lastItem.createdAt).isSame(end, 'second')) {
      result.push({
        id: finalItem.id,
        createdAt: finalItem.createdAt,
        updatedAt: finalItem.updatedAt,
        editData: finalItem.editData,
        userEditData: finalItem.userEditData,
      } as T)
    }

    lastKnownValue = finalValue
  }

  return result
}
