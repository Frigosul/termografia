import { Cell, Pie, PieChart } from 'recharts'
interface ChartProps {
  data: {
    id: string
    name: string
    type: 'temp' | 'press'
    status: 'deg' | 'resf' | 'vent' | 'port'
    isSensorError: boolean
    temperature: number
  }
}

export function Chart({ data: { name, type, temperature, status } }: ChartProps) {
  const temperatureInPercent = ((Number(temperature) + 100) / 200) * 100

  const data = [
    { value: temperatureInPercent }, // Parte preenchida
    { value: 100 - temperatureInPercent }, // Parte não preenchida
  ]

  const COLORS = ['#2178db', '#93b1e4']

  return (
    <div className="border rounded-md p-2">
      <div className="flex flex-col items-center justify-center py-2">
        <strong className="font-normal text-xl text-center mb-4">{name}</strong>

        <PieChart width={250} height={200}>
          <Pie
            data={data}
            startAngle={180} // Configurações para semi-gauge
            endAngle={0} // Faz o gráfico ser semi-circular
            innerRadius={80} // Raio interno
            outerRadius={100} // Raio externo
            dataKey="value" // Valor do gráfico
            stroke="none" // Sem bordas
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
        </PieChart>
        <div className="flex flex-col text-center space-y-1 mt-[-9rem]">
          <p className="text-center text-sm text-blue-800 dark:text-blue-500">
            {type === 'temp' ? <span> Temp.</span> : <span>Press.</span>}
          </p>
          <p className="text-center">
            {Number(temperature).toFixed(1)} {type === 'temp' ? '°C' : 'bar'}
          </p>
        </div>
      </div>
      <div className="flex justify-between lg:p-2 flex-wrap">
        <span className="text-xs  font-normal lg:text-sm flex items-center justify-center gap-3">
          DEGE.
          <div
            className={`size-3 lg:size-4 rounded-full ${status === 'deg' ? 'bg-emerald-500' : 'bg-zinc-400'}`}
          />
        </span>
        <span className="text-xs  font-normal lg:text-sm flex items-center justify-center gap-3">
          VENT.
          <div
            className={`size-3 lg:size-4 rounded-full ${status === 'vent' ? 'bg-emerald-500' : 'bg-zinc-400'}`}
          />
        </span>
        <span className="text-xs  font-normal lg:text-sm flex items-center justify-center gap-3">
          REFR.
          <div
            className={`size-3 lg:size-4 rounded-full ${status === 'resf' ? 'bg-emerald-500' : 'bg-zinc-400'}`}
          />
        </span>
        <span className="text-xs  font-normal lg:text-sm flex items-center justify-center gap-3">
          PORT.
          <div
            className={`size-3 lg:size-4 rounded-full ${status === 'port' ? 'bg-emerald-500' : 'bg-zinc-400'}`}
          />
        </span>
      </div>
    </div>
  )
}
