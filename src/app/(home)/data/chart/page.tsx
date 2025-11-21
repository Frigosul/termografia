'use client'
import { listData, ListDataResponse } from '@/app/http/list-data'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useMutation } from '@tanstack/react-query'
import { CircleX } from 'lucide-react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { Spinner } from '../../components/spinner'
import { ChartPressure } from './components/chart-pressure'
import { ChartTemperature } from './components/chart-temperature'
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
  console.log(dataChart?.chartTemperature)

  return (
    <ScrollArea className="flex-1">
      <main className="p-4 sm:p-6 md:p-6 max-w-screen-xl flex-1">
        <div className="w-full">
          <h2 className="font-normal tracking-tight text-foreground mb-2 text-sm md:text-base">
            Gerar gráfico
          </h2>
          <FormGenerateChart
            isPending={generateChartMutation.isPending}
            mutate={generateChartMutation.mutateAsync}
            divRef={divPdfRef}
          />
        </div>

        {generateChartMutation.isPending ? (
          <div className="flex items-center justify-center h-[calc(100vh-200px)] w-full">
            <Spinner size={62} />
          </div>
        ) : (
          dataChart && (
            <div
              ref={divPdfRef}
              className="dark:bg-slate-800 shadow-sm bg-muted p-4 rounded-md w-full print:bg-transparent print:p-0 print:w-[730px] print:shadow-none break-inside-avoid"
            >
              <>
                <ChartTemperature
                  maxValue={dataChart.maxValue}
                  minValue={dataChart.minValue}
                  dateClose={dataChart.dateClose}
                  dateOpen={dataChart.dateOpen}
                  limit={dataChart.limit}
                  detour={dataChart.detour}
                  variation={dataChart.variationTemp}
                  local={dataChart.name}
                  data={dataChart.chartTemperature}
                />
                {dataChart.chartType === 'temp/press' &&
                  dataChart.chartPressure && (
                    <ChartPressure
                      maxValue={6}
                      minValue={0}
                      dateClose={dataChart.dateClose}
                      dateOpen={dataChart.dateOpen}
                      limit={dataChart.limit}
                      variation={dataChart.variationTemp}
                      local={dataChart.name}
                      data={dataChart?.chartPressure}
                    />
                  )}
                <Table
                  data={dataChart.tableTemperatureRange!}
                  pressure={dataChart.tablePressureRange!}
                />
              </>

              <div
                className="flex gap-2 h-32 mt-4 print:break-inside-avoid"
                style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}
              >
                <Card className="bg-transparent flex-1 print:flex-2">
                  <CardContent className="border border-card-foreground rounded-md px-2 h-full print:w-96">
                    <span className="text-xs">
                      {' '}
                      Ocorrências / Medidas Corretivas:{' '}
                    </span>
                    <p className="text-sm">{dataChart.description}</p>
                  </CardContent>
                </Card>
                <Card className="bg-transparent flex-2 w-80">
                  <CardContent className="border border-card-foreground rounded-md px-2 h-full">
                    <span className="text-xs">Assinatura:</span>
                  </CardContent>
                </Card>
                <Card className="bg-transparent flex-2  w-80">
                  <CardContent className="border border-card-foreground rounded-md px-2 h-full">
                    <span className="text-xs">Assinatura:</span>
                  </CardContent>
                </Card>
              </div>
            </div>
          )
        )}
      </main>
    </ScrollArea>
  )
}
