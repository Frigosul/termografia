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
    const columns = document.querySelectorAll(".data-column")
    let currentPageHeight = 0
    const a4Height = 1122
    const chartHeight = 30 * 16
    const firstPageAvailableHeight = a4Height - chartHeight
    let isFirstPage = true
    let lastColOnPage: Element | null = null

    columns.forEach((col, index) => {
      const colHeight = col.getBoundingClientRect().height
      const availableHeight = isFirstPage ? firstPageAvailableHeight : a4Height

      if (currentPageHeight + colHeight > availableHeight) {
        if (lastColOnPage) {
          if (lastColOnPage) {
            lastColOnPage.classList.add("border-b")
          }
        }

        col.classList.add("break-before-page")
        currentPageHeight = colHeight
        isFirstPage = false
      } else {
        currentPageHeight += colHeight
      }

      lastColOnPage = col
    })

  }, [])

  return (

    <div className="print:pt-4">
      <div className="mt-4 overflow-hidden ">
        <div className="flex flex-wrap print:max-h-a4-body print:overflow-hidden print:break-after-auto">
          {Array.from({ length: Math.ceil(data.length / 8) }).map(
            (_, columnIndex) => {
              const startIndex = columnIndex * 8
              const temperatureData = data.slice(startIndex, startIndex + 8)
              if (pressure) {
                const pressureData = pressure.slice(startIndex, startIndex + 8)
                const columnData = temperatureData.map((temp, index) => {
                  const pressureItem = pressureData[index]
                  return {
                    time: temp.time,
                    value: temp.value,
                    pressure: pressureItem?.pressure.toFixed(1),
                  }
                })
                return (
                  <div
                    key={columnIndex}
                    className="flex flex-col w-[9rem] print:w-[5.63rem] data-column break-inside-avoid border-x last:border-x-0 border-dashed border-card-foreground"
                  >
                    <div className="flex justify-between items-center px-5 py-1 print:!px-4 border-y border-b border-dashed border-muted-foreground">
                      <span className="text-xs">Hora</span>
                      <span className="text-xs">ºC</span>
                      {columnData[0].pressure !== null && (
                        <span className="text-xs">bar</span>
                      )}
                    </div>

                    {columnData.map((item, index) => {
                      return (
                        <div
                          key={index}
                          data-column={index + 1}
                          className="border-dashed border-muted-foreground h-6 px-4 flex items-center justify-between"
                        >
                          <span className="text-xs tracking-wide dark:font-light">
                            {formattedTime(item.time)}
                          </span>
                          <span className="text-xs tracking-wide dark:font-light">
                            {item.value}
                          </span>
                          {columnData[0].pressure !== null && (
                            <span className="text-xs tracking-wide dark:font-light">
                              / {item.pressure}
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )
              } else {
                return (
                  <div
                    key={columnIndex}
                    className="flex flex-col w-[9rem] print:w-[5.63rem] data-column break-inside-avoid border-x last:border-x-0 last:border-l-0 last:border-r border-dashed border-card-foreground"
                  >
                    <div className="flex justify-between items-center px-5 py-1 border-y border-dashed border-muted-foreground">
                      <span className="text-xs">Hora</span>
                      <span className="text-xs">ºC</span>
                    </div>

                    {temperatureData.map((item, index) => {
                      return (
                        <div
                          key={index}
                          data-column={index + 1}
                          className="border-dashed border-muted-foreground h-6 px-4 flex items-center justify-between"
                        >
                          <span className="text-xs tracking-wide dark:font-light">
                            {formattedTime(item.time)}
                          </span>
                          <span className="text-xs tracking-wide dark:font-light">
                            {item.value}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )
              }
            },
          )}
        </div>
        <div className="border-t border-dashed border-card-foreground py-2 text-xs tracking-wider w-full flex justify-start gap-4">
          <span className="ml-4">
            Valor Máximo: <span className="font-semibold">{maxValue} ºC</span>
          </span>
          <span>
            Valor Mínimo: <span className="font-semibold">{minValue} ºC</span>
          </span>
        </div>
      </div>
    </div>
  )
}
