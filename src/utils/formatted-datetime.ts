import dayjs from 'dayjs'

export function formattedDateTime(date: string) {
  const formattedDate = dayjs(date).format('DD/MM/YYYY - HH:mm')
  return formattedDate
}
