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
  temperature: number
}
export type GenerateChartResponse = {
  id: string
  name: string
  chartType: 'temp' | 'press'
  dateClose: Date
  dateOpen: Date
  minValue?: number
  detour?: number
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

  }
  const response = await fetch('http://localhost:3000/api/instruments/generate-chart', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dataBody)
  })
  const data = await response.json()

  const dataAndValues = {
    ...data,
    minValue,
    maxValue,
    variationTemp,
    limit,
    detour,
    description,
  }

  return dataAndValues
}
