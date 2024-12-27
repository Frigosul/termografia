import { fetchServer } from '@/middlewares/fetch-server'

interface DeleteUserRequest {
  userId: string
}

export async function deleteUser({ userId }: DeleteUserRequest): Promise<void> {
  const response = await fetchServer(
    `/api/users/delete-user?userId=${userId}`,
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
