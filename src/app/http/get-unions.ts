import { fetchServer } from '@/middlewares/fetch-server'

interface GetUnionsResponse {
  id: string
  name: string
  fisrtInstrument: string
  secondInstrument: string
  isActive: boolean
}

export async function getUnions(): Promise<GetUnionsResponse[]> {
  const response = await fetchServer('/api/instruments/get-unions')

  if (!response.ok) {
    const error = await response.json()
    return Promise.reject({
      status: response.status,
      message: error.message || 'Error api',
    })
  }
  const data: GetUnionsResponse[] = await response.json()

  return data
}
