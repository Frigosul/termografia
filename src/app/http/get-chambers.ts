const user = 'admin'
const password = 'day@jo2104'
type ChambersResponse = {
  id: string
  name: string
  type: 'temp' | 'press'
  status: 'deg' | 'vent' | 'comp' | 'port'
  value: string
}[]

const credentials = btoa(`${user}:${password}`)

export async function getChambers(): Promise<ChambersResponse> {
  const dataFetch = await fetch('https://localhost:8002/api/v1/instruments', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${credentials}`,
    },
  })
  const responseInstruments = await dataFetch.json()
  console.log(responseInstruments.results)

  const response = await fetch('http://localhost:3000/api/chambers/summary')
  const data = await response.json()
  return data
}
