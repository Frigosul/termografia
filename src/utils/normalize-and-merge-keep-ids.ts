/* eslint-disable @typescript-eslint/no-explicit-any */
interface TableRow {
  id: string
  time: string
  updatedUserAt?: string | null
  updatedAt?: string
  temperatureId?: string | null
  pressureId?: string | null
  temperature?: number
  pressure?: number
  updatedUserAtTemp?: string | null
  updatedUserAtPress?: string | null
  updatedAtTemp?: string
  updatedAtPress?: string
}

export function normalizeAndMergeKeepIds(
  temps: Array<any> = [],
  presses: Array<any> = [],
): TableRow[] {
  const map = new Map<string, TableRow>()
  const keyFor = (r: any) =>
    r.time ?? r.id ?? Math.random().toString(36).slice(2)

  // 1️⃣ Adiciona todas as temperaturas
  temps.forEach((t) => {
    if (!t.time || !t.id) return
    const k = keyFor(t)
    map.set(k, {
      id: k,
      time: t.time,
      temperature:
        typeof t.temperature === 'number'
          ? t.temperature
          : (t.value ?? t.temperature),
      temperatureId: t.id ?? null,
      pressure: undefined,
      pressureId: undefined,
      updatedUserAtTemp: t.updatedUserAt ?? t.updatedUserAtTemp ?? null,
      updatedAtTemp: t.updatedAt ?? t.updatedAtTemp ?? undefined,
      updatedUserAtPress: undefined,
      updatedAtPress: undefined,
    })
  })

  // 2️⃣ Adiciona pressões, criando linha se não existir temperatura
  presses.forEach((p) => {
    if (!p.time || !p.id) return
    const k = keyFor(p)
    const existing = map.get(k)
    if (existing) {
      map.set(k, {
        ...existing,
        pressure:
          typeof p.pressure === 'number' ? p.pressure : (p.value ?? p.pressure),
        pressureId: p.id ?? null,
        updatedUserAtPress: p.updatedUserAt ?? p.updatedUserAtPress ?? null,
        updatedAtPress: p.updatedAt ?? p.updatedAtPress ?? undefined,
      })
    } else {
      // cria nova linha somente com pressão
      map.set(k, {
        id: k,
        time: p.time,
        temperature: undefined,
        temperatureId: undefined,
        updatedUserAtTemp: undefined,
        updatedAtTemp: undefined,
        pressure:
          typeof p.pressure === 'number' ? p.pressure : (p.value ?? p.pressure),
        pressureId: p.id ?? null,
        updatedUserAtPress: p.updatedUserAt ?? p.updatedUserAtPress ?? null,
        updatedAtPress: p.updatedAt ?? p.updatedAtPress ?? undefined,
      })
    }
  })

  return Array.from(map.values()).sort((a, b) => {
    if (!a.time || !b.time) return 0
    return new Date(a.time).getTime() - new Date(b.time).getTime()
  })
}
