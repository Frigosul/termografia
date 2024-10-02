export function formattedDate(date: Date) {
  return date.toISOString().slice(0, 16)
}
