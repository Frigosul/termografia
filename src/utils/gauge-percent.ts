type MaybeNumber = number | null | undefined

// Retorna null quando não dá para posicionar o valor na faixa (dados incompletos)
export function gaugePercent(
  value: MaybeNumber,
  minValue: MaybeNumber,
  maxValue: MaybeNumber,
): number | null {
  if (value == null || minValue == null || maxValue == null) return null
  if (maxValue <= minValue) return null

  const percent = ((value - minValue) / (maxValue - minValue)) * 100

  if (!Number.isFinite(percent)) return null

  return Math.min(Math.max(percent, 0), 100)
}
