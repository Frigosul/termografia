'use client'
import { getInstrumentsWithUnions } from '@/app/http/get-instruments-with-unions'
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
import { RefObject, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useReactToPrint } from 'react-to-print'
import { z } from 'zod'
dayjs.extend(utc)

const generateDataChart = z.object({
  local: z.string({ message: 'Selecione o local desejado.' }),
  graphVariation: z.string({
    message: 'Defina a variação desejada no gráfico.',
  }),

  tableVariation: z.string({ message: 'Defina a variação desejada na tabela' }),

  limit: z
    .union([z.number({ message: 'Defina um limite.' }), z.nan()])
    .optional(),
  detour: z
    .union([z.number({ message: 'Defina o desvio' }), z.nan()])
    .optional(),
  variationTemp: z
    .union([
      z.number({
        message: 'Defina uma variação na coluna de temperatura.',
      }),
      z.nan(),
    ])
    .optional(),

  minValue: z.union([z.number(), z.nan()]).optional(),
  maxValue: z.union([z.number(), z.nan()]).optional(),
  startDate: z.string({ message: 'Defina a data de início.' }),
  endDate: z.string({ message: 'Defina a data final.' }),
  description: z.string().optional(),
})

type GenerateDataChart = z.infer<typeof generateDataChart>

interface FormGenerateChartProps {
  divRef: RefObject<HTMLDivElement>
  isPending: boolean
  mutate: (data: ListDataRequest) => Promise<ListDataResponse>
}

