
type DataRequest = {
  dataValue: {
    id: string
    value: number
    updatedAt: string
    updatedUserAt: string | null
  }[]
}

export async function updateData({ dataValue }: DataRequest) {
  const response = await fetch(`/api/instruments/update-data`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ value: dataValue }),
  })
  if (!response.ok) {
    const error = await response.json()
    return Promise.reject({
      status: response.status,
      message: error.message || "Error api",
    })
  }
  const data = await response.json()
  return data
}
