import { fetchServer } from '@/middlewares/fetch-server'

type DataRequest = {
  instruments: {
    id: string
    idSitrad: number
    name: string
    type: 'TEMPERATURE' | 'PRESSURE'
    maxValue: number
    minValue: number
    isActive: boolean
    orderDisplay: number
  }[]
}

export async function updateInstruments({ instruments }: DataRequest) {
  const response = await fetchServer(`/api/instruments/update-instruments`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ instruments }),
  })

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
