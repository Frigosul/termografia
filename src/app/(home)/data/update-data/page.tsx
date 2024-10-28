'use client'
import { listData, ListDataResponse } from '@/app/http/list-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { FormUpdatedData } from './components/form-update-data'
import { TableManagedData } from './components/table-managed-data'
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

  if (updateDataMutation.isPending) return <p>Carregando...</p>
  if (updateDataMutation.isError) return <p>Erro ao buscar dados</p>


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
          <CardTitle className="text-sm">
            Correção de dados dos coletores
          </CardTitle>
          <CardContent className="bg-muted  dark:bg-slate-800 pt-4">
            {dataValue?.chartTemperature && (
              <TableManagedData data={dataValue.chartTemperature} />
            )}
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  )
}
