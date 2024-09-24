'use client'
import { Cell, Pie, PieChart } from 'recharts'

interface ChartProps {
  chart: {
    name: string
    type: 'press' | 'temp'
    value: number
  }
}

const Chart = ({ chart: { name, type, value } }: ChartProps) => {
  const valueInPercent = ((value + 100) / 200) * 100

  const data = [
    { value: valueInPercent }, // Parte preenchida
    { value: 100 - valueInPercent }, // Parte não preenchida
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
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
        </PieChart>
        <div className="flex flex-col text-center space-y-1 mt-[-9rem]">
          <p className="text-center text-sm text-blue-800 dark:text-blue-500">
            {type === 'temp' ? <span> Temp.</span> : <span>Press.</span>}
          </p>
          <p className="text-center">
            {value.toFixed(1)} {type === 'temp' ? '°C' : 'bar'}
          </p>
        </div>
      </div>
      <div className="flex justify-between p-2">
        <span className="font-normal text-sm flex items-center justify-center gap-3">
          DEGE. <div className="w-3 h-3 rounded-full bg-zinc-400" />{' '}
        </span>
        <span className="font-normal text-sm flex items-center justify-center gap-3">
          VENT. <div className="w-3 h-3 rounded-full bg-zinc-400" />{' '}
        </span>
        <span className="font-normal text-sm flex items-center justify-center gap-3">
          COMP. <div className="w-3 h-3 rounded-full bg-zinc-400" />{' '}
        </span>
        <span className="font-normal text-sm flex items-center justify-center gap-3">
          PORT. <div className="w-3 h-3 rounded-full bg-zinc-400" />{' '}
        </span>
      </div>
    </div>
  )
}

export default Chart
