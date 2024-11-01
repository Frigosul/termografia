'use client'
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
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import utc from "dayjs/plugin/utc"
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
dayjs.extend(utc)



const variationChart = [
  '01 minuto',
  '05 minutos',
  '10 minutos',
  '15 minutos',
  '20 minutos',
  '30 minutos',
]

const managedStandards = z.object({
  local: z
    .string({ message: 'Selecione o local desejado.' }),

  variationChart: z
    .string({ message: 'Defina a variação desejada no gráfico.' })
    .refine((value) => variationChart.includes(value), {
      message: 'Variação inválida. Escolha outra variação.',
    }),

  startDate: z.string({ message: 'Defina a data de fechamento.' }),
  dateThaw: z.string(),
  endDate: z.string({ message: 'Defina a data de abertura.' }),
})

type ManagedStandards = z.infer<typeof managedStandards>

export function FormManagedStandards() {
  const { data: local, isLoading } = useQuery({
    queryKey: ['list-instruments'],
    queryFn: getInstruments,
  })
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { isSubmitting, errors },
  } = useForm<ManagedStandards>({
    resolver: zodResolver(managedStandards),
  })

  function handleManagedStandards(data: ManagedStandards) {
    const startDataUtc = dayjs(data.startDate).utc().format('YYYY-MM-DDTHH:mm')
    const endDataUtc = dayjs(data.endDate).utc().format('YYYY-MM-DDTHH:mm')

  }

  const startDateValue = watch('startDate')

  useEffect(() => {
    if (!startDateValue) return
    const endDate = dayjs(startDateValue).add(1, 'day').format('YYYY-MM-DDTHH:mm')
    const addHoursToThaw = dayjs(startDateValue).add(8, 'hours').format('YYYY-MM-DDTHH:mm')

    setValue('endDate', endDate)
    setValue('dateThaw', addHoursToThaw)
  }, [startDateValue, setValue])

  return (
    <form
      onSubmit={handleSubmit(handleManagedStandards)}
      className="gap-2  flex flex-col items-start"
    >
      <TooltipProvider>
        <div className="flex w-full gap-3">
          <div className="space-y-2 flex-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Label className="font-light text-sm" htmlFor="local">
                    Local
                  </Label>
                  <Controller
                    name="local"
                    control={control}
                    render={({ field: { onChange, value, ref } }) => (
                      <Select onValueChange={onChange} value={value} disabled={isLoading}>
                        <SelectTrigger ref={ref} className="dark:bg-slate-900">
                          <SelectValue placeholder="Selecione o local" />
                        </SelectTrigger>
                        <SelectContent>
                          {local?.map(item => {
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
                Local que será gerado os dados
              </TooltipContent>
            </Tooltip>

            {errors.local?.message && (
              <p className="text-red-500 text-sm font-light">
                {errors.local?.message}
              </p>
            )}
          </div>
          <div className="space-y-2 flex-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Label className="font-light text-sm" htmlFor="local">
                    Variação do gráfico
                  </Label>
                  <Controller
                    name="variationChart"
                    control={control}
                    render={({ field: { onChange, value, ref } }) => (
                      <Select onValueChange={onChange} value={value}>
                        <SelectTrigger ref={ref} className="dark:bg-slate-900">
                          <SelectValue placeholder="Variação do gráfico" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="01 minuto">01 minuto</SelectItem>
                          <SelectItem value="05 minutos">05 minutos</SelectItem>
                          <SelectItem value="10 minutos">10 minutos</SelectItem>
                          <SelectItem value="15 minutos">15 minutos</SelectItem>
                          <SelectItem value="20 minutos">20 minutos</SelectItem>
                          <SelectItem value="30 minutos">30 minutos</SelectItem>
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
            {errors.variationChart?.message && (
              <p className="text-red-500 text-sm font-light">
                {errors.variationChart?.message}
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
                    Data Fechamento
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
                  <Label className="font-light text-sm" htmlFor="dateThaw">
                    Variação Degelo
                  </Label>
                  <Input
                    id="dateThaw"
                    type="datetime-local"
                    min="2000-01-01T00:00"
                    max="9999-12-31T23:59"
                    className="dark:bg-slate-900"
                    {...register('dateThaw')}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">Variação de degelo.</TooltipContent>
            </Tooltip>
            {errors.endDate?.message && (
              <p className="text-red-500 text-sm font-light">
                {errors.endDate?.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Label className="font-light text-sm" htmlFor="endDate">
                    Data Abertura
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
