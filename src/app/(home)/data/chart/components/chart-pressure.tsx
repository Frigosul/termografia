import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { formattedTime } from '@/utils/formatted-time'

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

  return (
    <div className="border border-muted-foreground rounded-md pt-4 print:pt-0 h-72 print:h-60 my-4 print:border-none">
      <ChartContainer
        config={chartConfig}
        className="h-64 print:h-[25rem] print:mt-[-4rem] w-full"
      >
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
            // domain={[minValue, maxValue]}
            domain={[0, 6]}
            ticks={Array.from({ length: interval }).map((_, i) => minValue + i)}
            interval={variation ? variation - 1 : 0}
            // interval={0}
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
