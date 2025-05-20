// CardCompactView.tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChartData } from '@/types/chart'
import { useFormContext } from 'react-hook-form'

interface Props {
  dataChart: ChartData
  formMethods: ReturnType<typeof useFormContext>
  verifyValueInSetpoint: string
  onSubmit: () => void
  isLoading: boolean
  userRole: string
}

export function CardCompactView({
  dataChart,
  formMethods,
  verifyValueInSetpoint,
  onSubmit,
  isLoading,
  userRole,
}: Props) {
  const { register } = formMethods
  const displayValue =
    dataChart.type === 'press' ? dataChart.pressure : dataChart.temperature

  return (
    <Card className="min-w-[12rem] max-w-[14rem] flex flex-col justify-between">
      <CardContent>
        <CardTitle className="text-base">{dataChart.name}</CardTitle>
        <span
          className="text-2xl font-semibold"
          style={{
            color: dataChart.isSensorError
              ? '#e11d48'
              : dataChart.type === 'press'
                ? '#0284c7'
                : '#10b981',
          }}
        >
          {dataChart.isSensorError
            ? '--'
            : `${displayValue.toFixed(1)} ${dataChart.type === 'press' ? 'bar' : '°C'}`}
        </span>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2">
        <form onSubmit={onSubmit} className="flex items-end gap-2">
          <div className="grid gap-1">
            <Label
              htmlFor={`setpoint-${dataChart.idSitrad}`}
              className="text-xs"
            >
              Setpoint
            </Label>
            <Input
              id={`setpoint-${dataChart.idSitrad}`}
              {...register('setpoint')}
              placeholder={dataChart.setPoint.toFixed(1)}
              maxLength={5}
              type="number"
              step={0.1}
              className="h-8 w-20 text-xs"
            />
          </div>
          <Button
            disabled={
              isLoading || userRole !== 'ADMIN' || !verifyValueInSetpoint
            }
            type="submit"
            className="h-8 text-xs"
          >
            Enviar
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
