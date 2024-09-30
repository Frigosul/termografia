export type GenerateChartRequest = {
  local: string
  graphVariation: string
  tableVariation: string
  limit?: number
  detour?: number
  variationTemp?: number
  minValue?: number
  maxValue?: number
  startDate: string
  endDate: string
  description?: string
}
type TemperatureData = {
  time: Date
  temp: number
}
export type GenerateChartResponse = {
  id: string
  local: string
  chartType: 'temp' | 'press'
  dateClose: Date
  dateOpen: Date
  minValue?: number
  maxValue?: number
  limit?: number
  variationTemp?: number
  chartTemperature: TemperatureData[]
  tableTemperatureRange: TemperatureData[]
}

export async function generateChart({
  local,
  graphVariation,
  tableVariation,
  limit,
  detour,
  variationTemp,
  minValue,
  maxValue,
  startDate,
  endDate,
  description = '',
}: GenerateChartRequest): Promise<GenerateChartResponse> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dataBody = {
    local,
    graphVariation,
    tableVariation,
    limit,
    detour,
    variationTemp,
    minValue,
    maxValue,
    startDate,
    endDate,
    description,
  }
  const response = await fetch('http://localhost:3333/chart')
  const data = await response.json()

  const dataAndValues = {
    ...data,
    minValue,
    maxValue,
    variationTemp,
    limit,
  }

  return dataAndValues
}
