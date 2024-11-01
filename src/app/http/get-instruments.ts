
type InstrumentsResponse = {
  id: string
  name: string
  type: 'temp' | 'press'
  status: 'deg' | 'resf' | 'vent' | 'port'
  isSensorError: boolean
  temperature: number
  error: string | null
  maxValue: number
  minValue: number
}[]


export async function getInstruments(): Promise<InstrumentsResponse> {

  const response = await fetch('http://localhost:3000/api/instruments/summary')
  const data = await response.json()
  return data
}
