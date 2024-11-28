'use client'
import { generateData, GenerateDataResponse } from '@/app/http/generate-data'
import { SkeletonTable } from '@/components/skeleton-table'
import { CardContent } from '@/components/ui/card'
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
      console.error(error.message)
      toast.error('Erro encontrado, por favor tente novamente.', {
        position: 'top-right',
        icon: <CircleX />,
      })
    },
  })

  return (
    <ScrollArea className='flex-1'>
      <div className="grid grid-cols-1 mx-auto px-2 gap-2 py-3">

        <div className="p-3 max-w-screen-2xl">
          <h1 className='text-xl mb-2 underline'>Gerar Dados</h1>
          <FormGenerateData mutate={generateDataMutation.mutateAsync} />
        </div>


        <div className="grid grid-cols-1 mx-auto px-2 gap-2 py-3">
          <CardContent className=" pt-4">
            {generateDataMutation.isPending ? <SkeletonTable />
              : dataValue?.data && (
                <TableGenerateData data={dataValue?.data} />
              )
            }
          </CardContent>
        </div>

      </div>
    </ScrollArea>
  )
}
