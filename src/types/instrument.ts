export interface Instrument {
  id: string
  name: string
  type: "temp" | "press"
  status: string
  isSensorError: boolean
  temperature: number
  pressure: number
  createdAt: Date
  error: string | null
  maxValue: number
  minValue: number
  instrumentCreatedAt: Date
}
