import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { groundingMetrics, packetExcerptIdSet, sourceUtilization } from '../src/grounding.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const PKG = path.resolve(here, '..', '..')
const packet = JSON.parse(readFileSync(path.join(PKG, 'source_packet', 'packet.json'), 'utf8'))
const ex = (name) => JSON.parse(readFileSync(path.join(PKG, 'examples', name), 'utf8'))
const graphCiting = (notes) => ({
  extracted_claims: [{ id: 'EC_001', source_id: 'src_001', location: { page: '1' }, extraction_notes: notes }],
})

// Packet-driven grounding (v1.3): validity is exact membership in the frozen
// packet's excerpt-ID set. No ID shape is assumed.

test('the frozen LHC packet exposes 16 excerpt IDs (lhc_c001..lhc_c016)', () => {
  const ids = packetExcerptIdSet(packet)
  assert.equal(ids.size, 16)
  assert.ok(ids.has('lhc_c001') && ids.has('lhc_c016'))
  assert.ok(!ids.has('src_001')) // a source_id is not an excerpt_id
})

test('a real packet excerpt ID is recognized; a nonexistent one is invalid', () => {
  assert.equal(groundingMetrics(graphCiting('excerpt lhc_c001'), packet).passage_linked_rate, 1)
  const bad = groundingMetrics(graphCiting('excerpt lhc_c999'), packet)
  assert.equal(bad.passage_linked_rate, 0)
  assert.equal(bad.invalid_citation_count, 1)
})

test('an explicit unknown citation cannot silently produce valid=0 AND invalid=0', () => {
  const g = groundingMetrics(graphCiting('excerpt totally_unknown'), packet)
  assert.equal(g.valid_citation_count, 0)
  assert.equal(g.invalid_citation_count, 1)
})

test('alternate ID conventions work with no code change', () => {
  const p = { sources: [{ source_id: 's1', excerpts: [{ excerpt_id: 'E-42' }] }] }
  assert.equal(groundingMetrics(graphCiting('excerpt E-42'), p).passage_linked_rate, 1)
})

test('published B-R4 exemplar: 46/46 claims grounded, 6/6 sources used', () => {
  const g = ex('B-R4_multipass_final_graph.smoke-exemplar.json')
  const gm = groundingMetrics(g, packet)
  assert.equal(gm.passage_linked_rate, 1)
  assert.equal(gm.invalid_citation_count, 0)
  assert.equal(sourceUtilization(g, packet).utilization_rate, 1)
})

test('published A-R2 exemplar: 16/16 claims grounded', () => {
  const gm = groundingMetrics(ex('A-R2_single-pass_final_graph.smoke-exemplar.json'), packet)
  assert.equal(gm.passage_linked_rate, 1)
  assert.equal(gm.invalid_citation_count, 0)
})
