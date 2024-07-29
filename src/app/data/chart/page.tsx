
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormGenerateChart } from "./components/form-generate-chart";

export default function Chart() {


  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-normal tracking-tight text-foreground ">Gerar gráfico</CardTitle>
      </CardHeader>
      <CardContent>
        <FormGenerateChart />
      </CardContent>
    </Card>
  )
}