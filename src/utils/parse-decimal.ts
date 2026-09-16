export function parseDecimal(value: string | number): number {
  if (typeof value === 'number') return value

  const normalizedValue = value.trim().replace(',', '.')

  return normalizedValue === '' ? Number.NaN : Number(normalizedValue)
}
