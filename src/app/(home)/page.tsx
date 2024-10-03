'use client'
import { useQuery } from '@tanstack/react-query'
import dynamic from 'next/dynamic'
import { getChambers } from '../http/get-chambers'
import { SkeletonChart } from './components/skeleton-chart'
const Chart = dynamic(() => import('@/app/(home)/components/chart'), {
  ssr: false,
})
export default function Home() {
  const { data, isLoading } = useQuery({
    queryKey: ['list-chambers'],
    queryFn: getChambers,
    staleTime: 1000 * 10, // 10 seconds
  })

  return (
    <main className="flex-1  overflow-y-scroll">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-home px-2 justify-center gap-2 pt-3 ">
        {isLoading
          ? Array.from({ length: 12 }).map((_, index) => (
              <SkeletonChart key={index} />
            ))
          : data?.map((chamber, index) => (
              <Chart key={index} chart={chamber} />
            ))}
      </div>
    </main>
  )
}
