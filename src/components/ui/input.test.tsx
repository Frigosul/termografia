import assert from 'node:assert/strict'
import test from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Input } from './input'

test('keeps numeric inputs in decimal text mode by default', () => {
  const html = renderToStaticMarkup(<Input type="number" />)

  assert.match(html, /type="text"/)
  assert.match(html, /inputMode="decimal"/)
})

test('renders an explicitly native numeric input without decimal text mode', () => {
  const html = renderToStaticMarkup(
    <Input type="number" nativeNumber min={-10} max={10} step={0.1} />,
  )

  assert.match(html, /type="number"/)
  assert.doesNotMatch(html, /inputMode="decimal"/)
  assert.doesNotMatch(html, /nativeNumber/)
})
