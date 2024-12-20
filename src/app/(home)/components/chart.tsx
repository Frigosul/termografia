import { useApperanceStore } from '@/stores/useAppearanceStore'
import { memo, useMemo, useRef } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { toast } from 'sonner'
interface ChartProps {
  dataChart: {
    id: string
    name: string
    type: 'temp' | 'press'
    status: string
    isSensorError: boolean
    temperature: number
    pressure: number
    error: string | null
    maxValue: number
    minValue: number
  }
}

const Chart = memo(function Chart({
  dataChart: {
    name,
    type,
    temperature,
    pressure,
    status,
    isSensorError,
    error,
    minValue,
    maxValue,
  },
}: ChartProps) {
  const { appearanceMode } = useApperanceStore()
  const valueInPercent = Math.min(
    Math.max(
      (((type === 'press' ? pressure : temperature) - minValue) /
        (maxValue - minValue)) *
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

  const lastWarning = useRef<string | null>(null)

  useMemo(() => {
    const showTemperatureWarning = (id: string, message: string) => {
      toast.warning(message, {
        id,
        position: 'bottom-right',
        closeButton: true,
        duration: 200000,
      })
    }

    if (valueInPercent <= 10 && lastWarning.current !== 'low') {
      showTemperatureWarning(
        name,
        `${type === 'press' ? 'Pressão' : 'Temperatura'} em ${name}, próxima do mínimo permitido`,
      )
      lastWarning.current = 'low'
    } else if (valueInPercent >= 90 && lastWarning.current !== 'high') {
      showTemperatureWarning(
        name,
        `${type === 'press' ? 'Pressão' : 'Temperatura'} em ${name}, próxima do máximo permitido`,
      )
      lastWarning.current = 'high'
    } else if (
      valueInPercent > 10 &&
      valueInPercent < 90 &&
      lastWarning.current !== null
    ) {
      lastWarning.current = null
    }
  }, [valueInPercent, type, name])

  if (appearanceMode === 'graph') {
    return (
      <div
        className={`border-2 rounded-md  ${isSensorError || (error && 'border-red-500/60 opacity-80 bg-red-200/10 dark:bg-red-200/20')}`}
      >
        <div className="flex flex-col items-center justify-center">
          <div className="w-full text-center whitespace-nowrap overflow-hidden text-ellipsis px-2 capitalize mb-2">
            <strong className="font-normal text-xl mb-4 capitalize">
              {name}
            </strong>
          </div>
          <ResponsiveContainer width="93%" height={200}>
            <PieChart>
              <Pie
                data={!error ? data : [{ value: 0 }, { value: 100 }]}
                startAngle={180} // Inicia o arco do topo da metade esquerda
                endAngle={0} // Termina no topo da metade direita
                innerRadius="80%" // Raio interno
                outerRadius="100%" // Raio externo
                dataKey="value" // Valor do gráfico
                stroke="none" // Sem bordas
                max={maxValue}
                min={minValue}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col text-center  mt-[-9.5rem]">
            <p
              className={`${error ? 'sr-only' : 'not-sr-only'} text-center text-sm text-blue-800 dark:text-blue-500`}
            >
              {type === 'temp' ? <span> Temp.</span> : <span>Press.</span>}
            </p>
            <p className={`text-center text-2xl ${colorInPercent}`}>
              {!isSensorError &&
                !error &&
                Number(type === 'press' ? pressure : temperature).toFixed(
                  1,
                )}{' '}
              {!isSensorError && !error ? (
                type === 'temp' ? (
                  '°C'
                ) : (
                  'bar'
                )
              ) : (
                <span className="flex w-28 text-base text-red-700 dark:text-red-500 flex-wrap">
                  {isSensorError
                    ? 'Erro de sensor'
                    : error && 'Falha de comunicação'}
                </span>
              )}
            </p>
          </div>
          <div className="w-[90%]  max-w-[210px] flex justify-between items-center text-xs tracking-tighter leading-4 text-muted-foreground">
            <span className="w-6 text-center">{minValue}</span>
            <span className="w-6 text-center">{maxValue}</span>
          </div>
        </div>
        {type === 'temp' && (
          <div className="flex justify-between px-1  lg:p-2 flex-wrap">
            <span className="text-xs  w-16 lg:w-[70px] font-normal lg:text-sm flex items-center justify-between  gap-3">
              DEGE.
              <div
                className={`size-3 lg:size-4 rounded-full ${status.includes('deg') ? 'bg-emerald-500' : 'bg-zinc-400'}`}
              />
            </span>
            <span className="text-xs w-16 lg:w-[70px]  font-normal lg:text-sm flex items-center justify-between  gap-3">
              VENT.
              <div
                className={`size-3 lg:size-4 rounded-full ${status.includes('vent') ? 'bg-emerald-500' : 'bg-zinc-400'}`}
              />
            </span>
            <span className="text-xs w-16 lg:w-[70px] font-normal lg:text-sm flex items-center justify-between  gap-3">
              RESF.
              <div
                className={`size-3 lg:size-4 rounded-full ${status.includes('resf') ? 'bg-emerald-500' : 'bg-zinc-400'}`}
              />
            </span>
            <span className="text-xs w-16 lg:w-[70px] font-normal lg:text-sm flex items-center justify-between  gap-3">
              PORT.
              <div
                className={`size-3 lg:size-4 rounded-full ${status.includes('port') ? 'bg-emerald-500' : 'bg-zinc-400'}`}
              />
            </span>
          </div>
        )}
      </div>
    )
  } else {
    return (
      <div
        className={`border-2 rounded-md p-2 ${isSensorError || (error && 'border-red-500/60 opacity-80 bg-red-200/10 dark:bg-red-200/20')}`}
      >
        <div className="w-full text-center whitespace-nowrap overflow-hidden text-ellipsis px-2 capitalize">
          <strong className="font-normal text-xl mb-4">{name}</strong>
        </div>
        <div className="flex items-center justify-center gap-2">
          <div className="flex flex-col h-20 justify-between">
            <span className="text-xs text-muted-foreground font-light">
              min: {minValue}
            </span>
            <p className={`text-center text-3xl ${colorInPercent} `}>
              {!isSensorError && !error ? (
                Number(type === 'press' ? pressure : temperature)
              ) : (
                <span className="flex w-28 text-base text-red-700 dark:text-red-500 flex-wrap">
                  {isSensorError
                    ? 'Erro de sensor'
                    : error && 'Falha de comunicação'}
                </span>
              )}
            </p>
            <span className="text-xs text-muted-foreground font-light">
              max: {maxValue}
            </span>
          </div>
          <div className="flex flex-col justify-between lg:p-2 flex-wrap">
            <span className="text-xs  w-[70px] font-normal lg:text-sm flex items-center justify-between gap-3">
              DEGE.
              <div
                className={`size-3 lg:size-3 rounded-full ${status.includes('deg') ? 'bg-emerald-500' : 'bg-zinc-400'}`}
              />
            </span>
            <span className="text-xs w-[70px]  font-normal lg:text-sm flex items-center justify-between gap-3">
              VENT.
              <div
                className={`size-3 lg:size-3 rounded-full ${status.includes('vent') ? 'bg-emerald-500' : 'bg-zinc-400'}`}
              />
            </span>
            <span className="text-xs w-[70px] font-normal lg:text-sm flex items-center justify-between gap-3">
              RESF.
              <div
                className={`size-3 lg:size-3 rounded-full ${status.includes('resf') ? 'bg-emerald-500' : 'bg-zinc-400'}`}
              />
            </span>
            <span className="text-xs w-[70px] font-normal lg:text-sm flex items-center justify-between gap-3">
              PORT.
              <div
                className={`size-3 lg:size-3 rounded-full ${status.includes('port') ? 'bg-emerald-500' : 'bg-zinc-400'}`}
              />
            </span>
          </div>
        </div>
      </div>
    )
  }
})

export { Chart }
