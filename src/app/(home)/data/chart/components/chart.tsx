'use client'
import logo from '@/assets/frigosul.png'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { formattedDateTime } from '@/utils/formatted-datetime'
import { formattedTime } from '@/utils/formatted-time'

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
  local: string
  chartType: 'temp' | 'press'
  dateClose: Date
  dateOpen: Date
  limit?: number
  detour?: number
  variationTemp?: number
  minValue?: number
  maxValue?: number
  data: {
    time: Date
    temperature: number
  }[]
}
export function Chart({
  data,
  dateClose,
  dateOpen,
  local,
  minValue,
  detour,
  limit,
  variationTemp,
  maxValue,
}: ChartProps) {
  if (!minValue || !maxValue) {
    const minAndMaxValue = data.reduce(
      (acc, current) => {
        return {
          minValue:
            current.temperature < acc.minValue ? current.temperature - 1 : acc.minValue,
          maxValue:
            current.temperature > acc.maxValue ? current.temperature + 1 : acc.maxValue,
        }
      },
      { minValue: Infinity, maxValue: -Infinity },
    )
    minValue = Number(minAndMaxValue.minValue.toFixed(2))
    maxValue = Number(minAndMaxValue.maxValue.toFixed(2))
  }

  const interval = Number(
    (Math.abs(Number(maxValue) - Number(minValue)) + 1).toFixed(0),
  )

  const formattedData = data.map((item) => {
    return {
      time: formattedTime(new Date(item.time)),
      temp: item.temperature,
    }
  })
  const formattedDateClose = formattedDateTime(dateClose)
  const formattedDateOpen = formattedDateTime(dateOpen)

  return (
    <div>
      <div className="flex flex-col gap-3 md:gap-0 md:flex-row justify-between mb-4 px-4">
        <Image
          src={logo}
          alt="Logo Frigosul"
          className="w-full h-10 md:w-52 md:h-full "
        />
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
      <div className="relative border border-card-foreground rounded-md py-4 overflow-auto">
        <div className="absolute right-[-6.5rem] top-2 md:right-9 md:top-9 md:min-w-60  border border-card-foreground !bg-muted  dark:!bg-slate-800 shadow-sm rounded-md z-20 p-0.5 px-1 md:p-2 md:px-3 text-[10px] md:text-xs font-light flex flex-col gap-1">
          <div className="flex justify-between">
            <span>Local: </span>
            <span>{local}</span>
          </div>
          <div className="flex justify-between">
            <span>Fechamento: </span>
            <span>{formattedDateClose}</span>
          </div>
          <div className="flex justify-between">
            <span>Abertura: </span>
            <span>{formattedDateOpen}</span>
          </div>
        </div>
        <ChartContainer config={chartConfig} className="min-h-[13.5rem]">
          <LineChart
            width={500}
            data={formattedData}
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
            <XAxis
              dataKey="time"
              stroke="hsl(var(--card-foreground))"
              label={{
                value: 'Horário',
                position: 'bottom',
                offset: -10,
                style: {
                  textAnchor: 'middle',
                  fontSize: 12,
                  fontWeight: 'normal',
                },
              }}
            />
            <YAxis
              type="number"
              label={{
                value: 'Temperatura',
                position: 'left',
                angle: -90,
                offset: -15,
                style: {
                  textAnchor: 'middle',
                  fontSize: 12,
                  fontWeight: 'normal',
                },
              }}
              domain={[minValue, maxValue]}
              ticks={Array.from({ length: interval }).map(
                (_, i) => minValue + i,
              )}
              interval={variationTemp ? variationTemp - 1 : 0}
              stroke="hsl(var(--card-foreground))"
            />
            {limit && <ReferenceLine y={limit} label="Max." stroke="red" />}
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

        {typeof detour === 'number' && !isNaN(detour) && (
          <div className="text-xs font-light text-left ml-12 dark:text-slate-200">
            Desvio: {detour} °C
          </div>
        )}
      </div>
    </div>
  )
}
