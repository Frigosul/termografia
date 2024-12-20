type DataRequest = {
  unions: {
    id: string
    name: string
    fisrtInstrument: string
    secondInstrument: string
    isActive: boolean
  }[]
}

export async function updateUnions({ unions }: DataRequest) {
  const response = await fetch(`/api/instruments/update-unions`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ unions }),
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
