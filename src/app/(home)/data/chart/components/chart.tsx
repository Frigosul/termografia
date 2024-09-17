'use client'
import logo from "@/assets/frigosul.png";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Image from "next/image";
import { useRef } from "react";
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
  const chartRef = useRef(null)
  const initialValue = -20
  const finishedValue = 20
  const interval = Math.abs(finishedValue - initialValue) + 1

  async function generatePDFChart() {
    const chartElement = chartRef.current

    // captura a div como imagem
    const canvas = await html2canvas(chartElement!)
    // obtém a imagem do canvas em formato png
    const imageData = canvas.toDataURL('image/png')
    // cria um novo documento pdf
    const pdf = new jsPDF('p', 'mm', 'a4')

    // Define a largura e altura do PDF
    const imgWidth = 210; // Largura do PDF em mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // adiciona a imagem ao pdf
    pdf.addImage(imageData, 'PNG', 0, 0, imgWidth, imgHeight)

    // salva o pdf
    pdf.save('chart.pdf')

  }


  return (
    <div ref={chartRef}>
      <div className="flex justify-between mb-4 px-4">
        <Image src={logo} alt="Logo Frigosul" width={200} />
        <div className="flex flex-col gap-1 text-justify text-xs font-semibold dark:font-light">
          <span>Empresa: <span className="capitalize">Frigosul frigorífico Sul LTDA.</span> </span>
          <span>CNPJ: <span >02.591.772/0001-70</span> </span>
          <span>Cidade: <span className="capitalize">aparecida do Taboado - MS</span> </span>
          <span>SIF: <span>889</span> </span>
        </div>
      </div>
      <div className="relative border border-card-foreground rounded-md py-4 ">

        <div className="absolute right-9 top-9 min-w-60  border border-card-foreground !bg-muted  dark:!bg-slate-800 shadow-sm rounded-md z-20 p-2 px-3 text-xs font-light flex flex-col gap-1">
          <div className="flex justify-between"><span>Local:  </span><span>Câmara 01</span></div>
          <div className="flex justify-between"><span>Fechamento:  </span><span>13/09/2024 11:20</span></div>
          <div className="flex justify-between"><span>Abertura:  </span><span>14/09/2024 11:20</span></div>


        </div>
        <ChartContainer config={chartConfig} className="min-h-[200px]" >

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
      </div>
    </div>
  )
}