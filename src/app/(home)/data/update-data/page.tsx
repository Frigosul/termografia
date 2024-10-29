'use client'
import { listData, ListDataResponse } from '@/app/http/list-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { FormUpdatedData } from './components/form-update-data'
import { SkeletonTable } from './components/skeleton-table'
export default function PageManagedData() {
  const [dataValue, setDataValue] = useState<ListDataResponse>()
  const updateDataMutation = useMutation({
    mutationFn: listData,
    onSuccess: (data) => {
      setDataValue(data)

    },
    onError: (error) => {
      console.error('Erro ao listar dados:', error)
      alert('Erro ao listar dados')
    },
  })


  return (
    <ScrollArea className='flex-1'>
      <div className="grid grid-cols-1 mx-auto px-2 gap-2 py-3">
        <Card className="lg:w-4/5 lg:max-w-6xl lg:mx-auto md:mt-4 bg-muted  dark:bg-slate-800 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl tracking-tight text-blue-600 dark:text-blue-500 underline">
              Editar Dados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormUpdatedData mutate={updateDataMutation.mutateAsync} />
          </CardContent>
        </Card>
        <Card className="lg:w-4/5 lg:max-w-6xl lg:mx-auto md:mt-4 bg-muted  dark:bg-slate-800 shadow-sm p-4">

          <CardContent className="bg-muted h-full dark:bg-slate-800 pt-4">
            {/* {updateDataMutation.isPending ? <SkeletonTable />
              : dataValue?.chartTemperature && (
                <TableManagedData data={dataValue.chartTemperature} />
              )

            } */}
            <SkeletonTable />
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  )
}
