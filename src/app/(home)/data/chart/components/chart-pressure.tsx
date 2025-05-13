import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { formattedDateTime } from '@/utils/formatted-datetime'
import { formattedTime } from '@/utils/formatted-time'
import dayjs from 'dayjs'

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
  dateClose: string
  dateOpen: string
  limit?: number
  detour?: number
  variation?: number
  minValue: number
  maxValue: number
  data: {
    time: string
    value: number
  }[]
}
export function ChartPressure({
  data,
  dateClose,
  dateOpen,
  local,
  minValue,
  limit,
  variation,
  maxValue,
}: ChartProps) {
  const interval = Number(
    (Math.abs(Number(maxValue) - Number(minValue)) + 1).toFixed(0),
  )
  const formattedData = data.map((item) => {
    return {
      time: formattedTime(item.time),
      value: item.value,
    }
  })

  const formattedDateClose = dayjs(dateClose).format('DD/MM/YYYY - HH:mm')
  const formattedDateOpen = formattedDateTime(dateOpen)

  return (
    <div className="relative border border-card-foreground rounded-md pt-4  h-72 my-4">
      <div className="absolute print:right-2 right-[-6.5rem] top-2 md:right-9 md:top-9 md:min-w-60  border border-card-foreground !bg-muted  dark:!bg-slate-800 shadow-sm rounded-md z-20 p-0.5 px-1 md:p-2 md:px-3 text-[10px] md:text-xs font-light flex flex-col gap-1">
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
      <ChartContainer config={chartConfig} className="h-64 print:h-[25rem] w-full">
        <LineChart
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
            tickMargin={20}
            fontWeight={400}
            height={55}
            angle={90}
            interval={0}
            stroke="hsl(var(--card-foreground))"
            label={{
              value: 'Horário',
              position: 'bottom',
              offset: -5,
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
              value: 'Pressão',
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
            ticks={Array.from({ length: interval }).map((_, i) => minValue + i)}
            interval={variation ? variation - 1 : 0}
            stroke="hsl(var(--card-foreground))"
          />
          {limit && <ReferenceLine y={limit} label="Max." stroke="red" />}
          <ReferenceLine y={0} stroke="black" strokeWidth={2} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="value"
            strokeWidth={2}
            stroke="var(--color-desktop)"
            fill="var(--color-desktop)"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  )
}
