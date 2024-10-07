'use client'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { getChambers } from '../http/get-chambers'
import { Chart } from './components/chart'
import { SkeletonChart } from './components/skeleton-chart'

export default function Home() {
  const { data, isLoading } = useQuery({
    queryKey: ['list-chambers'],
    queryFn: getChambers,
    staleTime: 1000 * 10, // 10 seconds
  })
  const { data: session } = useSession()
  console.log(session)

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
