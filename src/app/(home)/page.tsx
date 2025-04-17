'use client'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useWebSocket } from '@/hooks/useWebSocket'
import { AlertError } from './components/alert'
import { Chart } from './components/chart'
import { DialogOptions } from './components/dialog-options'
import { SkeletonChart } from './components/skeleton-chart'

export default function Home() {
  const { data, isLoading, error } = useWebSocket(String(process.env.NEXT_PUBLIC_WEBSOCKET_URL))

  return (
    <ScrollArea className="relative flex-1">
      <DialogOptions />

      <main>
        <div className={`grid grid-cols-home px-2 justify-center gap-2 pt-3 `}>
          {error ? (
            <AlertError />
          ) : isLoading ? (
            Array.from({ length: 7 }).map((_, index) => (
              <SkeletonChart key={index} />
            ))
          ) : (
            data?.map((instrument) => (
              <Chart key={instrument.id} dataChart={instrument} />
            ))
          )}
        </div>
        <div className="absolute z-50 left-2 bottom-2 bg-background flex flex-col w-40 border rounded-md p-2">
          <span className="text-sm  flex items-center  after:ml-auto after:inline-block after:w-7 after:h-2 after:bg-primary after:rounded-md after:content-['']">
            Ideal:
          </span>
          <span className="text-sm  flex items-center  after:ml-auto after:inline-block after:w-7 after:h-2 after:bg-yellow-600 after:rounded-md after:content-['']">
            Acima de 60%:
          </span>
          <span className="text-sm  flex items-center  after:ml-auto after:inline-block after:w-7 after:h-2 after:bg-red-600 after:rounded-md after:content-['']">
            Acima de 90%:
          </span>
        </div>
      </main>
    </ScrollArea>
  )
}
