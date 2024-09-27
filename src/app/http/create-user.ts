type UserRequest = {
  name: string
  userRole: 'Administrador' | 'Nível 1' | 'Nível 2'
  email: string
  password: string
}

export async function createUser({
  name,
  userRole,
  email,
  password,
}: UserRequest) {
  const response = await fetch(`http://localhost:3333/users`, {
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
