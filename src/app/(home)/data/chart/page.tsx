'use client'
import { listData, ListDataResponse } from '@/app/http/list-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useMutation } from '@tanstack/react-query'
import { CircleX } from 'lucide-react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { Chart } from './components/chart'
import { FormGenerateChart } from './components/form-generate-chart'
import { Table } from './components/table'

export default function PageChart() {
  const [dataChart, setDataChart] = useState<ListDataResponse>()
  const generateChartMutation = useMutation({
    mutationKey: ['generate-chart'],
    mutationFn: listData,
    onSuccess: (data) => {
      setDataChart(data)
    },
    onError: (error) => {
      console.error(error)
      toast.error('Erro ao gerar gráfico, por favor tente novamente', {
        position: 'top-right',
        icon: <CircleX />,
      })
    },
  })

  const divPdfRef = useRef<HTMLDivElement>(null)

  return (
    <ScrollArea className="flex-1">
      <div className="grid grid-cols-1 mx-auto px-2 gap-2 py-3">
        <Card className="lg:w-4/5 lg:max-w-6xl lg:mx-auto md:mt-4 bg-muted  dark:bg-slate-800 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl tracking-tight  underline">
              Gerar gráfico
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 md:p-4">
            <FormGenerateChart
              mutate={generateChartMutation.mutateAsync}
              divRef={divPdfRef}
            />
          </CardContent>
        </Card>
        <Card className="lg:w-4/5 lg:max-w-6xl lg:mx-auto md:mt-4 bg-muted dark:bg-slate-800 shadow-sm py-4">
          <CardContent ref={divPdfRef} className="dark:bg-slate-800 pt-4">
            {generateChartMutation.isPending ? <p>Carregando...</p> : dataChart && (
              <>
                <Chart
                  maxValue={dataChart.maxValue}
                  minValue={dataChart.minValue}
                  chartType={dataChart.chartType!}
                  dateClose={dataChart.dateClose}
                  dateOpen={dataChart.dateOpen}
                  limit={dataChart.limit}
                  detour={dataChart.detour}
                  variationTemp={dataChart.variationTemp}
                  local={dataChart.name}
                  data={dataChart?.chartTemperature}
                />
                <Table data={dataChart.tableTemperatureRange!} />
              </>
            )}
            <div className="flex gap-2 h-32 mt-4">
              <Card className="bg-transparent flex-1">
                <CardContent className="border border-card-foreground rounded-md px-1 h-full">
                  <span className="text-xs">
                    Ocorrências / Medidas Corretivas:
                  </span>
                </CardContent>
              </Card>
              <Card className="bg-transparent flex-2 w-80">
                <CardContent className="border border-card-foreground rounded-md px-1 h-full">
                  <span className="text-xs">Assinatura:</span>
                </CardContent>
              </Card>
              <Card className="bg-transparent flex-2  w-80">
                <CardContent className="border border-card-foreground rounded-md px-1 h-full">
                  <span className="text-xs">Assinatura:</span>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>

    </ScrollArea>
  )
}
