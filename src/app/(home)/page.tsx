'use client'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useInstrumentsStore } from '@/stores/useInstrumentsStore'
import { AlertError } from './components/alert'
import { Chart } from './components/chart'
import { SkeletonChart } from './components/skeleton-chart'

export default function Home() {
  const { instrumentList, isLoading, error } = useInstrumentsStore();

  return (
    <ScrollArea className='flex-1'>
      <main>
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-home px-2 justify-center gap-2 pt-3 `}>
          {error ? <AlertError /> : isLoading
            ? Array.from({ length: 12 }).map((_, index) => (
              <SkeletonChart key={index} />
            ))
            : instrumentList?.map((instrument) => (
              <Chart key={instrument.id} dataChart={instrument} />
            ))}
        </div>
      </main>
    </ScrollArea>
  )
}
