import { fetchServer } from '@/middlewares/fetch-server'

type CreateUnionInstrument = {
  name: string
  firstInstrument: string
  secondInstrument: string
}

export async function createUnionInstrumentFn({
  name,
  firstInstrument,
  secondInstrument,
}: CreateUnionInstrument) {
  const response = await fetchServer(`/api/instruments/create-union`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      firstInstrument,
      secondInstrument,
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
  return data
}
