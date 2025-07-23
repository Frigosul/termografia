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

function filterByInterval<T extends DataItem>(
  data: T[],
  intervalMinutes: number,
): T[] {
  if (data.length === 0) {
    return []
  }

  const result: T[] = []

  // Ordena os dados por createdAt para garantir ordem cronológica
  const sortedData = [...data].sort(
    (a, b) => dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf(),
  )

  // Começa do primeiro item, arredondando para o minuto
  let currentIntervalStart = dayjs(sortedData[0].createdAt)
    .second(0)
    .millisecond(0)

  // Calcula o último timestamp a ser considerado para a iteração
  const lastDataTime = dayjs(sortedData[sortedData.length - 1].createdAt)

  let dataIndex = 0
  let lastKnownValue: number | null = null

  while (
    currentIntervalStart.valueOf() <=
    lastDataTime.valueOf() + intervalMinutes * 60 * 1000
  ) {
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

  return result
}

export { filterByInterval }