export function FormGenerateChart({
  divRef,
  mutate,
  isPending,
}: FormGenerateChartProps) {
  const [initialDate, setInitialDate] = useState<string | Date>('')
  const [minEndDate, setMinEndDate] = useState<string | Date>('')
  const reactToPrintFn = useReactToPrint({
    documentTitle: 'Gráfico',
    contentRef: divRef,
    pageStyle: `
    @media print {
      @page {
        size: A4;
        margin: 0;
        padding: 0;
      }
      body {
        font-family: Arial, sans-serif;
        padding: 20px;
        margin: 0;
      }
    }
  `

  })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<GenerateDataChart>({
    resolver: zodResolver(generateDataChart),
  })

  const { data: instrumentList, isLoading } = useQuery({
    queryKey: ['list-instruments-with-unions'],
    queryFn: getInstrumentsWithUnions,
    staleTime: 1000 * 60 * 60, // 1 hour
  })

  async function handleGenerateDataChart(data: GenerateDataChart) {
    const startDataUtc = dayjs(data.startDate).utc().format('YYYY-MM-DDTHH:mm')
    const endDataUtc = dayjs(data.endDate).utc().format('YYYY-MM-DDTHH:mm')
    await mutate({
      local: data.local,
      graphVariation: data.graphVariation,
      tableVariation: data.tableVariation,
      limit: data.limit,
      detour: data.detour,
      variationTemp: data.variationTemp,
      minValue: data.minValue,
      maxValue: data.maxValue,
      startDate: startDataUtc,
      endDate: endDataUtc,
      description: data.description,
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
    setMinEndDate(startDateValue)
    setValue('endDate', endDate)
  }, [startDateValue, setValue])

  return (
    <form onSubmit={handleSubmit(handleGenerateDataChart)}>
      <TooltipProvider>
        <div className="flex gap-x-2 items-end flex-wrap">
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
                  <Label
                    className="font-light text-xs"
                    htmlFor="graphVariation"
                  >
                    Variação do gráfico
                  </Label>
                  <Controller
                    name="graphVariation"
                    control={control}
                    render={({ field: { onChange, value, ref } }) => (
                      <Select onValueChange={onChange} value={value}>
                        <SelectTrigger
                          ref={ref}
                          className="dark:bg-slate-900 h-8 w-40"
                        >
                          <SelectValue placeholder="Selecione" />
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
                Selecione a varição que deseja apresentar as informações no
                gráfico.
              </TooltipContent>
            </Tooltip>
            {errors.graphVariation?.message && (
              <p className="text-red-500 text-xs font-light w-40">
                {errors.graphVariation?.message}
              </p>
            )}
          </div>
          <div className="h-[4.5rem]">
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Label
                    className="font-light text-xs"
                    htmlFor="tableVariation"
                  >
                    Variação da tabela
                  </Label>
                  <Controller
                    name="tableVariation"
                    control={control}
                    render={({ field: { onChange, value, ref } }) => (
                      <Select onValueChange={onChange} value={value}>
                        <SelectTrigger
                          ref={ref}
                          className="dark:bg-slate-900 h-8 w-40"
                        >
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="01">01 minuto</SelectItem>
                          <SelectItem value="05">05 minutos</SelectItem>
                          <SelectItem value="10">10 minutos</SelectItem>
                          <SelectItem value="15">15 minutos</SelectItem>
                          <SelectItem value="20">20 minutos</SelectItem>
                          <SelectItem value="30">30 minutos</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                Selecione a variação desejada para mostrar na tabela.
              </TooltipContent>
            </Tooltip>
            {errors.tableVariation?.message && (
              <p className="text-red-500 text-xs font-light w-40">
                {errors.tableVariation?.message}
              </p>
            )}
          </div>
          <div className="w-20 h-[4.5rem]">
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Label className="font-light text-xs" htmlFor="limit">
                    Valor Limite
                  </Label>
                  <Input
                    id="limit"
                    type="number"
                    className="[appearance:textfield] h-8 dark:bg-slate-900 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    {...register('limit', { valueAsNumber: true })}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                Valor limite do gráfico, será gerada uma linha vermelha no
                mesmo.
              </TooltipContent>
            </Tooltip>
            {errors.limit?.message && (
              <p className="text-red-500 text-xs font-light w-40">
                {errors.limit?.message}
              </p>
            )}
          </div>
          <div className="w-14 h-[4.5rem]">
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Label className="font-light text-xs" htmlFor="detour">
                    Desvio
                  </Label>
                  <Input
                    id="detour"
                    type="number"
                    className="[appearance:textfield] h-8 dark:bg-slate-900  [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    {...register('detour', { valueAsNumber: true })}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                Desvio de temperatura da câmara, média da diferença de
                temperatura de cada leitura no gráfico.
              </TooltipContent>
            </Tooltip>
            {errors.detour?.message && (
              <p className="text-red-500 text-xs font-light w-40">
                {errors.detour?.message}
              </p>
            )}
          </div>
          <div className="w-20 h-[4.5rem]">
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Label className="font-light text-xs" htmlFor="variationTemp">
                    Var. Temp.
                  </Label>
                  <Input
                    id="variationTemp"
                    type="number"
                    className="[appearance:textfield] h-8 dark:bg-slate-900  [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    {...register('variationTemp', { valueAsNumber: true })}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                Variação da coluna de temperatura, padrão 1 Cº.
              </TooltipContent>
            </Tooltip>
            {errors.variationTemp?.message && (
              <p className="text-red-500 text-xs font-light w-40">
                {errors.variationTemp?.message}
              </p>
            )}
          </div>
          <div className="w-20 h-[4.5rem]">
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Label className="font-light text-xs" htmlFor="minValue">
                    Valor Min.
                  </Label>
                  <Input
                    id="minValue"
                    type="number"
                    className="[appearance:textfield] h-8 dark:bg-slate-900  [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    {...register('minValue', {
                      valueAsNumber: true,
                    })}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                Valor mínimo do gráfico, deixe em branco para ser automático.
              </TooltipContent>
            </Tooltip>
            {errors.minValue?.message && (
              <p className="text-red-500 text-xs font-light w-40">
                {errors.minValue?.message}
              </p>
            )}
          </div>
          <div className="w-20 h-[4.5rem]">
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Label className="font-light text-xs" htmlFor="maxValue">
                    Valor Max.
                  </Label>

                  <Input
                    id="maxValue"
                    type="number"
                    className="[appearance:textfield] h-8 dark:bg-slate-900  [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    {...register('maxValue', {
                      valueAsNumber: true,
                    })}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                Valor máximo do gráfico, deixe em branco para ser automático.
              </TooltipContent>
            </Tooltip>
            {errors.maxValue?.message && (
              <p className="text-red-500 text-xs font-light w-40">
                {errors.maxValue?.message}
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
                  <Label className="font-light text-xs" htmlFor="endDate">
                    Data Final
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

          <div className="lg:w-3/5 h-[4.5rem]">
            <Label className="font-light text-xs" htmlFor="description">
              Informações adicionais
            </Label>
            <Input
              id="description"
              placeholder="Informações adicionais que deseja que apareça no gráfico."
              className="dark:bg-slate-900 h-8 placeholder:text-xs"
              {...register('description')}
            />
            {errors.description?.message && (
              <p className="text-red-500 text-sm font-light">
                {errors.description?.message}
              </p>
            )}
          </div>
          <Button
            disabled={isPending}
            type="submit"
            className="h-8 min-w-32 mb-4"
          >
            Gerar
          </Button>
          <Button
            disabled={isPending}
            type="button"
            onClick={() => reactToPrintFn()}
            // onClick={() => window.print()}
            variant="outline"
            className="h-8 min-w-32 mb-4"
          >
            Imprimir
          </Button>
        </div>
      </TooltipProvider>
    </form>
  )
}
