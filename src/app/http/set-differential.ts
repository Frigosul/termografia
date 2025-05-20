import { fetchServer } from '@/middlewares/fetch-server'

type SetFunctionsSitradRequest = {
  differential: string
  model: number
  id: number
}

export async function setDifferential({
  differential,
  model,
  id,
}: SetFunctionsSitradRequest) {
  const response = await fetchServer(`/api/instruments/set-differential`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ differential, model, id }),
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
