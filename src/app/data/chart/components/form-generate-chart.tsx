"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const localChamber = ["Câmara 01", "Câmara 02", "Câmara 03", "Câmara 04", "Câmara 05"]
const variationChart = [
  "10 minutos",
  "15 minutos",
  "20 minutos",
  "30 minutos",
  "01 hora"
]
const variationTable = [
  "01 minuto",
  "05 minutos",
  "10 minutos",
  "15 minutos",
  "20 minutos",
  "30 minutos",
]

const generateDataChart = z.object({
  localChamber: z
    .string()
    .refine(value => localChamber.includes(value), {
      message: "Local inválido. Escolha outro local.",
    }),
  variationChart: z
    .string()
    .refine(value => variationChart.includes(value), {
      message: "Variação inválida. Escolha outra variação.",
    }),
  variationTable: z
    .string()
    .refine(value => variationTable.includes(value), {
      message: "Variação inválida. Escolha outra variação.",
    }),
  limit: z.number(),
  detour: z.number(),
  variationTemp: z.number(),
  minValue: z.number(),
  maxValue: z.number(),
  startDate: z.date(),
  endDate: z.date(),
  description: z.string(),
})


type GenerateDataChart = z.infer<typeof generateDataChart>
export function FormGenerateChart() {


  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm<GenerateDataChart>({ resolver: zodResolver(generateDataChart) })
  function handleGenerateDataChart(data: GenerateDataChart) {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(handleGenerateDataChart)} className="gap-2  flex flex-col items-start">
      <div className="flex flex-1 gap-3">
        <div className="space-y-2 w-60">
          <Label className="font-light text-sm" htmlFor="localChamber">Local</Label>
          <Select  {...register("localChamber")}>

            <SelectTrigger>
              <SelectValue placeholder="Selecione o local" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Câmara 01">Câmara 01</SelectItem>
              <SelectItem value="Câmara 02">Câmara 02</SelectItem>
              <SelectItem value="Câmara 03">Câmara 03</SelectItem>
              <SelectItem value="Câmara 04">Câmara 04</SelectItem>
            </SelectContent>
          </Select>
          {errors.localChamber?.message && <p className="text-red-500 text-sm font-light" >{errors.localChamber?.message}</p>}
        </div>

        <div className="space-y-2 w-60">
          <Label className="font-light text-sm" htmlFor="localChamber">Variação gráfico</Label>

          <Select {...register("variationChart")}>
            <SelectTrigger>
              <SelectValue placeholder="Variação do gráfico" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10 minutos">10 minutos</SelectItem>
              <SelectItem value="15 minutos">15 minutos</SelectItem>
              <SelectItem value="20 minutos">20 minutos</SelectItem>
              <SelectItem value="30 minutos">30 minutos</SelectItem>
              <SelectItem value="01 hora">01 hora</SelectItem>
            </SelectContent>
          </Select>
          {errors.variationChart?.message && <p className="text-red-500 text-sm font-light" >{errors.variationChart?.message}</p>}
        </div>
        <div className="space-y-2 w-60">
          <Label className="font-light text-sm" htmlFor="localChamber">Variação tabela</Label>

          <Select {...register("variationTable")}>
            <SelectTrigger>
              <SelectValue placeholder="Variação da tabela" />
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
          {errors.variationTable?.message && <p className="text-red-500 text-sm font-light" >{errors.variationTable?.message}</p>}
        </div>


      </div>

      <div className="flex items-end gap-2">
        <div className="space-y-2 w-20">
          <Label className="font-light text-sm" htmlFor="limit">Valor Limite</Label>
          <Input id="limit" type="number" className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" {...register('limit')} />
          {errors.limit?.message && <p className="text-red-500 text-sm font-light" >{errors.limit?.message}</p>}
        </div>
        <div className="space-y-2 w-20">
          <Label className="font-light text-sm" htmlFor="detour">Desvio</Label>
          <Input id="detour" type="number" className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" {...register('detour')} />
          {errors.detour?.message && <p className="text-red-500 text-sm font-light" >{errors.detour?.message}</p>}
        </div>
        <div className="space-y-2 w-32">
          <Label className="font-light text-sm" htmlFor="variationTemp">Var. Col. Temp.</Label>
          <Input id="variationTemp" type="number" className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" {...register('variationTemp')} />
          {errors.variationTemp?.message && <p className="text-red-500 text-sm font-light" >{errors.variationTemp?.message}</p>}
        </div>
        <div className="space-y-2 w-20">
          <Label className="font-light text-sm" htmlFor="minValue">Valor Min.</Label>
          <Input id="minValue" type="number" className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" {...register('minValue')} />
          {errors.minValue?.message && <p className="text-red-500 text-sm font-light" >{errors.minValue?.message}</p>}
        </div>
        <div className="space-y-2 w-20">
          <Label className="font-light text-sm" htmlFor="maxValue">Valor Max.</Label>
          <Input id="maxValue" type="number" className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" {...register('maxValue')} />
          {errors.maxValue?.message && <p className="text-red-500 text-sm font-light" >{errors.maxValue?.message}</p>}
        </div>
        <div className="space-y-2 ">
          <Label className="font-light text-sm" htmlFor="startDate">Data Inicial</Label>
          <Input id="startDate" type="date" {...register('startDate')} />
          {errors.startDate?.message && <p className="text-red-500 text-sm font-light" >{errors.startDate?.message}</p>}
        </div>
        <div className="space-y-2 ">
          <Label className="font-light text-sm" htmlFor="endDate">Data Final</Label>
          <Input id="endDate" type="date" {...register('endDate')} />
          {errors.endDate?.message && <p className="text-red-500 text-sm font-light" >{errors.endDate?.message}</p>}
        </div>
      </div>
      <div className="space-y-2 ">
        <Label className="font-light text-sm" htmlFor="description">Informações adicionais</Label>
        <Textarea id="description" placeholder="Informações adicionais que deseja que apareça no gráfico." {...register('description')} />
        {errors.description?.message && <p className="text-red-500 text-sm font-light" >{errors.description?.message}</p>}
      </div>




      <div className="flex gap-5 ml-auto mt-auto">

        <Button disabled={isSubmitting} type="submit">Gerar gráfico</Button>
        <Button disabled={isSubmitting} type="button" variant="secondary">Imprimir gráfico</Button>

      </div>
    </form>
  )
}