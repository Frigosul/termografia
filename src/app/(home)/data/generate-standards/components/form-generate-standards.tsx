'use client'
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
import { useInstrumentsStore } from '@/stores/useInstrumentsStore'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import utc from "dayjs/plugin/utc"
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
dayjs.extend(utc)


const generateStandards = z.object({
  local: z.string({ message: 'Selecione o local desejado.' }),
  variation: z.string({ message: 'Defina a variação desejada no gráfico.' }),
  startDate: z.string({ message: 'Defina a data de fechamento.' }),
  dateThaw: z.string(),
  endDate: z.string({ message: 'Defina a data de abertura.' }),
})

type GenerateStandards = z.infer<typeof generateStandards>
interface FormGenerateDataProps {
  mutate: (dataUpdate: ListDataRequest) => Promise<ListDataResponse>
}


export function FormGenerateStandards({ mutate }: FormGenerateDataProps) {
  const { instrumentList, isLoading } = useInstrumentsStore();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { isSubmitting, errors },
  } = useForm<GenerateStandards>({
    resolver: zodResolver(generateStandards),
  })

  function handleGenerateStandards(data: GenerateStandards) {
    const startDataUtc = dayjs(data.startDate).utc().format('YYYY-MM-DDTHH:mm')
    const endDataUtc = dayjs(data.endDate).utc().format('YYYY-MM-DDTHH:mm')
    mutate({
      endDate: endDataUtc,
      startDate: startDataUtc,
      graphVariation: data.variation,
      local: data.local
    })
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
      onSubmit={handleSubmit(handleGenerateStandards)}
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
                          {instrumentList?.map(item => {
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
                    Variação
                  </Label>
                  <Controller
                    name="variation"
                    control={control}
                    render={({ field: { onChange, value, ref } }) => (
                      <Select onValueChange={onChange} value={value}>
                        <SelectTrigger ref={ref} className="dark:bg-slate-900">
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
              <p className="text-red-500 text-sm font-light">
                {errors.variation?.message}
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
