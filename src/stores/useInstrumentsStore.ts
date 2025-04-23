import { Instrument } from "@/types/instrument";
import { create } from "zustand";

export interface InstrumentStoreProps {
  instrumentList: Instrument[];
  isLoading: boolean;
  error: boolean;
}

export const useInstrumentsStore = create<InstrumentStoreProps>((set) => {
  const ws = new WebSocket(String(process.env.NEXT_PUBLIC_WEBSOCKET_URL));
  ws.onopen = () => {
    console.log("Connected to WebSocket server");
    set({
      error: false,
    });
  };

  ws.onmessage = (event) => {
    const instruments: Instrument[] = JSON.parse(event.data);
    set({
      instrumentList: instruments,
      error: false,
      isLoading: false,
    });
  };

  ws.onerror = () => {
    console.error("WebSocket error observed");
    set({
      error: true,
    });
  };

  ws.onclose = () => {
    console.log("Disconnected from WebSocket server");
    set({
      error: true,
    });
  };

  return {
    instrumentList: [],
    isLoading: true,
    error: false,
  };
});
