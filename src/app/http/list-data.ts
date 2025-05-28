import { fetchServer } from '@/middlewares/fetch-server'

export type ListDataRequest = {
  local: string
  graphVariation: string
  tableVariation?: string
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
  id: string
  updatedUserAt: string | null
  updatedAt: string
  time: string
  value: number
}
type PressureData = {
  id: string
  updatedUserAt: string | null
  updatedAt: string
  time: string
  value: number
}
type PressureDataTable = {
  id: string
  time: string
  pressure: number
}
export type ListDataResponse = {
  id: string
  name: string
  chartType?: 'temp' | 'temp/press'
  dateClose: string
  dateOpen: string
  minValue?: number
  detour?: number
  maxValue?: number
  limit?: number
  variationTemp?: number
  chartTemperature: TemperatureData[]
  tableTemperatureRange?: TemperatureData[]
  tablePressureRange?: PressureDataTable[]
  chartPressure?: PressureData[]
  error?: string
  description?: string
}

export async function listData({
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
}: ListDataRequest): Promise<ListDataResponse> {
  const response = await fetchServer('/api/instruments/list-data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
    body: JSON.stringify({
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
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    return Promise.reject({
      status: response.status,
      message: error.message || 'Error api',
    })
  }
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
