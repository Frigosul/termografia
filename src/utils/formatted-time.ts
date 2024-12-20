import dayjs from 'dayjs'

export function formattedTime(date: string) {
  const time = dayjs(date).format('HH:mm')
  return time
}
