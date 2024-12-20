'use client'
import { listData, ListDataResponse } from '@/app/http/list-data'
import { SkeletonTable } from '@/components/skeleton-table'
import { TableEditValues } from '@/components/table-edit-values'
import { useMutation } from '@tanstack/react-query'
import { CircleX } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { FormUpdatedData } from './components/form-update-data'

export default function PageManagedData() {
  const [dataValue, setDataValue] = useState<ListDataResponse>()
  const updateDataMutation = useMutation({
    mutationKey: ['update-data'],
    mutationFn: listData,
    onSuccess: (data) => {
      setDataValue(data)
    },
    onError: (error) => {
      console.error(error)
      toast.error('Erro ao listar os dados, por favor tente novamente.', {
        position: 'top-right',
        icon: <CircleX />,
      })
    },
  })

  return (
    <main className="overflow-hidden flex-1 flex flex-col p-4 sm:p-6 md:p-6">
      <div className="w-full max-w-screen-2xl">
        <h2 className="font-normal tracking-tight text-foreground mb-2 text-sm md:text-base">
          Editar dados
        </h2>
        <FormUpdatedData
          isPending={updateDataMutation.isPending}
          mutate={updateDataMutation.mutateAsync}
        />
      </div>

      {updateDataMutation.isPending ? (
        <SkeletonTable />
      ) : (
        dataValue?.chartTemperature && (
          <TableEditValues data={dataValue.chartTemperature} />
        )
      )}
    </main>
  )
}
