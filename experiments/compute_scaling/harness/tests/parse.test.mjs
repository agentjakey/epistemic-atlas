import test from 'node:test'
import assert from 'node:assert/strict'
import { tryParseJson, PARSE_MODE_STRICT, PARSE_MODE_FENCE } from '../src/validate.mjs'

// The v1.3 parser: strict JSON.parse first; a narrow fallback ONLY when the
// entire trimmed response is exactly one Markdown fenced block. Self-contained.

test('bare JSON parses strictly', () => {
  const r = tryParseJson('{"a":1}')
  assert.equal(r.ok, true)
  assert.equal(r.parseMode, PARSE_MODE_STRICT)
})

test('fenced JSON (json tag) uses the fence fallback', () => {
  const r = tryParseJson('```json\n{"a":1}\n```')
  assert.equal(r.ok, true)
  assert.equal(r.parseMode, PARSE_MODE_FENCE)
  assert.deepEqual(r.value, { a: 1 })
})

test('uppercase JSON tag accepted; unlabeled fence accepted', () => {
  assert.equal(tryParseJson('```JSON\n{"a":1}\n```').parseMode, PARSE_MODE_FENCE)
  assert.equal(tryParseJson('```\n{"a":1}\n```').parseMode, PARSE_MODE_FENCE)
})

test('non-JSON tag, prose around fence, and multiple fences are rejected', () => {
  assert.equal(tryParseJson('```python\n{"a":1}\n```').ok, false)
  assert.equal(tryParseJson('Here:\n```json\n{"a":1}\n```').ok, false)
  assert.equal(tryParseJson('```json\n{"a":1}\n```\ndone').ok, false)
  assert.equal(tryParseJson('```json\n{"a":1}\n```\n```json\n{"b":2}\n```').ok, false)
})

test('truncated JSON (with or without a fence) is never rescued', () => {
  assert.equal(tryParseJson('```json\n{"a":1,"b":[').ok, false) // no closing fence
  assert.equal(tryParseJson('```json\n{"a":1,,}\n```').ok, false) // malformed inside a fence
  assert.equal(tryParseJson('{"a":1,"b":[{"c":2},').ok, false) // bare truncated
})

test('the parser never mutates the raw response', () => {
  const raw = '```json\n{"a":1}\n```'
  const copy = String(raw)
  tryParseJson(raw)
  assert.equal(raw, copy)
})
