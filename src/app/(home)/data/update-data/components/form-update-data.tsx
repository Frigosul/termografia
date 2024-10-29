'use client'
import { getInstruments } from '@/app/http/get-instruments'
import { ListDataRequest, ListDataResponse } from '@/app/http/list-data'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'


const updatedDataChart = z.object({
  localChamber: z
    .string({ message: 'Selecione o local desejado.' }),

  graphVariation: z
    .string({ message: 'Defina a variação desejada no gráfico.' }),
  startDate: z.string({ message: 'Defina a data de início.' }),
  endDate: z.string({ message: 'Defina a data final.' }),
})

type UpdatedDataChart = z.infer<typeof updatedDataChart>
interface FormUpdateDataProps {
  mutate: (dataUpdate: ListDataRequest) => Promise<ListDataResponse>
}

export function FormUpdatedData({ mutate }: FormUpdateDataProps) {

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { isSubmitting, errors },
  } = useForm<UpdatedDataChart>({
    resolver: zodResolver(updatedDataChart),
  })

  const { data, isLoading } = useQuery({
    queryKey: ['list-instruments'],
    queryFn: getInstruments,
  })

  function handleUpdatedDataChart(data: UpdatedDataChart) {
    mutate({
      endDate: data.endDate,
      startDate: data.startDate,
      graphVariation: data.graphVariation,
      local: data.localChamber
    })
  }
  const startDateValue = watch('startDate')

  useEffect(() => {
    if (!startDateValue) return
    const endDate = dayjs(startDateValue).add(1, 'day').format('YYYY-MM-DDThh:mm')

    setValue('endDate', endDate)
  }, [startDateValue, setValue])

  return (
    <form
      onSubmit={handleSubmit(handleUpdatedDataChart)}
      className="gap-2 flex flex-col items-start"
    >
      <TooltipProvider>
        <div className="flex w-full gap-3">
          <div className="space-y-2 flex-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Label className="font-light text-sm" htmlFor="localChamber">
                    Local
                  </Label>
                  <Controller
                    name="localChamber"
                    control={control}
                    render={({ field: { onChange, value, ref } }) => (
                      <Select onValueChange={onChange} value={value} disabled={isLoading}>
                        <SelectTrigger ref={ref} className="dark:bg-slate-900">
                          <SelectValue placeholder="Selecione o local" />
                        </SelectTrigger>
                        <SelectContent>
                          {data?.map(item => {
                            return (
                              <SelectItem value={item.name} key={item.id} >{item.name}</SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                Instrumento que será alterado ou utilizado para cópia de dados
              </TooltipContent>
            </Tooltip>

            {errors.localChamber?.message && (
              <p className="text-red-500 text-sm font-light">
                {errors.localChamber?.message}
              </p>
            )}
          </div>
          <div className="space-y-2 flex-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Label className="font-light text-sm" htmlFor="localChamber">
                    Variação gráfico
                  </Label>
                  <Controller
                    name="graphVariation"
                    control={control}
                    render={({ field: { onChange, value, ref } }) => (
                      <Select onValueChange={onChange} value={value}>
                        <SelectTrigger ref={ref} className="dark:bg-slate-900">
                          <SelectValue placeholder="Variação do gráfico" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10 minutos</SelectItem>
                          <SelectItem value="15">15 minutos</SelectItem>
                          <SelectItem value="20">20 minutos</SelectItem>
                          <SelectItem value="30">30 minutos</SelectItem>
                          <SelectItem value="01">01 hora</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                Selecione o período em minutos que deseja apresentar as
                informações do instrumento.
              </TooltipContent>
            </Tooltip>
            {errors.graphVariation?.message && (
              <p className="text-red-500 text-sm font-light">
                {errors.graphVariation?.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex w-full items-end gap-2">
          <div className="space-y-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Label className="font-light text-sm" htmlFor="startDate">
                    Data Inicial
                  </Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    min="2000-01-01T00:00"
                    max="9999-12-31T23:59"
                    className="dark:bg-slate-900"
                    {...register('startDate')}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                Data e hora inicial.
              </TooltipContent>
            </Tooltip>
            {errors.startDate?.message && (
              <p className="text-red-500 text-sm font-light">
                {errors.startDate?.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Label className="font-light text-sm" htmlFor="endDate">
                    Data Final
                  </Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    min="2000-01-01T00:00"
                    max="9999-12-31T23:59"
                    className="dark:bg-slate-900"
                    {...register('endDate')}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">Data e hora final.</TooltipContent>
            </Tooltip>
            {errors.endDate?.message && (
              <p className="text-red-500 text-sm font-light">
                {errors.endDate?.message}
              </p>
            )}
          </div>
          <div className="flex w-full gap-3 justify-end">
            <Button
              disabled={isSubmitting}
              type="submit"
              className="dark:bg-blue-600 bg-blue-400 hover:bg-blue-500 hover:dark:bg-blue-500 text-foreground"
            >
              Gerar dados
            </Button>
          </div>
        </div>
      </TooltipProvider>
    </form>
  )
}
