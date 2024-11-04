
export type InstrumentsResponse = {
  id: string
  name: string
  type: 'temp' | 'press'
  maxValue: number
  minValue: number
  createdAt: string
  isActive: boolean,
  displayOrder: number,
}[]


export async function getInstruments(): Promise<InstrumentsResponse> {

  const response = await fetch('http://localhost:3000/api/instruments/summary')
  const data = await response.json()
  return data
}
