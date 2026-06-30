// Zero-dependency structural check for Epistemic Atlas v3 data.
// This is a lightweight shape check, not full JSON Schema validation.
// Full AJV-based validation against schema/epistemic-atlas.schema.json is future work.
//
// Run: node scripts/check_data.mjs

import { readFileSync } from 'node:fs'

const RELATION_FAMILIES = ['supports', 'opposes', 'depends_on', 'contextualizes', 'equivalent']
const RELATION_BASIS = [
  'asserted_in_source',
  'asserted_by_later_source',
  'inferred_across_sources',
  'analyst_inferred',
  'unclear',
]
const ASSESSMENT_LAYER_KEYS = [
  'cruxes',
  'failure_mode_flags',
  'missing_evidence',
  'assessments',
  'reviews',
  'audit_notes',
]

const problems = []

function fail(file, msg) {
  problems.push(`${file}: ${msg}`)
}

function checkGraph(file) {
  const g = JSON.parse(readFileSync(file, 'utf8'))
  if (!g._meta || g._meta.schema_version !== '3') fail(file, '_meta.schema_version is not "3"')

  const rels = g.relations || []
  if (!Array.isArray(rels)) fail(file, 'relations is not an array')
  for (const r of rels) {
    if (r.type !== undefined) fail(file, `${r.id}: legacy "type" field present`)
    if (!RELATION_FAMILIES.includes(r.family)) fail(file, `${r.id}: invalid or missing family`)
    if (!RELATION_BASIS.includes(r.basis)) fail(file, `${r.id}: invalid or missing basis`)
  }

  const al = g.assessment_layer
  if (!al || typeof al !== 'object') {
    fail(file, 'assessment_layer missing')
    return
  }
  for (const k of ASSESSMENT_LAYER_KEYS) {
    if (!Array.isArray(al[k])) fail(file, `assessment_layer.${k} is not an array`)
  }
  for (const k of ['cruxes', 'failure_mode_flags', 'missing_evidence', 'assessments', 'reviews', 'audit_notes']) {
    if (g[k] !== undefined) fail(file, `interpretive key "${k}" leaked to root`)
  }
}

function checkMetaVersion(file) {
  const d = JSON.parse(readFileSync(file, 'utf8'))
  if (!d._meta || d._meta.schema_version !== '3') fail(file, '_meta.schema_version is not "3"')
}

function checkExample(file) {
  const c = JSON.parse(readFileSync(file, 'utf8'))
  if (c.schema_version !== '3') fail(file, 'schema_version is not "3"')
  for (const r of c.relations || []) {
    if (r.type !== undefined) fail(file, `${r.id}: legacy "type" field present`)
    if (!RELATION_FAMILIES.includes(r.family)) fail(file, `${r.id}: invalid or missing family`)
    if (!RELATION_BASIS.includes(r.basis)) fail(file, `${r.id}: invalid or missing basis`)
  }
  if (!c.assessment_layer) fail(file, 'assessment_layer missing')
}

for (const f of ['data/lhc/graph.json', 'data/eggs/graph.json']) checkGraph(f)
for (const f of [
  'data/lhc/claims.json',
  'data/lhc/sources.json',
  'data/eggs/claims.json',
  'data/eggs/sources.json',
]) {
  checkMetaVersion(f)
}
for (const f of ['schema/examples/lhc_black_holes.json', 'schema/examples/eggs.json']) checkExample(f)

if (problems.length > 0) {
  console.error('Structural check FAILED:')
  for (const p of problems) console.error('  - ' + p)
  process.exit(1)
}
console.log('Structural check passed: all data and example files conform to the v3 shape.')
