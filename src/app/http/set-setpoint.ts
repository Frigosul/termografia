import { fetchServer } from '@/middlewares/fetch-server'

type SetFunctionsSitradRequest = {
  setpoint: string
  id: number
}

export async function setSetPoint({ setpoint, id }: SetFunctionsSitradRequest) {
  const response = await fetchServer(`/api/instruments/set-setpoint`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ setpoint, id }),
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
