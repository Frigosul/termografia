import { Instrument } from "@/types/instrument";
import { useEffect, useState } from "react";


export const useWebSocket = (url: string) => {
  const [data, setData] = useState<Instrument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
      setError(false);
    };

    ws.onmessage = (event) => {
      const instruments: Instrument[] = JSON.parse(event.data);
      setData(instruments);
      setIsLoading(false);
    };

    ws.onerror = () => {
      console.error("WebSocket error observed");
      setError(true);
    };

    ws.onclose = () => {
      console.log("Disconnected from WebSocket server");
      setError(true);
    };

    return () => {
      ws.close();
    };
  }, [url]);

  return { data, isLoading, error };
};