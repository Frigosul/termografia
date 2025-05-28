'use client'
import { generateData, GenerateDataResponse } from '@/app/http/generate-data'
import { TableEditValues } from '@/components/table-edit-values'
import { useMutation } from '@tanstack/react-query'
import { CircleCheck, CircleX } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Spinner } from '../../components/spinner'
import { FormGenerateData } from './components/form-generate-data'

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
    <main className="overflow-hidden flex-1 flex flex-col p-4 sm:p-6 md:p-6">
      <div className="w-full max-w-screen-xl">
        <h2 className="font-normal tracking-tight text-foreground mb-2 text-sm md:text-base">
          Gerar dados
        </h2>
        <FormGenerateData
          isPending={generateDataMutation.isPending}
          mutate={generateDataMutation.mutateAsync}
        />
      </div>
      <div className="w-full my-2 max-w-screen-2xl">
        {generateDataMutation.isPending ? (
          <div className="flex items-center justify-center h-[calc(100vh-200px)] w-full">
            <Spinner size={62} />
          </div>
        ) : (
          dataValue?.data && (
            <TableEditValues
              data={dataValue?.data}
              instrumentType={dataValue.instrumentType}
            />
          )
        )}
      </div>
    </main>
  )
}
