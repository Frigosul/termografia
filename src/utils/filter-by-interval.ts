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
  let generatedEditData: number

  if (lastKnownValue !== null) {
    const increment = 0.1 + Math.random() * 0.4 // Entre 0.1 e 0.5
    generatedEditData = lastKnownValue + increment
  } else {
    generatedEditData = 10.0 + Math.random() * 5 // Valor inicial entre 10.0 e 15.0
  }

  return {
    id: uuidv4(),
    createdAt: timestamp,
    updatedAt: timestamp,
    editData: parseFloat(generatedEditData.toFixed(2)), // Arredonda para 2 casas decimais
    userEditData: null,
  }
}

export function filterByInterval<T extends DataItem>(
  data: T[],
  intervalMinutes: number,
  endDate?: string,
): T[] {
  if (data.length === 0) {
    return []
  }
  console.log(endDate)

  const result: T[] = []

  // Ordena os dados por createdAt para garantir ordem cronológica
  const sortedData = [...data].sort(
    (a, b) => dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf(),
  )

  // Começa do primeiro item, arredondando para o minuto
  let currentIntervalStart = dayjs(sortedData[0].createdAt)
    .second(0)
    .millisecond(0)

  // Se endDate foi passado, ele define o limite; senão usa o último dado
  const endLimit = endDate
    ? dayjs(endDate)
    : dayjs(sortedData[sortedData.length - 1].createdAt)

  let dataIndex = 0
  let lastKnownValue: number | null = null

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

    if (!foundItemInInterval) {
      const generatedItem = generateMissingDataItem(
        currentIntervalStart.toDate(),
        lastKnownValue,
      )
      result.push(generatedItem as T)
    } else {
      result.push(itemToPush as T)
      lastKnownValue = (itemToPush as T).editData
    }

    currentIntervalStart = intervalEnd
  }

  // 🔒 Garante que o último valor seja exatamente no endDate (se passado)
  if (endDate) {
    const lastItemTime = dayjs(result[result.length - 1]?.createdAt)
    const end = dayjs(endDate)

    if (!lastItemTime.isSame(end)) {
      let generatedItem = generateMissingDataItem(end.toDate(), lastKnownValue)
      generatedItem = {
        ...generatedItem,
        createdAt: end.toDate(),
      }
      result.push(generatedItem as T)
    }
  }

  return result
}
