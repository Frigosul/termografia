import type { GenerateDataModeType } from '@/types/generate-data-mode'
import dayjs from 'dayjs'
import { v4 as uuidv4 } from 'uuid'
import type { SensorData } from '../../types'

interface GenerateSimulatedDataParams {
  startDate: string
  endDate: string
  instrumentType: 'TEMPERATURE' | 'PRESSURE'
  initialValue: number

  generateMode?: GenerateDataModeType
  defrostDate: string
}

export function generateSimulatedData({
  startDate,
  endDate,
  instrumentType,
  initialValue,

  generateMode,
  defrostDate,
}: GenerateSimulatedDataParams): SensorData[] {
  const sensorData: SensorData[] = []
  let currentDate = dayjs(startDate)
  const formattedEndDate = dayjs(endDate).add(1, 'minute')
  const formattedDefrostDate = dayjs(defrostDate)

  let currentValue: number = initialValue
  let pressureCycleStart = currentDate.clone()
  let pressureCyclePhase: 'initial' | 'varying' | 'zero' = 'initial'

  const n1Limit = dayjs(startDate).add(5, 'hour')
  const n2Limit = dayjs(startDate).add(4, 'hour')
  const n3Limit = dayjs(startDate).add(3, 'hour')

  while (currentDate.isBefore(formattedEndDate)) {
    if (instrumentType === 'TEMPERATURE') {
      if (
        generateMode === 'n1' ||
        generateMode === 'n2' ||
        generateMode === 'n3'
      ) {
        const limit =
          generateMode === 'n1'
            ? n1Limit
            : generateMode === 'n2'
              ? n2Limit
              : n3Limit
        if (currentDate.isBefore(limit)) {
          currentValue = initialValue - Math.random() * 0.7
        } else {
          // Gerar um novo valor com variação mínima de 1 grau
          const minChange = 1 // Variação mínima de 1 grau
          const direction = Math.random() < 0.5 ? -1 : 1 // Aleatoriamente para cima ou para baixo
          const change = minChange + Math.random() * 0.5 // Variação de 1 a 1.5 graus
          currentValue += direction * change

          // Garantir que o valor se mantenha dentro de um intervalo realista para câmara fria (ex: -5 a 20)
          if (currentValue > 20) currentValue = 20 - Math.random()
          if (currentValue < -5) currentValue = -5 + Math.random()
        }
      }
      if (currentDate.isAfter(formattedDefrostDate)) {
        currentValue += Math.random() * 3
      }
    } else if (instrumentType === 'PRESSURE') {
      const minutesInCycle = currentDate.diff(pressureCycleStart, 'minute')

      if (pressureCyclePhase === 'initial') {
        if (minutesInCycle >= 3) {
          currentValue = 3.5 + (Math.random() * 0.5 - 0.25) // Pequena variação
          pressureCyclePhase = 'varying'
        }
      } else if (pressureCyclePhase === 'varying') {
        // Duração da fase varying mais dinâmica
        const varyingDuration = 20 + Math.floor(Math.random() * 10) // Entre 20 e 29 minutos
        if (minutesInCycle < varyingDuration) {
          currentValue = 3.5 + (Math.random() * 1.5 - 0.75) // Variação maior
        } else {
          currentValue = 0
          pressureCyclePhase = 'zero'
        }
      } else if (pressureCyclePhase === 'zero') {
        // Duração da fase zero mais dinâmica
        const zeroDuration = 10 + Math.floor(Math.random() * 5) // Entre 10 e 14 minutos
        if (minutesInCycle >= 23 + zeroDuration) {
          // 23 é o mínimo da varying, somar a duração da zero
          pressureCycleStart = currentDate.clone()
          pressureCyclePhase = 'initial'
          currentValue = 0
        }
      }
    }

    // Garantir que o valor nunca seja NaN ou null
    if (
      isNaN(currentValue) ||
      currentValue === null ||
      currentValue === undefined
    ) {
      currentValue = instrumentType === 'TEMPERATURE' ? initialValue : 0
    }

    const sensorItem: SensorData = {
      id: uuidv4(),
      time: currentDate.format('YYYY-MM-DDTHH:mm:ss'),
      value: Number(currentValue.toFixed(1)),
      updatedAt: new Date(currentDate.format('YYYY-MM-DDTHH:mm:ss')),
    }
    sensorData.push(sensorItem)

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

export function getAvgValue(
  type: 'TEMPERATURE' | 'PRESSURE',
  averageValue: number | undefined,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  historicalData: any[],
): number {
  if (typeof averageValue === 'number') return averageValue
  if (historicalData.length) {
    return (
      historicalData.reduce(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (sum: number, record: any) => sum + record.value,
        0,
      ) / historicalData.length
    )
  }
  return type === 'TEMPERATURE' ? 10 : 3.5
}
