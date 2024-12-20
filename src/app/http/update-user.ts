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
    const error = await response.json()
    return Promise.reject({
      status: response.status,
      message: error.message || 'Error api',
    })
  }
  const data = await response.json()
  return data
}
