import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card'
import { useModalStore } from '@/stores/useModalStore'
import { ChartData } from '@/types/chart'
import { useSession } from 'next-auth/react'
import { useFormContext } from 'react-hook-form'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'

interface Props {
  dataChart: ChartData
  formMethods: ReturnType<typeof useFormContext>
  verifyValueInSetpoint: string
  onSubmit: () => void
  isLoading: boolean
  userRole: string
}

export function CardGraphView({
  dataChart,
  // formMethods,
  // verifyValueInSetpoint,
  // onSubmit,
  // isLoading,
  // userRole,
}: Props) {
  // const { register } = formMethods

  const valueInPercent = Math.min(
    Math.max(
      (((dataChart.type === 'press'
        ? dataChart.pressure
        : dataChart.temperature) -
        dataChart.minValue) /
        (dataChart.maxValue - dataChart.minValue)) *
      100,
      0,
    ),
    100,
  )
  const colorInPercent =
    valueInPercent >= 90
      ? 'text-red-600'
      : valueInPercent >= 60
        ? 'text-yellow-600'
        : 'text-primary'
  const data = [
    { value: valueInPercent }, // Filled part
    { value: 100 - valueInPercent }, // Unfilled part
  ]
  const COLORS =
    valueInPercent >= 90
      ? ['#ef4444', '#93b1e4']
      : valueInPercent >= 60
        ? ['#eab308', '#93b1e4']
        : ['#2178db', '#93b1e4']
  const session = useSession()
  const { openModal } = useModalStore()

  function handleOpenModalSettings(data: ChartData) {
    if (session.data?.role === 'manage') {
      openModal('settings-instrument', data)
    }
  }

  return (
    <Card
      onClick={() => handleOpenModalSettings(dataChart)}
      className={` ${session.data?.role === 'manage' && 'cursor-pointer'} ${dataChart.isSensorError || (dataChart.error && 'border-red-500/60 opacity-80 bg-red-200/10 dark:bg-red-200/20')}`}
    >
      <CardContent className="p-2">
        <CardTitle
          className={`w-full text-center whitespace-nowrap overflow-hidden text-ellipsis capitalize font-normal text-xl  ${!dataChart.process && 'mb-6'}`}
        >
          {dataChart.name}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground text-center font-light">
          {dataChart.process}
        </CardDescription>
        <ResponsiveContainer width="100%" height={150}>
          <PieChart>
            <Pie
              data={!dataChart.error ? data : [{ value: 0 }, { value: 100 }]}
              startAngle={180}
              endAngle={0}
              innerRadius="80%"
              outerRadius="100%"
              dataKey="value"
              stroke="none"
              max={dataChart.maxValue}
              min={dataChart.minValue}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="text-center mt-[-6.3rem]">
          <p className={`text-center font-light text-xl ${colorInPercent}`}>
            {(() => {
              if (dataChart.isSensorError) {
                return (
                  <span className="w-20 flex flex-wrap items-center mx-auto text-sm text-red-700 dark:text-red-500 mt-[-6.9rem]">
                    Erro de sensor
                  </span>
                )
              }

              if (dataChart.error) {
                return (
                  <span className="w-24 flex flex-wrap items-center mx-auto text-sm text-red-700 dark:text-red-500 mt-[-6.9rem]">
                    Falha de comunicação
                  </span>
                )
              }

              const value =
                dataChart.type === 'press'
                  ? (dataChart.pressure ?? 0)
                  : (dataChart.temperature ?? 0)

              const unit = dataChart.type === 'press' ? 'bar' : '°C'

              return `${Number(value).toFixed(1)} ${unit}`
            })()}
          </p>
        </div>
        <div className="w-[85%]  ml-3  max-w-[200px] flex justify-between items-center text-xs tracking-tighter leading-4 text-muted-foreground">
          <span className="w-6 text-center">{dataChart.minValue}</span>
          <span className=" text-center">S: {dataChart.setPoint}</span>
          <span className=" text-center">d: {dataChart.differential}</span>
          <span className="w-6 text-center">{dataChart.maxValue}</span>
        </div>

        {/* <form onSubmit={onSubmit} className="mt-auto flex items-end gap-2 pt-4">
          <div className="grid gap-1">
            <Label htmlFor="setpoint">Setpoint</Label>
            <Input
              id="setpoint"
              {...register('setpoint')}
              placeholder={dataChart.setPoint.toFixed(1)}
              maxLength={5}
              type="number"
              step={0.1}
              className="h-8 w-24"
            />
          </div>
          <Button
            disabled={isLoading || userRole !== 'ADMIN' || !verifyValueInSetpoint}
            type="submit"
            className="h-8"
          >
            Enviar
          </Button>
        </form> */}
      </CardContent>
    </Card>
  )
}
