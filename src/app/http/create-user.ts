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
    throw new Error('Erro ao criar usuário')
  }
  const data = await response.json()
  return data
}
