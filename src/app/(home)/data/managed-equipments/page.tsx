'use client'

import { getInstruments } from '@/app/http/get-instruments'
import { SkeletonTable } from '@/components/skeleton-table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useQuery } from '@tanstack/react-query'
import { TableManagedEquipments } from './components/table-managed-equipments'

export default function PageManagedEquipments() {

  const { data, isLoading, isError } = useQuery({
    queryKey: ['list-instruments'],
    queryFn: getInstruments,
  })
  return (
    <ScrollArea className='flex-1'>
      <div className=" p-4 ml-4  max-w-screen-xl">
        <h1 className="md:text-base pb-4 xl:text-xl tracking-tight text-blue-600 dark:text-blue-500">
          Gerenciar Equipamentos
        </h1>
        {isLoading ? <SkeletonTable /> : isError ? <p>Erro encontrado, por favor tente novamente</p> : data && <TableManagedEquipments value={data} />}
      </div>
    </ScrollArea>
  )
}
