interface DeleteUnionRequest {
  unionId: string
}

export async function deleteUnion({
  unionId,
}: DeleteUnionRequest): Promise<void> {
  const response = await fetch(
    `/api/instruments/delete-union?unionId=${unionId}`,
    {
      method: 'DELETE',
    },
  )
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
