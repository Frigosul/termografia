'use client'
import { useQuery } from '@tanstack/react-query'
import dynamic from 'next/dynamic'
import { getChambers } from '../http/get-chambers'
const Chart = dynamic(() => import('@/app/(home)/components/chart'), {
  ssr: false,
})
export default function Home() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['list-chambers'],
    queryFn: getChambers,
    staleTime: 1000 * 10, // 10 seconds
  })

  if (isLoading) return <p>Carregando...</p>
  if (error) return <p>Erro ao buscar dados</p>
  if (!data) return null
  return (
    <main className="flex-1  overflow-y-scroll">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-home px-2 justify-center gap-2 pt-3 ">
        {data.map((chamber, index) => {
          return <Chart key={index} chart={chamber} />
        })}
      </div>
    </main>
  )
}
