import { Instrument } from '@/types/instrument'
import { useEffect, useRef, useState } from 'react'

export const useWebSocket = (url: string) => {
  const [data, setData] = useState<Instrument[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null)
  const reconnectDelay = useRef(5000)

  const connect = () => {
    try {
      const ws = new WebSocket(url)
      wsRef.current = ws

      ws.onopen = () => {
        console.log('Connected to WebSocket server')
        setError(false)
      }

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data)

        if (message.type === 'data') {
          const instruments: Instrument[] = message.payload
          setData(instruments)
          setIsLoading(false)
        }
      }

      ws.onerror = () => {
        console.error('WebSocket error observed')
        setError(true)
      }

      ws.onclose = (event) => {
        console.log(`Disconnected from WebSocket server: ${event.reason}`)
        setError(true)

        // Tentativa de reconexão com um atraso exponencial
        if (reconnectTimeout.current) {
          clearTimeout(reconnectTimeout.current)
        }

        reconnectTimeout.current = setTimeout(() => {
          console.log('Trying to reconnect to WebSocket...')
          connect()
          reconnectDelay.current *= 2
        }, reconnectDelay.current)
      }
    } catch (error) {
      console.error('Error creating WebSocket connection:', error)
      setError(true)
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      connect()
    }, 1000)

    return () => {
      clearTimeout(timeout)
      wsRef.current?.close()
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current)
      }
    }
  }, [url])

  return { data, isLoading, error }
}
