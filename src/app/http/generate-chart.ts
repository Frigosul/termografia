export type GenerateChartRequest = {
  name: string
  graphVariation: string
  tableVariation: string
  limit: number
  detour: number
  variationTemp: number
  minValue: number
  maxValue: number
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
  name: string
  startDate: string
  endDate: string
  chartTemperature: TemperatureData[]
  tableTemperatureRange: TemperatureData[]
}

export async function generateChart({
  name,
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
    name,
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

  return data
}
