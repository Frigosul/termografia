import { fetchServer } from '@/middlewares/fetch-server'

type UserResponse = {
  id: string
  name: string
  type: 'Administrador' | 'nível01' | 'nível02'
  email: string
  password: string
}
type UserRequest = {
  userId: string
}

export async function getUserById({
  userId,
}: UserRequest): Promise<UserResponse> {
  const response = await fetchServer(`http://localhost:3333/users/${userId}`)
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
