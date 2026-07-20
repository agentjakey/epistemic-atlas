import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'

// All hashing normalizes CRLF to LF so checksums match across Windows/Unix.
export function sha256Text(text) {
  return createHash('sha256').update(String(text).replace(/\r\n/g, '\n'), 'utf8').digest('hex')
}

function sortValue(v) {
  if (Array.isArray(v)) return v.map(sortValue)
  if (v && typeof v === 'object') {
    const out = {}
    for (const k of Object.keys(v).sort()) out[k] = sortValue(v[k])
    return out
  }
  return v
}

// Canonical JSON: recursively sorted keys, no whitespace variance.
export function canonicalJson(value) {
  return JSON.stringify(sortValue(value))
}

export function sha256Json(value) {
  return sha256Text(canonicalJson(value))
}

export function sha256File(filePath) {
  return sha256Text(readFileSync(filePath, 'utf8'))
}

export function shortHash(text, n = 8) {
  return sha256Text(text).slice(0, n)
}
