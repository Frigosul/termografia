type UserResponse = {
  id: string
  name: string
  userRole: 'Administrador' | 'Nível 1' | 'Nível 2'
  email: string
}
type UserRequest = {
  userId: string
  name: string
  userRole: 'Administrador' | 'Nível 1' | 'Nível 2'
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
