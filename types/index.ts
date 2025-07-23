export interface SensorData {
  id: string
  updatedAt: Date
  time: string
  value: number
}

export interface InstrumentData {
  instrumentId: string
  id: string
  createdAt: Date
  updatedAt: Date
  data: number
  editData: number
  userEditData: string | null
}
