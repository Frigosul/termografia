
export interface GenerateDataRequest {
  startDate: string;
  defrostDate: string;
  endDate: string;
  instrumentId: string;
  variation: number;
  userName: string
}

export interface GenerateDataResponse {
  data: {
    id: string
    updatedUserAt: string | null
    updatedAt: string
    time: string
    temperature: number
  }[]
  error?: string
}

export async function generateData({ instrumentId, variation, defrostDate, endDate, startDate, userName }: GenerateDataRequest): Promise<GenerateDataResponse> {
  const response = await fetch(`/api/instruments/generate-data`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ instrumentId, variation, defrostDate, endDate, startDate, userName }),
  })
  if (!response.ok) {
    const error = await response.json()
    return Promise.reject({
      status: response.status,
      message: error.message || "Error api",
    })
  }
  const data = await response.json()
  return data
}

