'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { CartesianGrid, Line, LineChart, ReferenceLine, XAxis, YAxis } from "recharts";
import { FormGenerateChart } from "./components/form-generate-chart";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
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
export default function Chart() {
  const initialValue = -20
  const finishedValue = 20
  const interval = Math.abs(finishedValue - initialValue) + 1
  console.log(interval)
  return (
    <div className="h-[calc(100vh_-_7.5rem)] overflow-y-scroll">
      <Card className="w-3/4 mx-auto mt-4 bg-muted  dark:bg-slate-800 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl tracking-tight text-blue-600 dark:text-blue-500 underline">Gerar gráfico</CardTitle>
        </CardHeader>
        <CardContent>
          <FormGenerateChart />
        </CardContent>
      </Card>
      <Card className="w-3/4 mx-auto mt-4 bg-muted  dark:bg-slate-800 shadow-sm   py-4" >
        <CardContent>
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <LineChart
              width={500}
              // height={300}
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid stroke="#bbb" strokeDasharray="5 5" />
              <XAxis dataKey="time" />
              <YAxis
                type="number"
                domain={[initialValue, finishedValue]}
                ticks={Array.from({ length: 41 }).map((_, i) => initialValue + i)}
                interval={0}

              />
              <ReferenceLine y={10} label="Max." stroke="red" />
              <ChartTooltip content={<ChartTooltipContent />} />

              <Line type="monotone" dataKey="temp" stroke="#8884d8" activeDot={{ r: 8 }} />

            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>

  )
}