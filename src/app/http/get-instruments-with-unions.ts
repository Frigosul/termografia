export interface GetInstrumentWithUnionsResponse {
  id: string
  name: string
  createdAt: string
}
export async function getInstrumentsWithUnions(): Promise<GetInstrumentWithUnionsResponse[]> {

  const response = await fetch('/api/instruments/list-instruments-with-unions')

  if (!response.ok) {
    const error = await response.json()
    return Promise.reject({
      status: response.status,
      message: error.message || "Error api",
    })
  }
  const data: GetInstrumentWithUnionsResponse[] = await response.json()
  return data
}
