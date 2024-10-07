import { UserRolesType } from '@/utils/user-roles'

type UserResponse = {
  id: string
  name: string
  userRole: UserRolesType
  email: string
}
type UserRequest = {
  userId: string
  name: string
  userRole: UserRolesType
  email: string
  password?: string
}

export async function updateUser({
  userId,
  name,
  userRole,
  email,
  password,
}: UserRequest): Promise<UserResponse> {
  const response = await fetch(`/api/users/update-user?userId=${userId}`, {
    method: 'PUT',
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
    throw new Error('Erro ao atualizar o usuário')
  }
  const data = await response.json()
  return data
}
