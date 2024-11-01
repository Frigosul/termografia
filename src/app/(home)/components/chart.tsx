import { useModeAppearance } from '@/context/appearance-mode'
import { Cell, Pie, PieChart } from 'recharts'
interface ChartProps {
  dataChart: {
    id: string
    name: string
    type: 'temp' | 'press'
    status: string
    isSensorError: boolean
    temperature: number
    error: string | null
    maxValue: number
    minValue: number
  }
}

export function Chart({ dataChart: { name, type, temperature, status, isSensorError, error, minValue, maxValue } }: ChartProps) {
  const { mode } = useModeAppearance()
  const temperatureInPercent = Math.min((temperature / maxValue) * 100, 100);
  const colorInPercent = temperatureInPercent >= 90 ? 'text-red-600' : temperatureInPercent >= 60 ? 'text-yellow-600' : 'text-primary'

  const data = [
    { value: temperatureInPercent }, // Filled part
    { value: 100 - temperatureInPercent }, // Unfilled part
  ]
  const COLORS = temperatureInPercent >= 90 ? ['#ef4444', '#93b1e4'] : temperatureInPercent >= 60 ? ['#eab308', '#93b1e4'] : ['#2178db', '#93b1e4']

  if (mode === 'graph') {
    return (
      <div className={`border-2 rounded-md p-2 ${isSensorError || error && 'border-red-500/60 opacity-80 bg-red-200/10 dark:bg-red-200/20'}`}>
        <div className="flex flex-col items-center justify-center py-2">
          <div className="w-full text-center whitespace-nowrap overflow-hidden text-ellipsis px-2 capitalize mb-2">
            <strong className="font-normal text-xl mb-4 capitalize">{name}</strong>
          </div>
          <PieChart width={250} height={200}>
            <Pie
              data={!error ? data : [{ value: 0 }, { value: 100 }]}
              startAngle={180}           // Inicia o arco do topo da metade esquerda
              endAngle={0}               // Termina no topo da metade direita
              innerRadius={80}           // Raio interno
              outerRadius={100}          // Raio externo
              dataKey="value"            // Valor do gráfico
              stroke="none"              // Sem bordas
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
          <div className="flex flex-col text-center space-y-1 mt-[-9.5rem]">
            <p className={`${error ? 'sr-only' : 'not-sr-only'} text-center text-sm text-blue-800 dark:text-blue-500`}>
              {type === 'temp' ? <span> Temp.</span> : <span>Press.</span>}
            </p>
            <p className={`text-center text-2xl ${colorInPercent}`}>
              {!isSensorError && !error && Number(temperature).toFixed(1)} {!isSensorError && !error ? (type === 'temp' ? '°C' : 'bar') : <span className='flex w-28 text-base text-red-700 dark:text-red-500 flex-wrap'>{isSensorError ? 'Erro de sensor' : error && 'Falha de comunicação'}</span>}
            </p>
          </div>
        </div>
        <div className="flex justify-between lg:p-2 flex-wrap">
          <span className="text-xs  w-[70px] font-normal lg:text-sm flex items-center justify-between  gap-3">
            DEGE.
            <div
              className={`size-3 lg:size-4 rounded-full ${status.includes('deg') ? 'bg-emerald-500' : 'bg-zinc-400'}`}
            />
          </span>
          <span className="text-xs w-[70px]  font-normal lg:text-sm flex items-center justify-between  gap-3">
            VENT.
            <div
              className={`size-3 lg:size-4 rounded-full ${status.includes('vent') ? 'bg-emerald-500' : 'bg-zinc-400'}`}
            />
          </span>
          <span className="text-xs w-[70px] font-normal lg:text-sm flex items-center justify-between  gap-3">
            RESF.
            <div
              className={`size-3 lg:size-4 rounded-full ${status.includes('resf') ? 'bg-emerald-500' : 'bg-zinc-400'}`}
            />
          </span>
          <span className="text-xs w-[70px] font-normal lg:text-sm flex items-center justify-between  gap-3">
            PORT.
            <div
              className={`size-3 lg:size-4 rounded-full ${status.includes('port') ? 'bg-emerald-500' : 'bg-zinc-400'}`}
            />
          </span>
        </div>
      </div>
    )
  } else {
    return (
      <div className={`border-2 rounded-md p-2 ${isSensorError || error && 'border-red-500/60 opacity-80 bg-red-200/10 dark:bg-red-200/20'}`}>
        <div className="w-full text-center whitespace-nowrap overflow-hidden text-ellipsis px-2 capitalize">
          <strong className="font-normal text-xl mb-4">{name}</strong>
        </div>
        <div className="flex items-center justify-center gap-2">
          <div className="flex flex-col h-20 justify-between">
            <span className='text-xs text-muted-foreground font-light'>min: {minValue}</span>
            <p className={`text-center text-3xl ${colorInPercent} `}>
              {!isSensorError && !error ? Number(temperature).toFixed(1) : <span className='flex w-28 text-base text-red-700 dark:text-red-500 flex-wrap'>{isSensorError ? 'Erro de sensor' : error && 'Falha de comunicação'}</span>}
            </p>
            <span className='text-xs text-muted-foreground font-light'>max: {maxValue}</span>
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
}
