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
import { Textarea } from '@/components/ui/textarea'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useGeneratePDF } from '@/hooks/useGeneratorPdf'
import { useInstrumentsStore } from '@/stores/useInstrumentsStore'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import utc from "dayjs/plugin/utc"
import { RefObject, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
dayjs.extend(utc)


const generateDataChart = z.object({
  local: z
    .string({ message: 'Selecione o local desejado.' }),
  graphVariation: z
    .string({ message: 'Defina a variação desejada no gráfico.' }),

  tableVariation: z
    .string({ message: 'Defina a variação desejada na tabela' }),

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
  mutate: (data: ListDataRequest) => Promise<ListDataResponse>
}

export function FormGenerateChart({ divRef, mutate }: FormGenerateChartProps) {
  const { generatePDF } = useGeneratePDF()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { isSubmitting, errors },
  } = useForm<GenerateDataChart>({ resolver: zodResolver(generateDataChart) })

  const { instrumentList, isLoading } = useInstrumentsStore();



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

  useEffect(() => {
    if (!startDateValue) return
    const endDate = dayjs(startDateValue).add(24, 'hours').format('YYYY-MM-DDTHH:mm')

    setValue('endDate', endDate)
  }, [startDateValue, setValue])

  return (
    <form
      onSubmit={handleSubmit(handleGenerateDataChart)}
      className="gap-2 flex flex-col items-center md:items-start"
    >
      <TooltipProvider>
        <div className="flex flex-col w-full md:flex-row gap-2 md:gap-3">
          <div className="space-y-2 flex-1 h-20 ">
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
                Selecione o local que você deseja gerar o gráfico.
              </TooltipContent>
            </Tooltip>

            {errors.local?.message && (
              <p className="text-red-500 text-sm font-light">
                {errors.local?.message}
              </p>
            )}
          </div>
          <div className="space-y-2 flex-1 h-20">
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Label className="font-light text-sm" htmlFor="local">
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
                Selecione a variação desejada para gerar o gráfico.
              </TooltipContent>
            </Tooltip>
            {errors.graphVariation?.message && (
              <p className="text-red-500 text-sm font-light">
                {errors.graphVariation?.message}
              </p>
            )}
          </div>
          <div className="space-y-2 flex-1 h-20">
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Label className="font-light text-sm" htmlFor="local">
                    Variação tabela
                  </Label>
                  <Controller
                    name="tableVariation"
                    control={control}
                    render={({ field: { onChange, value, ref } }) => (
                      <Select onValueChange={onChange} value={value}>
                        <SelectTrigger ref={ref} className="dark:bg-slate-900">
                          <SelectValue placeholder="Variação da tabela" />
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
                Selecione a variação desejada para gerar a tabela.
              </TooltipContent>
            </Tooltip>
            {errors.tableVariation?.message && (
              <p className="text-red-500 text-sm font-light">
                {errors.tableVariation?.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap w-full  items-end  gap-2 overflow-hidden">
          <div className="space-y-2 md:min-w-44 lg:min-w-20 flex-1 h-20">
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Label className="font-light text-sm" htmlFor="limit">
                    Valor Limite
                  </Label>
                  <Input
                    id="limit"
                    type="number"
                    className="[appearance:textfield]   dark:bg-slate-900 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
              <p className="text-red-500 text-sm font-light">
                {errors.limit?.message}
              </p>
            )}
          </div>
          <div className="space-y-2 md:min-w-44 lg:min-w-20 flex-1 h-20">
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Label className="font-light text-sm" htmlFor="detour">
                    Desvio
                  </Label>

                  <Input
                    id="detour"
                    type="number"
                    className="[appearance:textfield]  dark:bg-slate-900  [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
              <p className="text-red-500 text-sm font-light">
                {errors.detour?.message}
              </p>
            )}
          </div>
          <div className="space-y-2 min-w-28  md:min-w-44 lg:min-w-20 flex-1 h-20">
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Label className="font-light text-sm" htmlFor="variationTemp">
                    Var. Col. Temp.
                  </Label>
                  <Input
                    id="variationTemp"
                    type="number"
                    className="[appearance:textfield] dark:bg-slate-900  [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    {...register('variationTemp', { valueAsNumber: true })}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                Variação da coluna de temperatura, padrão 1 Cº.
              </TooltipContent>
            </Tooltip>
            {errors.variationTemp?.message && (
              <p className="text-red-500 text-sm font-light">
                {errors.variationTemp?.message}
              </p>
            )}
          </div>
          <div className="flex md:flex-1 md:min-w-56 lg:min-w-44 h-20 gap-2 ">
            <div className="space-y-2 flex-1 ">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Label className="font-light text-sm" htmlFor="minValue">
                      Valor Min.
                    </Label>

                    <Input
                      id="minValue"
                      type="number"
                      className="[appearance:textfield] dark:bg-slate-900  [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
                <p className="text-red-500 text-sm font-light">
                  {errors.minValue?.message}
                </p>
              )}
            </div>
            <div className="space-y-2 flex-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Label className="font-light text-sm" htmlFor="maxValue">
                      Valor Max.
                    </Label>

                    <Input
                      id="maxValue"
                      type="number"
                      className="[appearance:textfield]  dark:bg-slate-900  [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
                <p className="text-red-500 text-sm font-light">
                  {errors.maxValue?.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex w-full flex-1 gap-2">
            <div className="space-y-2 w-full h-20">
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
                      className="dark:bg-slate-900 [appearance:textfield] [&::-webkit-calendar-picker-indicator]:appearance-none"
                      {...register('startDate')}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  Data e hora inicial para gerar o gráfico.
                </TooltipContent>
              </Tooltip>
              {errors.startDate?.message && (
                <p className="text-red-500 text-sm font-light">
                  {errors.startDate?.message}
                </p>
              )}
            </div>
            <div className="space-y-2 w-full h-20">
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
                      className="dark:bg-slate-900 "
                      {...register('endDate')}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  Data e hora final para gerar o gráfico.
                </TooltipContent>
              </Tooltip>
              {errors.endDate?.message && (
                <p className="text-red-500 text-sm font-light">
                  {errors.endDate?.message}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row w-full gap-3  md:items-end ">
          <div className="space-y-2 flex-1">
            <Label className="font-light text-sm" htmlFor="description">
              Informações adicionais
            </Label>
            <Textarea
              id="description"
              placeholder="Informações adicionais que deseja que apareça no gráfico."
              className="dark:bg-slate-900 resize-none"
              {...register('description')}
            />
            {errors.description?.message && (
              <p className="text-red-500 text-sm font-light">
                {errors.description?.message}
              </p>
            )}
          </div>
          <Button
            disabled={isSubmitting}
            type="submit"
            className="dark:bg-blue-600 bg-blue-400 hover:bg-blue-500 hover:dark:bg-blue-500 text-foreground"
          >
            Gerar gráfico
          </Button>
          <Button
            disabled={isSubmitting}
            type="button"
            onClick={() => generatePDF(divRef)}
            variant="secondary"
            className="dark:bg-gray-950 bg-slate-300 hover:bg-slate-400 hover:dark:bg-gray-900"
          >
            Imprimir gráfico
          </Button>
        </div>
      </TooltipProvider>
    </form>
  )
}
