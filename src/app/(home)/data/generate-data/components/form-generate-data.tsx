'use client'
import {
  GenerateDataRequest,
  GenerateDataResponse,
} from '@/app/http/generate-data'
import { getInstruments } from '@/app/http/get-instruments'
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
import { generateDataMode } from '@/types/generate-data-mode'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
dayjs.extend(utc)

const generateStandards = z.object({
  local: z.string({ message: 'Selecione o local desejado.' }),
  variation: z.string({ message: 'Defina a variação.' }),
  startDate: z.string({ message: 'Defina data de fechamento.' }),
  defrostDate: z.string({ message: 'Defina data de degelo.' }),
  endDate: z.string({ message: 'Defina data de abertura.' }),
  generateMode: z.string({ message: 'Defina o modo.' }).optional(),
  initialTemp: z
    .union([z.number({ message: 'Defina a temperatura.' }), z.nan()])
    .optional(),
  averageTemp: z
    .union([z.number({ message: 'Defina a média.' }), z.nan()])
    .optional(),
})

type GenerateStandards = z.infer<typeof generateStandards>

interface FormGenerateDataProps {
  mutate: (dataUpdate: GenerateDataRequest) => Promise<GenerateDataResponse>
  isPending: boolean
}
export function FormGenerateData({ mutate, isPending }: FormGenerateDataProps) {
  const { data: session } = useSession()
  const [initialDate, setInitialDate] = useState<string | Date>('')
  const [minDefrostDate, setMinDefrostDate] = useState<string | Date>('')
  const [minEndDate, setMinEndDate] = useState<string | Date>('')

  const { data: instrumentList, isLoading } = useQuery({
    queryKey: ['list-instruments'],
    queryFn: getInstruments,
    staleTime: 1000 * 60 * 60, // 1 hour
  })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<GenerateStandards>({
    resolver: zodResolver(generateStandards),
  })

  function handleGenerateStandards(data: GenerateStandards) {
    const startDataUtc = dayjs(data.startDate).format('YYYY-MM-DDTHH:mm')
    const endDataUtc = dayjs(data.endDate).format('YYYY-MM-DDTHH:mm')
    const defrostDataUtc = dayjs(data.defrostDate).format('YYYY-MM-DDTHH:mm')
    mutate({
      endDate: endDataUtc,
      startDate: startDataUtc,
      variation: Number(data.variation),
      defrostDate: defrostDataUtc,
      instrumentId: data.local,
      userName: String(session?.user?.name),
    })
  }

  const startDateValue = watch('startDate')
  const instrumentSelectedId = watch('local')

  useEffect(() => {
    if (!instrumentSelectedId || !instrumentList) return
    const instrument = instrumentList.find(
      (instrument) => instrument.id === instrumentSelectedId,
    )
    setInitialDate(dayjs(instrument?.createdAt).format('YYYY-MM-DDTHH:mm'))
  }, [instrumentSelectedId, instrumentList])

  useEffect(() => {
    if (!startDateValue) return
    const endDate = dayjs(startDateValue)
      .add(1, 'day')
      .format('YYYY-MM-DDTHH:mm')
    const addHoursDefrost = dayjs(startDateValue)
      .add(8, 'hours')
      .format('YYYY-MM-DDTHH:mm')
    setMinDefrostDate(startDateValue)
    setMinEndDate(startDateValue)
    setValue('endDate', endDate)
    setValue('defrostDate', addHoursDefrost)
  }, [startDateValue, setValue])

  return (
    <form onSubmit={handleSubmit(handleGenerateStandards)}>
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
                  <Label className="font-light text-xs" htmlFor="variation">
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
                  <Label className="font-light text-xs" htmlFor="generateMode">
                    Modo de geração
                  </Label>
                  <Controller
                    name="generateMode"
                    control={control}
                    render={({ field: { onChange, value, ref } }) => (
                      <Select
                        onValueChange={onChange}
                        value={value}
                        disabled={isLoading}
                      >
                        <SelectTrigger
                          ref={ref}
                          className="dark:bg-slate-900 h-8 w-40"
                        >
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(generateDataMode).map(
                            ([value, name]) => {
                              return (
                                <SelectItem value={value} key={value}>
                                  {name}
                                </SelectItem>
                              )
                            },
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                Modo que será gerado os dados
              </TooltipContent>
            </Tooltip>

            {errors.generateMode?.message && (
              <p className="text-red-500 text-xs font-light">
                {errors.generateMode?.message}
              </p>
            )}
          </div>
          <div className="h-[4.5rem]">
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Label className="font-light text-xs" htmlFor="initialTemp">
                    Valor inicial
                  </Label>
                  <Input
                    id="initialTemp"
                    type="number"
                    step="0.1"
                    className="[appearance:textfield]  w-24 h-8 dark:bg-slate-900 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    {...register('initialTemp', { valueAsNumber: true })}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">Valor inicial</TooltipContent>
            </Tooltip>
            {errors.initialTemp?.message && (
              <p className="text-red-500 text-xs font-light">
                {errors.initialTemp?.message}
              </p>
            )}
          </div>
          <div className="h-[4.5rem]">
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Label className="font-light text-xs" htmlFor="averageTemp">
                    Valor médio
                  </Label>
                  <Input
                    id="averageTemp"
                    type="number"
                    className="[appearance:textfield] w-24 h-8  dark:bg-slate-900 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    {...register('averageTemp', { valueAsNumber: true })}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">Valor médio</TooltipContent>
            </Tooltip>
            {errors.averageTemp?.message && (
              <p className="text-red-500 text-xs font-light">
                {errors.averageTemp?.message}
              </p>
            )}
          </div>
          <div className="h-[4.5rem]">
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Label className="font-light text-xs" htmlFor="startDate">
                    Data Fechamento
                  </Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    disabled={!instrumentSelectedId}
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
                  <Label className="font-light text-xs" htmlFor="defrostDate">
                    Variação Degelo
                  </Label>
                  <Input
                    id="defrostDate"
                    type="datetime-local"
                    disabled={!instrumentSelectedId}
                    min={String(minDefrostDate)}
                    max="9999-12-31T23:59"
                    className="dark:bg-slate-900 h-8"
                    {...register('defrostDate')}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">Variação de degelo.</TooltipContent>
            </Tooltip>
            {errors.defrostDate?.message && (
              <p className="text-red-500 text-xs font-light">
                {errors.defrostDate?.message}
              </p>
            )}
          </div>
          <div className="h-[4.5rem]">
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Label className="font-light text-xs" htmlFor="endDate">
                    Data Abertura
                  </Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    disabled={!instrumentSelectedId}
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
              Gerar dados
            </Button>
          </div>
        </div>
      </TooltipProvider>
    </form>
  )
}
