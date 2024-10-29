import dayjs from "dayjs"
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)
dayjs.extend(timezone)
export function formattedTime(date: string) {
  const time = dayjs(date).utc().format('HH:mm')
  return time
}
