import assert from 'node:assert/strict'
import test from 'node:test'
import { gaugePercent } from './gauge-percent'

test('calcula o percentual do valor dentro da faixa', () => {
  assert.equal(gaugePercent(0, -100, 100), 50)
})

test('limita o percentual entre 0 e 100', () => {
  assert.equal(gaugePercent(150, -100, 100), 100)
  assert.equal(gaugePercent(-150, -100, 100), 0)
})

test('retorna null quando mínimo ou máximo não chegam', () => {
  assert.equal(gaugePercent(23.7, undefined, undefined), null)
  assert.equal(gaugePercent(23.7, null, 100), null)
})

test('retorna null quando a faixa é vazia ou o valor é inválido', () => {
  assert.equal(gaugePercent(10, 50, 50), null)
  assert.equal(gaugePercent(null, -100, 100), null)
})
