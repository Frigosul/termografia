'use client'
import { generateData, GenerateDataResponse } from '@/app/http/generate-data'
import { SkeletonTable } from '@/components/skeleton-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useMutation } from '@tanstack/react-query'
import { CircleCheck, CircleX } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { FormGenerateData } from './components/form-generate-data'
import { TableGenerateData } from './components/table-generate-data'

export default function PageManagedData() {
  const [dataValue, setDataValue] = useState<GenerateDataResponse>()
  const generateDataMutation = useMutation({
    mutationKey: ['generate-data'],
    mutationFn: generateData,
    onSuccess: (data) => {
      toast.success('Dados gerados com sucesso', {
        position: 'top-right',
        icon: <CircleCheck />,
      })
      setDataValue(data)
    },
    onError: (error) => {
      console.error(error)
      toast.error('Erro encontrado, por favor tente novamente.', {
        position: 'top-right',
        icon: <CircleX />,
      })
    },
  })

  return (
    <ScrollArea className='flex-1'>
      <div className="grid grid-cols-1 mx-auto px-2 gap-2 py-3">
        <Card className="w-4/5 max-w-6xl mx-auto mt-4 bg-muted dark:bg-slate-800 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl tracking-tight text-blue-600 dark:text-blue-500">
              Gerar Dados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormGenerateData mutate={generateDataMutation.mutateAsync} />
          </CardContent>
        </Card>
        <Card className="lg:w-4/5 lg:max-w-6xl lg:mx-auto md:mt-4 shadow-sm p-4">
          <CardContent className=" pt-4">
            {generateDataMutation.isPending ? <SkeletonTable />
              : dataValue?.data && (
                <TableGenerateData data={dataValue?.data} />
              )
            }
          </CardContent>
        </Card>

      </div>
    </ScrollArea>
  )
}
