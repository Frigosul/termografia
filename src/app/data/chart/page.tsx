
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormGenerateChart } from "./components/form-generate-chart";

export default function Chart() {


  return (
    <Card className="w-3/4 mx-auto mt-4 bg-muted  dark:bg-slate-800 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl tracking-tight text-blue-600 dark:text-blue-500 underline">Gerar gráfico</CardTitle>
      </CardHeader>
      <CardContent >
        <FormGenerateChart />
      </CardContent>
    </Card>
  )
}