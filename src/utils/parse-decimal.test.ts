import assert from 'node:assert/strict'
import test from 'node:test'
import { parseDecimal } from './parse-decimal'

test('converte vírgula decimal em número real', () => {
  assert.equal(parseDecimal('3,5'), 3.5)
})

test('mantém números com ponto decimal', () => {
  assert.equal(parseDecimal('3.5'), 3.5)
})

test('mantém campo vazio como NaN', () => {
  assert.ok(Number.isNaN(parseDecimal('')))
})
