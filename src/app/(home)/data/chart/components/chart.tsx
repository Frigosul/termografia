'use client'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

import { CartesianGrid, Line, LineChart, ReferenceLine, XAxis, YAxis } from "recharts";

export interface ChartProps { }


const chartConfig = {
  desktop: {
    label: "Desktop",
    theme: {
      light: "hsl(var(--chart-1))",
      dark: "hsl(var(--chart-1))",

    },

  },
  mobile: {
    label: "Mobile",
    theme: {
      light: "hsl(var(--chart-2))",
      dark: "hsl(var(--chart-2))",
    },
  },
} satisfies ChartConfig

const chartData = [
  {
    temp: 16.0,
    time: "14:15",
  },
  {
    temp: 15.5,
    time: "14:25",
  },
  {
    temp: 13.2,
    time: "14:35",
  },
  {
    temp: 11.5,
    time: "14:45",
  },
  {
    temp: 10.0,
    time: "14:55",
  },

]

export function Chart(props: ChartProps) {
  const initialValue = -20
  const finishedValue = 20
  const interval = Math.abs(finishedValue - initialValue) + 1

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px]  border border-card-foreground rounded-md py-4 flex items-center justify-center">
      <LineChart
        width={500}
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >

        <CartesianGrid stroke="hsl(var(--muted-foreground))" strokeWidth={0.5} />
        <XAxis dataKey="time" stroke="hsl(var(--card-foreground))" />
        <YAxis
          type="number"
          domain={[initialValue, finishedValue]}
          ticks={Array.from({ length: interval }).map((_, i) => initialValue + i)}
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
          activeDot={{ r: 8 }} />

      </LineChart>
    </ChartContainer>
  )
}