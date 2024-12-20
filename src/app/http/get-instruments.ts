export type InstrumentsResponse = {
  id: string
  idSitrad: number
  name: string
  type: 'temp' | 'press'
  maxValue: number
  minValue: number
  createdAt: string
  isActive: boolean
  displayOrder: number
}[]

export async function getInstruments(): Promise<InstrumentsResponse> {
  const response = await fetch('/api/instruments/summary')

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
