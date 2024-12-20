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
import utc from 'dayjs/plugin/utc'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
dayjs.extend(utc)

const updatedDataChart = z.object({
  local: z.string({ message: 'Selecione o local desejado.' }),
  variation: z.string({ message: 'Defina a variação.' }),
  startDate: z.string({ message: 'Defina a data de início.' }),
  endDate: z.string({ message: 'Defina a data final.' }),
})

type UpdatedDataChart = z.infer<typeof updatedDataChart>

interface FormUpdateDataProps {
  mutate: (dataUpdate: ListDataRequest) => Promise<ListDataResponse>
  isPending: boolean
}

export function FormUpdatedData({ mutate, isPending }: FormUpdateDataProps) {
  const [initialDate, setInitialDate] = useState<string | Date>('')
  const [minEndDate, setMinEndDate] = useState<string | Date>('')
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<UpdatedDataChart>({
    resolver: zodResolver(updatedDataChart),
  })
  const { data: instrumentList, isLoading } = useQuery({
    queryKey: ['list-instruments'],
    queryFn: getInstruments,
    staleTime: 1000 * 60 * 60, // 1 hour
  })

  function handleUpdatedDataChart(data: UpdatedDataChart) {
    const startDataUtc = dayjs(data.startDate).utc().format('YYYY-MM-DDTHH:mm')
    const endDataUtc = dayjs(data.endDate).utc().format('YYYY-MM-DDTHH:mm')

    mutate({
      endDate: endDataUtc,
      startDate: startDataUtc,
      graphVariation: data.variation,
      local: data.local,
    })
  }
  const startDateValue = watch('startDate')
  const instrumendSelectedId = watch('local')

  useEffect(() => {
    if (!instrumendSelectedId || !instrumentList) return
    const instrument = instrumentList.find(
      (instrument) => instrument.id === instrumendSelectedId,
    )
    setInitialDate(dayjs(instrument?.createdAt).format('YYYY-MM-DDTHH:mm'))
  }, [instrumendSelectedId, instrumentList])

  useEffect(() => {
    if (!startDateValue) return
    const endDate = dayjs(startDateValue)
      .add(1, 'day')
      .format('YYYY-MM-DDTHH:mm')
    setMinEndDate(startDateValue)
    setValue('endDate', endDate)
  }, [startDateValue, setValue])

  return (
    <form
      onSubmit={handleSubmit(handleUpdatedDataChart)}
      className="gap-2 flex flex-col items-start"
    >
      <TooltipProvider>
        <div className="flex gap-x-2 items-start flex-wrap">
          <div className="h-[4.5rem]">
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Label className="font-light text-xs ml-1" htmlFor="local">
                    Local
                  </Label>
                  <Controller
                    name="local"
                    control={control}
                    render={({ field: { onChange, value, ref } }) => (
                      <Select
                        onValueChange={onChange}
                        value={value}
                        disabled={isLoading}
                      >
                        <SelectTrigger
                          ref={ref}
                          className="dark:bg-slate-900 h-8 w-72"
                        >
                          <SelectValue placeholder="Selecione o local" />
                        </SelectTrigger>
                        <SelectContent>
                          {instrumentList?.map((item) => {
                            return (
                              <SelectItem value={item.id} key={item.id}>
                                {item.name}
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                Local que será gerado os dados
              </TooltipContent>
            </Tooltip>

            {errors.local?.message && (
              <p className="text-red-500 text-xs font-light">
                {errors.local?.message}
              </p>
            )}
          </div>
          <div className="h-[4.5rem]">
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Label className="font-light text-xs" htmlFor="local">
                    Variação
                  </Label>
                  <Controller
                    name="variation"
                    control={control}
                    render={({ field: { onChange, value, ref } }) => (
                      <Select onValueChange={onChange} value={value}>
                        <SelectTrigger
                          ref={ref}
                          className="dark:bg-slate-900 h-8 w-40"
                        >
                          <SelectValue placeholder="Variação" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="01">01 minuto</SelectItem>
                          <SelectItem value="05">05 minutos</SelectItem>
                          <SelectItem value="10">10 minutos</SelectItem>
                          <SelectItem value="15">15 minutos</SelectItem>
                          <SelectItem value="20">20 minutos</SelectItem>
                          <SelectItem value="30">30 minutos</SelectItem>
                          <SelectItem value="60">01 hora</SelectItem>
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
            {errors.variation?.message && (
              <p className="text-red-500 text-xs font-light w-40">
                {errors.variation?.message}
              </p>
            )}
          </div>
          <div className="h-[4.5rem]">
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Label className="font-light text-xs" htmlFor="startDate">
                    Data Inicial
                  </Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    disabled={!instrumendSelectedId}
                    min={String(initialDate)}
                    max="9999-12-31T23:59"
                    className="dark:bg-slate-900 h-8"
                    {...register('startDate')}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                Data e hora inicial.
              </TooltipContent>
            </Tooltip>
            {errors.startDate?.message && (
              <p className="text-red-500 text-xs font-light">
                {errors.startDate?.message}
              </p>
            )}
          </div>
          <div className="h-[4.5rem]">
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Label className="font-light text-xs" htmlFor="endDate">
                    Data Final
                  </Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    disabled={!instrumendSelectedId}
                    min={String(minEndDate)}
                    max="9999-12-31T23:59"
                    className="dark:bg-slate-900 h-8"
                    {...register('endDate')}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">Data e hora final.</TooltipContent>
            </Tooltip>
            {errors.endDate?.message && (
              <p className="text-red-500 text-xs font-light">
                {errors.endDate?.message}
              </p>
            )}
          </div>
          <div className="h-[4.5rem] flex items-end">
            <Button disabled={isPending} type="submit" className="h-8 mb-4">
              Editar dados
            </Button>
          </div>
        </div>
      </TooltipProvider>
    </form>
  )
}
