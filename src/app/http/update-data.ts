
type DataRequest = {
  temperatures: {
    id: string
    temperature: number
    updatedAt: string
    updatedUserAt: string | null

  }[]
}

export async function updateData({ temperatures }: DataRequest) {
  const response = await fetch(`/api/instruments/update-data`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ temperatures }),
  })


  if (!response.ok) {
    throw new Error('Erro ao atualizar as temperaturas')
  }
  const data = await response.json()
  return data
}
