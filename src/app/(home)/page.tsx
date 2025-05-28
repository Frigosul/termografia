'use client'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useWebSocket } from '@/hooks/useWebSocket'
import { AlertError } from './components/alert'
import { Chart } from './components/chart'
import { DialogOptions } from './components/dialog-options'
import { Spinner } from './components/spinner'

export default function Home() {
  const { data, isLoading, error } = useWebSocket(
    String(process.env.NEXT_PUBLIC_WEBSOCKET_URL),
  )

  return (
    <ScrollArea className="relative flex-1">
      <DialogOptions />

      <main>
        <div
          className={`grid grid-cols-home px-2 justify-center gap-2 pt-3 mb-4`}
        >
          {error ? (
            <AlertError />
          ) : isLoading ? (
            <div className="flex items-center justify-center col-span-full h-[calc(100vh-100px)]">
              <Spinner size={62} />
            </div>
          ) : (
            data?.map((instrument) => (
              <Chart key={instrument.id} dataChart={instrument} />
            ))
          )}
        </div>
      </main>
    </ScrollArea>
  )
}
