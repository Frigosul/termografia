export interface ChartData {
  idSitrad: number
  name: string
  model: number
  type: 'temp' | 'press'
  status: string
  isSensorError: boolean
  temperature: number
  pressure: number
  error: string | null
  maxValue: number
  minValue: number
  setPoint: number
  process: string
  differential: number
}

export interface ChartProps {
  dataChart: ChartData
}
