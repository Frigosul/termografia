import { formattedTime } from '@/utils/formatted-time'
import { Fragment } from 'react'

interface TableProps {
  data: {
    time: Date
    temp: number
  }[]
}

export function Table({ data }: TableProps) {
  return (
    <div className="border border-card-foreground flex flex-wrap  mt-4 rounded-md overflow-hidden">
      <div className="flex flex-col content-start w-full  max-h-60 flex-wrap scrollbar-thin-light dark:scrollbar-thin scrollbar-webkit overflow-x-auto">
        {data.map((item, index) => {
          return (
            <Fragment key={index}>
              {index % 8 === 0 && (
                <div className="flex justify-between items-center w-[9rem] px-5 border-b border-dashed py-1 border-r  border-card-foreground  last:border-none">
                  <span className="text-xs">Hora</span>
                  <span className="text-xs">ºC</span>
                </div>
              )}
              <div
                key={index}
                className="border-r border-dashed border-muted-foreground w-[9rem] h-6 px-4 flex items-center justify-between"
              >
                <span className="text-xs tracking-wide dark:font-light ">
                  {formattedTime(new Date(item.time))}
                </span>
                <span className="text-xs tracking-wide dark:font-light ">
                  {item.temp}
                </span>
              </div>
            </Fragment>
          )
        })}
      </div>
      <div className="border-t border-dashed border-card-foreground py-2 text-xs tracking-wider w-full flex justify-start gap-4">
        <span className="ml-4">
          Valor Máximo: <span className="font-semibold">-2,0ºC</span>{' '}
        </span>
        <span>
          Valor Mínimo: <span className="font-semibold">-20,0ºC</span>{' '}
        </span>
      </div>
    </div>
  )
}
