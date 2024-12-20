import { fetchServer } from '@/middlewares/fetch-server'
import { UserRolesType } from '@/utils/user-roles'

type UserRequest = {
  name: string
  userRole: UserRolesType
  email: string
  password: string
}

export async function createUser({
  name,
  userRole,
  email,
  password,
}: UserRequest) {
  const response = await fetchServer(`/api/users/create-user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      userRole,
      email,
      password,
    }),
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
