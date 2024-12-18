import { Instrument } from '@/types/instrument';
import { create } from 'zustand';
const FETCH_REMOTE_INSTRUMENTS = `ws://localhost:8080`

export interface InstrumentStoreProps {
  instrumentList: Instrument[]
  isLoading: boolean
  error: boolean
}

export const useInstrumentsStore = create<InstrumentStoreProps>((set) => {
  const ws = new WebSocket(FETCH_REMOTE_INSTRUMENTS)
  ws.onopen = () => {
    console.log("Connected to WebSocket server");
    set({
      error: false
    })
  };

  ws.onmessage = (event) => {
    const instruments: Instrument[] = JSON.parse(event.data);
    set({
      instrumentList: instruments,
      error: false,
      isLoading: false
    })
  };

  ws.onerror = () => {
    console.error("WebSocket error observed");
    set({
      error: true
    })
  };

  ws.onclose = () => {
    console.log("Disconnected from WebSocket server");
    set({
      error: true
    })
  };

  return {
    instrumentList: [],
    isLoading: true,
    error: false,
  };
})
