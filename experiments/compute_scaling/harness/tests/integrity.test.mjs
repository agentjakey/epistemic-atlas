import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { integrityCheck } from '../src/validate.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const PKG = path.resolve(here, '..', '..')
const ex = (name) => JSON.parse(readFileSync(path.join(PKG, 'examples', name), 'utf8'))

// Harness/evaluator v1.5: anyId's valid-ID universe covers every referenceable
// object family, derived from the graph. Pins the over-reporting fix.

const crossFamily = () => ({
  sources: [{ id: 'src_001' }],
  extracted_claims: [{ id: 'EC_001', source_id: 'src_001' }],
  normalized_claims: [{ id: 'NC_001', extracted_claim_ids: ['EC_001'] }],
  relations: [],
  assessment_layer: {
    cruxes: [],
    failure_mode_flags: [{ id: 'FF_001', applies_to_id: 'NC_001' }],
    missing_evidence: [{ id: 'ME_001' }, { id: 'ME_005' }],
    assessments: [{ id: 'AS_001' }],
    reviews: [{ id: 'RV_001' }],
    audit_notes: [
      { id: 'AN_001', applies_to_ids: ['AS_001'] },
      { id: 'AN_002', applies_to_ids: ['ME_005'] },
      { id: 'AN_003', applies_to_ids: ['RV_001'] },
    ],
  },
})

test('v1.5: cross-family references (assessment, missing-evidence, review) resolve', () => {
  const r = integrityCheck(crossFamily())
  assert.equal(r.danglingRefs.length, 0, r.danglingRefs.join(' | '))
})

test('v1.5: a genuinely missing ID is still flagged', () => {
  const g = crossFamily()
  g.assessment_layer.audit_notes.push({ id: 'AN_004', applies_to_ids: ['NOPE_999'] })
  assert.ok(integrityCheck(g).danglingRefs.some((d) => d.includes('NOPE_999')))
})

test('v1.5: duplicate IDs remain visible', () => {
  const g = crossFamily()
  g.assessment_layer.missing_evidence.push({ id: 'ME_005' })
  assert.ok(integrityCheck(g).duplicateIds.includes('ME_005'))
})

test('the published B-R4 exemplar has zero dangling refs and zero duplicates', () => {
  const r = integrityCheck(ex('B-R4_multipass_final_graph.smoke-exemplar.json'))
  assert.equal(r.danglingRefs.length, 0, r.danglingRefs.join(' | '))
  assert.equal(r.duplicateIds.length, 0)
})

test('the published A-R2 exemplar has zero dangling refs and zero duplicates', () => {
  const r = integrityCheck(ex('A-R2_single-pass_final_graph.smoke-exemplar.json'))
  assert.equal(r.danglingRefs.length, 0, r.danglingRefs.join(' | '))
  assert.equal(r.duplicateIds.length, 0)
})
