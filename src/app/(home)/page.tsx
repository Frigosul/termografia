'use client'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useQuery } from '@tanstack/react-query'
import { getInstruments } from '../http/get-instruments'
import { Chart } from './components/chart'
import { SkeletonChart } from './components/skeleton-chart'

export default function Home() {
  const { data, isLoading } = useQuery({
    queryKey: ['list-instruments'],
    queryFn: getInstruments,
    staleTime: 1000 * 10, // 10 seconds
    refetchInterval: 1000 * 10, // 10 seconds
  })

  return (
    <ScrollArea className='flex-1'>
      <main>
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-home px-2 justify-center gap-2 pt-3 `}>
          {isLoading
            ? Array.from({ length: 12 }).map((_, index) => (
              <SkeletonChart key={index} />
            ))
            : data?.map((instrument) => (
              <Chart key={instrument.id} dataChart={instrument} />
            ))}
        </div>
      </main>
    </ScrollArea>
  )
}
