import dayjs from "dayjs"
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)
dayjs.extend(timezone)


export function formattedDateTime(date: string) {
  const formattedDate = dayjs(date).utc().format("DD/MM/YYYY - HH:mm")
  return formattedDate
}
