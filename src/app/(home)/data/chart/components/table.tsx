import { formattedTime } from '@/utils/formatted-time'
import { useEffect } from 'react'

interface TableProps {
  minValue?: number
  maxValue?: number
  data: {
    time: string
    value: number
  }[]
  pressure: {
    time: string
    pressure: number
  }[]
}

export function Table({ minValue, maxValue, data, pressure }: TableProps) {
  if (!minValue || !maxValue) {
    const minAndMaxValue = data.reduce(
      (acc, current) => {
        return {
          minValue:
            current.value < acc.minValue ? current.value - 1 : acc.minValue,
          maxValue:
            current.value > acc.maxValue ? current.value + 1 : acc.maxValue,
        }
      },
      { minValue: Infinity, maxValue: -Infinity },
    )
    minValue = Number(minAndMaxValue.minValue.toFixed(2))
    maxValue = Number(minAndMaxValue.maxValue.toFixed(2))
  }

  useEffect(() => {
    const columns = document.querySelectorAll('.data-column')
    let currentPageHeight = 0
    const a4Height = 1122
    const chartHeight = 30 * 16
    const firstPageAvailableHeight = a4Height - chartHeight
    let isFirstPage = true

    columns.forEach((col) => {
      const colHeight = col.getBoundingClientRect().height
      const availableHeight = isFirstPage ? firstPageAvailableHeight : a4Height

      if (currentPageHeight + colHeight > availableHeight) {
        col.classList.add('break-before-page')
        currentPageHeight = colHeight
        isFirstPage = false
      } else {
        currentPageHeight += colHeight
      }
    })
  }, [])
  const rowsPerColumn = 8
  const hasPressure = pressure && pressure.length > 0

  // Mapeia pressão por horário para acesso rápido
  const pressureMap = hasPressure
    ? new Map(pressure.map((item) => [item.time, item.pressure]))
    : null

  const mergedData = data.map((temp) => ({
    time: temp.time,
    value: temp.value,
    pressure: hasPressure ? pressureMap?.get(temp.time) : undefined,
  }))

  const columns = Array.from(
    { length: Math.ceil(data.length / rowsPerColumn) },
    (_, colIndex) =>
      mergedData.slice(
        colIndex * rowsPerColumn,
        (colIndex + 1) * rowsPerColumn,
      ),
  )

  return (
    <div className="flex flex-wrap gap-2 mt-2 ml-6 print:ml-14 print:bg-transparent print:shadow-none">
      {columns.map((columnData, colIdx) => (
        <div
          key={colIdx}
          className="min-w-[120px] border-dashed border-r pr-2 last:border-none print:break-inside-avoid"
        >
          <div className="flex justify-between px-2 font-bold  border-b border-white pb-1 mb-1 text-center">
            <div>Hora</div>
            <div>°C</div>
            {hasPressure && <div>Bar</div>}
          </div>
          {columnData.map((item, rowIdx) => (
            <div
              key={rowIdx}
              className={`flex justify-between px-2 text-sm py-0.5 border-b border-dashed border-muted-foreground ${rowIdx === rowsPerColumn - 1 || rowIdx === columnData.length - 1
                  ? 'border-b border-white'
                  : ''
                }`}
            >
              <div>{formattedTime(item.time)}</div>
              <div>{item.value.toFixed(1)}</div>
              {hasPressure && (
                <div>
                  {item.pressure !== undefined ? item.pressure.toFixed(1) : '-'}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
