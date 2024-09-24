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
    <main className="grid grid-cols-home justify-center gap-2 h-[calc(100vh_-_7.5rem)] py-4 overflow-y-scroll">
      {data.map((chamber) => {
        return <Chart key={chamber.id} chart={chamber} />
      })}
    </main>
  )
}
