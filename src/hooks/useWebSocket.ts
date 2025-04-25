import { Instrument } from "@/types/instrument";
import { useEffect, useRef, useState } from "react";

export const useWebSocket = (url: string) => {
  const [data, setData] = useState<Instrument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

  const connect = () => {
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
      setError(false);
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "data") {
        const instruments: Instrument[] = message.payload;
        setData(instruments);
        setIsLoading(false);
      }
    };

    ws.onerror = () => {
      console.error("WebSocket error observed");
      setError(true);
    };

    ws.onclose = (event) => {
      console.log(`Disconnected from WebSocket server: ${event.reason}`);
      setError(true);

      // Tentativa de reconexão após 5 segundos
      reconnectTimeout.current = setTimeout(() => {
        console.log("Trying to reconnect to WebSocket...");
        connect();
      }, 5000);
    };
  };

  useEffect(() => {
    connect();

    return () => {
      wsRef.current?.close();
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
    };
  }, [url]);

  return { data, isLoading, error };
};
