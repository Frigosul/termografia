import type { GenerateDataModeType } from '@/types/generate-data-mode'
import dayjs from 'dayjs'
import { v4 as uuidv4 } from 'uuid'
import type { SensorData } from '../../types'

interface GenerateSimulatedDataParams {
  startDate: string
  endDate: string
  instrumentType: 'TEMPERATURE' | 'PRESSURE'
  initialValue: number
  averageValue: number
  generateMode?: GenerateDataModeType
  defrostDate: string
}

export function generateSimulatedData({
  startDate,
  endDate,
  instrumentType,
  initialValue,
  averageValue,
  generateMode,
  defrostDate,
}: GenerateSimulatedDataParams): SensorData[] {
  const sensorData: SensorData[] = []
  let currentDate = dayjs(startDate)
  const formattedEndDate = dayjs(endDate).add(1, 'minute')
  const formattedDefrostDate = dayjs(defrostDate)

  let currentValue: number = initialValue
  let isFirstValue = true

  // PRESSURE
  let pressureCycleStart = currentDate.clone()
  let pressureCyclePhase: 'initial' | 'varying' | 'zero' = 'initial'

  // TEMPERATURE
  const tolerance = 0.5
  const maxNormal = averageValue + tolerance
  const minNormal = averageValue - tolerance
  const defrostPeak = averageValue + 3
  let defrostDone = false

  // N-Limits (para modos diferentes)
  const n1Limit = dayjs(startDate).add(4, 'hour')
  const n2Limit = dayjs(startDate).add(3, 'hour')
  const n3Limit = dayjs(startDate).add(2, 'hour')

  while (currentDate.isBefore(formattedEndDate)) {
    if (instrumentType === 'TEMPERATURE') {
      if (isFirstValue) {
        currentValue = initialValue
      } else {
        const limit =
          generateMode === 'n1'
            ? n1Limit
            : generateMode === 'n2'
              ? n2Limit
              : n3Limit

        // aproxima do averageValue antes do limite
        if (currentDate.isBefore(limit)) {
          if (initialValue > averageValue) {
            currentValue =
              initialValue - Math.random() * (initialValue - averageValue)
          } else if (initialValue < averageValue) {
            currentValue =
              initialValue + Math.random() * (averageValue - initialValue)
          } else {
            currentValue = initialValue
          }
        }

        // Degelo: sobe somente uma vez
        if (!defrostDone && currentDate.isAfter(formattedDefrostDate)) {
          currentValue = defrostPeak
          defrostDone = true
        } else {
          // Oscilação normal dentro da faixa média
          const direction = Math.random() < 0.5 ? -1 : 1
          const change = Math.random() * 0.1
          currentValue += direction * change

          // Clamp normal
          if (currentValue > maxNormal) currentValue = maxNormal
          if (currentValue < minNormal) currentValue = minNormal
        }
      }
    } else if (instrumentType === 'PRESSURE') {
      if (isFirstValue) {
        currentValue = initialValue
      } else {
        const minutesInCycle = currentDate.diff(pressureCycleStart, 'minute')

        if (pressureCyclePhase === 'initial') {
          if (minutesInCycle >= 3) {
            currentValue = 3.5 + (Math.random() * 0.5 - 0.25)
            pressureCyclePhase = 'varying'
          }
        } else if (pressureCyclePhase === 'varying') {
          const varyingDuration = 20 + Math.floor(Math.random() * 10)
          if (minutesInCycle < varyingDuration) {
            currentValue = 3.5 + (Math.random() * 1.5 - 0.75)
          } else {
            currentValue = 0
            pressureCyclePhase = 'zero'
          }
        } else if (pressureCyclePhase === 'zero') {
          const zeroDuration = 10 + Math.floor(Math.random() * 5)
          if (minutesInCycle >= 23 + zeroDuration) {
            pressureCycleStart = currentDate.clone()
            pressureCyclePhase = 'initial'
            currentValue = 0
          }
        }
      }
    }

    // garante valor válido
    if (
      isNaN(currentValue) ||
      currentValue === null ||
      currentValue === undefined
    ) {
      currentValue = instrumentType === 'TEMPERATURE' ? initialValue : 0
    }

    // cria item de sensor
    const sensorItem: SensorData = {
      id: uuidv4(),
      time: currentDate.format('YYYY-MM-DDTHH:mm:ss'),
      value: Number(currentValue.toFixed(1)),
      updatedAt: new Date(currentDate.format('YYYY-MM-DDTHH:mm:ss')),
    }
    sensorData.push(sensorItem)

    isFirstValue = false
    currentDate = currentDate.add(1, 'minute')
  }

  return sensorData
}

export function getInitialValue(
  type: 'TEMPERATURE' | 'PRESSURE',
  initialValue?: number,
): number {
  if (typeof initialValue === 'number') return initialValue
  return type === 'TEMPERATURE' ? 15 : 0
}

type RecordData = {
  id: string
  data: number
}

export function getAvgValue(
  type: 'TEMPERATURE' | 'PRESSURE',
  averageValue: number | undefined,
  historicalData: RecordData[],
): number {
  if (typeof averageValue === 'number') return averageValue

  if (historicalData.length > 0) {
    const sum = historicalData.reduce((acc, record) => acc + record.data, 0)
    return sum / historicalData.length
  }

  return type === 'TEMPERATURE' ? 10 : 3.5
}
