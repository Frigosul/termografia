
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Chart } from "./components/chart";
import { FormGenerateChart } from "./components/form-generate-chart";
import { Table } from "./components/table";
export default function PageChart() {

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
          <Chart />
          <Table />
          <div className="flex gap-2 h-32 mt-4">
            <Card className="bg-transparent flex-1">
              <CardContent className="border border-card-foreground rounded-md px-1 h-full" >
                <span className="text-xs" >Ocorrências / Medidas Corretivas:</span>
              </CardContent>
            </Card>
            <Card className="bg-transparent flex-2 w-80">
              <CardContent className="border border-card-foreground rounded-md px-1 h-full" >
                <span className="text-xs">Assinatura:</span>
              </CardContent>
            </Card>
            <Card className="bg-transparent flex-2  w-80">
              <CardContent className="border border-card-foreground rounded-md px-1 h-full" >
                <span className="text-xs">Assinatura:</span>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>

  )
}