import { User } from '@/types/user'

type UsersResponse = User[]

export async function getUsers(): Promise<UsersResponse> {
  const response = await fetch('http://localhost:3333/users')
  const data = await response.json()
  return data
}
