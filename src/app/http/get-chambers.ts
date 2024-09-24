type ChambersResponse = {
  id: string
  name: string
  type: 'temp' | 'press'
  value: number
}[]

export async function getChambers(): Promise<ChambersResponse> {
  const response = await fetch('http://localhost:3333/chambers')
  const data = await response.json()
  return data
}
