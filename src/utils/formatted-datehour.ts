import dayjs from 'dayjs'

export function formattedDateHour(date: string) {
  const formattedDate = dayjs(date).format('DD/MM - HH:mm')
  return formattedDate
}
