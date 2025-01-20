import { fetchServer } from '@/middlewares/fetch-server'

type SetFunctionsSitradRequest = {
  setpoint: string
  model: number
  id: number
}

export async function setSetPoint({
  setpoint,
  model,
  id,
}: SetFunctionsSitradRequest) {
  const response = await fetchServer(`/api/instruments/set-setpoint`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ setpoint, model, id }),
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
