import { fetchServer } from '@/middlewares/fetch-server'
import { GenerateDataModeType } from '@/types/generate-data-mode'

export interface GenerateDataRequest {
  startDate: string
  defrostDate: string
  endDate: string
  instrumentId: string
  variation: number
  userName: string
  initialTemp?: number
  averageTemp?: number
  generateMode?: GenerateDataModeType
}

export interface GenerateDataResponse {
  data: {
    id: string
    updatedUserAt: string | null
    updatedAt: string
    time: string
    value: number
  }[]
  instrumentType: 'PRESSURE' | 'TEMPERATURE'
  error?: string
}

export async function generateData({
  instrumentId,
  variation,
  defrostDate,
  endDate,
  startDate,
  averageTemp,
  generateMode,
  initialTemp,
  userName,
}: GenerateDataRequest): Promise<GenerateDataResponse> {
  const response = await fetchServer(`/api/instruments/generate-data`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      instrumentId,
      variation,
      defrostDate,
      endDate,
      startDate,
      userName,
      averageTemp,
      generateMode,
      initialTemp,
    }),
  })
  if (!response.ok) {
    const error = await response.json()
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject({
      status: response.status,
      message: error.message,
    })
  }
  const data = await response.json()
  return data
}
