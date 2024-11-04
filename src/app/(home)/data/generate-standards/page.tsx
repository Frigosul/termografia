'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { listData, ListDataResponse } from '@/app/http/list-data'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { SkeletonTable } from '../update-data/components/skeleton-table'
import { FormGenerateStandards } from './components/form-generate-standards'
import { TableGenerateStandards } from './components/table-generate-standards'
export default function PageManagedStandards() {

  const [dataValue, setDataValue] = useState<ListDataResponse>()
  const generateDataMutation = useMutation({
    mutationKey: ['generate-data'],
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
        <Card className="w-4/5 max-w-6xl mx-auto mt-4 bg-muted dark:bg-slate-800 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl tracking-tight text-blue-600 dark:text-blue-500 underline">
              Gerar Padrões
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormGenerateStandards mutate={generateDataMutation.mutateAsync} />
          </CardContent>
        </Card>
        <Card className="lg:w-4/5 lg:max-w-6xl lg:mx-auto md:mt-4 shadow-sm p-4">
          <CardContent className=" pt-4">
            {generateDataMutation.isPending ? <SkeletonTable />
              : dataValue?.chartTemperature && (
                <TableGenerateStandards data={dataValue.chartTemperature} />
              )}
          </CardContent>
        </Card>

      </div>
    </ScrollArea>
  )
}
