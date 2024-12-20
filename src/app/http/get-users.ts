import { User } from '@/types/user'

type UsersResponse = User[]

export async function getUsers(): Promise<UsersResponse> {
  const response = await fetch('/api/users/list-users')
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
