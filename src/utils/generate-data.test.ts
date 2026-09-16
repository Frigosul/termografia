import assert from 'node:assert/strict'
import test from 'node:test'
import { generateSimulatedData } from './generate-data'

test('uses the supplied final value in the last generated reading', () => {
  const data = generateSimulatedData({
    startDate: '2025-01-01T00:00:00',
    endDate: '2025-01-01T00:02:00',
    defrostDate: '2025-01-01T01:00:00',
    instrumentType: 'TEMPERATURE',
    initialValue: 15,
    averageValue: 8,
    finalValue: 4.2,
    generateMode: 'n1',
  })

  assert.equal(data.at(-1)?.value, 4.2)
})
