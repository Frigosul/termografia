import { fetchServer } from '@/middlewares/fetch-server'

export type InstrumentsResponse = {
  id: string
  idSitrad: number
  name: string
  type: 'TEMPERATURE' | 'PRESSURE'
  maxValue: number
  minValue: number
  createdAt: string
  isActive: boolean
  orderDisplay: number
}[]

export async function getInstruments(): Promise<InstrumentsResponse> {
  const response = await fetchServer('/api/instruments/summary')

  if (!response.ok) {
    const error = await response.json()
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject({
      status: response.status,
      message: error.message || 'Error api',
    })
  }
  const data = await response.json()

  return data
}
