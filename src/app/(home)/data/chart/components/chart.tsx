'use client'
import logo from '@/assets/frigosul.png'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

import Image from 'next/image'
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from 'recharts'

const chartConfig = {
  desktop: {
    label: 'Desktop',
    theme: {
      light: 'hsl(var(--chart-1))',
      dark: 'hsl(var(--chart-1))',
    },
  },
  mobile: {
    label: 'Mobile',
    theme: {
      light: 'hsl(var(--chart-2))',
      dark: 'hsl(var(--chart-2))',
    },
  },
} satisfies ChartConfig

interface ChartProps {
  data: {
    time: Date
    temp: number
  }[]
}
export function Chart({ data }: ChartProps) {
  const initialValue = -20
  const finishedValue = 20
  const interval = Math.abs(finishedValue - initialValue) + 1

  return (
    <div>
      <div className="flex justify-between mb-4 px-4">
        <Image src={logo} alt="Logo Frigosul" width={200} />
        <div className="flex flex-col gap-1 text-justify text-xs font-semibold dark:font-light">
          <span>
            Empresa:{' '}
            <span className="capitalize">Frigosul frigorífico Sul LTDA.</span>{' '}
          </span>
          <span>
            CNPJ: <span>02.591.772/0001-70</span>{' '}
          </span>
          <span>
            Cidade:{' '}
            <span className="capitalize">aparecida do Taboado - MS</span>{' '}
          </span>
          <span>
            SIF: <span>889</span>{' '}
          </span>
        </div>
      </div>
      <div className="relative border border-card-foreground rounded-md py-4 ">
        <div className="absolute right-9 top-9 min-w-60  border border-card-foreground !bg-muted  dark:!bg-slate-800 shadow-sm rounded-md z-20 p-2 px-3 text-xs font-light flex flex-col gap-1">
          <div className="flex justify-between">
            <span>Local: </span>
            <span>Câmara 01</span>
          </div>
          <div className="flex justify-between">
            <span>Fechamento: </span>
            <span>13/09/2024 11:20</span>
          </div>
          <div className="flex justify-between">
            <span>Abertura: </span>
            <span>14/09/2024 11:20</span>
          </div>
        </div>
        <ChartContainer config={chartConfig} className="min-h-[200px]">
          <LineChart
            width={500}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={0.5}
            />
            <XAxis dataKey="time" stroke="hsl(var(--card-foreground))" />
            <YAxis
              type="number"
              domain={[initialValue, finishedValue]}
              ticks={Array.from({ length: interval }).map(
                (_, i) => initialValue + i,
              )}
              interval={0}
              stroke="hsl(var(--card-foreground))"
            />
            <ReferenceLine y={10} label="Max." stroke="red" />
            <ReferenceLine y={0} stroke="black" strokeWidth={2} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="temp"
              strokeWidth={2}
              stroke="var(--color-desktop)"
              fill="var(--color-desktop)"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ChartContainer>
      </div>
    </div>
  )
}
