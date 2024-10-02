export function formattedDateTime(date: Date) {
  const dateValue = new Date(date)
  const formattedDate = dateValue.toLocaleDateString('pt-BR') // Formato dd/mm/aaaa
  const formattedTime = dateValue.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // 24 horas
  })

  return `${formattedDate} - ${formattedTime}`
}
