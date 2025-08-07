import { formattedDateHour } from '@/utils/formatted-datehour'
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

  // Reduzindo ainda mais para 5 linhas por coluna para criar mais colunas
  const rowsPerColumn = 6
  const hasPressure = pressure && pressure.length > 0

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
    <div className="flex flex-wrap gap-0.5 mt-2 ml-6 print:ml-0 print:mt-0 print:bg-transparent print:shadow-none print:scale-90 print:w-full">
      {columns.map((columnData, colIdx) => (
        <div
          key={colIdx}
          className="min-w-[120px] max-w-[120px] flex-1 border-dashed border-r pr-0.5 print:pr-0.5 last:border-none print:break-inside-avoid data-column"
        >
          <div className="flex justify-between px-0.5 print:px-0.5 border-b border-card-foreground mb-1 print:mb-0 text-center text-xs">
            <div>Hora</div>
            <div>°C</div>
            {hasPressure && <div>Bar</div>}
          </div>
          {columnData.map((item, rowIdx) => (
            <div
              key={rowIdx}
              className={`flex justify-between px-0.5 print:px-0.5 text-xs py-0.5 print:py-0 border-b border-dashed border-muted-foreground print:text-xs
                  ${rowIdx === rowsPerColumn - 1 ||
                  rowIdx === columnData.length - 1
                  ? 'border-b border-card-foreground'
                  : ''
                }`}
            >
              <div>{formattedDateHour(item.time)}</div>
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
