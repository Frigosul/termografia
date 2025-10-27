'use client'
import { listData, ListDataResponse } from '@/app/http/list-data'
import { TableEditValues } from '@/components/table-edit-values'
import { useMutation } from '@tanstack/react-query'
import { CircleX } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Spinner } from '../../components/spinner'
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

  const formattedDataTemp = dataValue?.chartTemperature?.map((temp) => {
    return {
      temperature: temp.value,
      updatedUserAtTemp: temp.updatedUserAt,
      updatedAtTemp: temp.updatedAt,
      id: temp.id,
      time: temp.time,
    }
  })
  const formattedDataPress = dataValue?.chartPressure?.map((press) => {
    return {
      pressure: press.value,
      updatedUserAtPress: press.updatedUserAt,
      updatedAtPress: press.updatedAt,
      id: press.id,
      time: press.time,
    }
  })
  return (
    <main className="overflow-hidden flex-1 flex flex-col p-4 sm:p-6 md:p-6">
      <div className="w-full max-w-screen-xl">
        <h2 className="font-normal tracking-tight text-foreground mb-2 text-sm md:text-base">
          Editar dados
        </h2>
        <FormUpdatedData
          isPending={updateDataMutation.isPending}
          mutate={updateDataMutation.mutateAsync}
        />
      </div>

      {updateDataMutation.isPending ? (
        <div className="flex items-center justify-center h-[calc(100vh-300px)] w-full">
          <Spinner size={62} />
        </div>
      ) : (
        dataValue?.chartTemperature && (
          <TableEditValues
            instrumentType={
              dataValue.chartType === 'temp/press' ? 'PRESSURE' : 'TEMPERATURE'
            }
            dataPressure={formattedDataPress || []}
            data={formattedDataTemp || []}
            joinInstruments={dataValue.joinInstrument}
          />
        )
      )}
    </main>
  )
}
