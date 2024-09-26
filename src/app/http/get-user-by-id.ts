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
  const response = await fetch(`http://localhost:3333/users/${userId}`)
  if (!response.ok) {
    throw new Error('Erro ao carregar o usuário')
  }
  const data = await response.json()
  return data
}
