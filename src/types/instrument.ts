export interface Instrument {
  id: string;
  model: number;
  idSitrad: number;
  name: string;
  type: "temp" | "press";
  status: string;
  isSensorError: boolean;
  temperature: number;
  pressure: number;
  createdAt: Date;
  error: string | null;
  maxValue: number;
  minValue: number;
  setPoint: number;
  differential: number;
  instrumentCreatedAt: Date;
}
