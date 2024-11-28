'use client'

import { getInstruments } from '@/app/http/get-instruments'
import { SkeletonTable } from '@/components/skeleton-table'
import { useQuery } from '@tanstack/react-query'
import { TableManagedEquipments } from './components/table-managed-equipments'

export default function PageManagedEquipments() {

  const { data, isLoading, isError } = useQuery({
    queryKey: ['list-instruments'],
    queryFn: getInstruments,
  })
  return (
    <main className="overflow-hidden flex-1 flex flex-col p-4 sm:p-6 md:p-8">
      <h2 className="font-normal tracking-tight mb-4 text-foreground text-sm md:text-base">
        Gerenciar Equipamentos
      </h2>
      {isLoading ? <SkeletonTable /> : isError ? <p>Erro encontrado, por favor tente novamente</p> : data && <TableManagedEquipments value={data} />}
    </main>
  )
}
