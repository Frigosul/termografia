import { fetchServer } from '@/middlewares/fetch-server'

type SetFunctionsSitradRequest = {
  action: 'Vent' | 'Deg'
  active: boolean
  model: number
  id: number
}

export async function setFunctionSitrad({
  action,
  active,
  model,
  id,
}: SetFunctionsSitradRequest) {
  const response = await fetchServer(`/api/instruments/set-functions-sitrad`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action, active, model, id }),
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
