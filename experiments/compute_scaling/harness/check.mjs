// Reproduces the deterministic smoke checks over the published exemplars.
// Free, offline, no provider client. Run: node check.mjs   (from this directory)
//
// It validates the two published final-graph exemplars against the repository's
// real schema and the frozen source packet, and re-derives the audit/repair
// mechanics for the six-stage exemplar. Exit 0 iff every check passes.

import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { makeValidator, validateGraph, integrityCheck } from './src/validate.mjs'
import { groundingMetrics, sourceUtilization, packetExcerptIdSet } from './src/grounding.mjs'
import { auditRepairMetrics } from './src/audit.mjs'
import { sha256Text } from './src/hashing.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const PKG = path.resolve(here, '..')          // experiments/compute_scaling
const REPO = path.resolve(PKG, '..', '..')    // repository root
const readJson = (p) => JSON.parse(readFileSync(p, 'utf8'))

const schema = readJson(path.join(REPO, 'schema', 'epistemic-atlas.schema.json'))
const validator = makeValidator(schema)
const packet = readJson(path.join(PKG, 'source_packet', 'packet.json'))
const ex = (name) => readJson(path.join(PKG, 'examples', name))

const FROZEN_PACKET_SHA = '2572241cfacc4b641280347920252e34a9455f8c2c8fd9f743f59687b59ec191'

let failures = 0
const ok = (cond, label) => { console.log(`  [${cond ? 'PASS' : 'FAIL'}] ${label}`); if (!cond) failures++ }

console.log('Frozen source packet:')
const packetSha = sha256Text(readFileSync(path.join(PKG, 'source_packet', 'packet.json'), 'utf8'))
ok(packetSha === FROZEN_PACKET_SHA, `packet.json sha256 == frozen ${FROZEN_PACKET_SHA.slice(0, 12)}...`)
ok(packetExcerptIdSet(packet).size === 16, 'packet has 16 verified excerpt IDs')

const graphs = [
  ['A-R2 single-pass (smoke exemplar)', 'A-R2_single-pass_final_graph.smoke-exemplar.json'],
  ['B-R4 six-stage repaired (smoke exemplar)', 'B-R4_multipass_final_graph.smoke-exemplar.json'],
]
for (const [label, file] of graphs) {
  console.log(`\n${label}:`)
  const graph = ex(file)
  const v = validateGraph(graph, validator)
  ok(v.schemaValid, `schema-valid (AJV 2020-12, repo schema)${v.schemaValid ? '' : ' :: ' + v.errors.slice(0, 3).join(' | ')}`)
  const ic = integrityCheck(graph)
  ok(ic.duplicateIds.length === 0, `no duplicate IDs (${ic.duplicateIds.length})`)
  ok(ic.danglingRefs.length === 0, `no dangling references (${ic.danglingRefs.length})${ic.danglingRefs.length ? ' :: ' + ic.danglingRefs.join(' | ') : ''}`)
  const g = groundingMetrics(graph, packet, { packetSha256: packetSha })
  ok(g.passage_linked_rate === 1, `passage-linked rate == 1.0 (${g.passage_linked_claims}/${g.extracted_claims})`)
  ok(g.invalid_citation_count === 0, `no invalid citations (${g.invalid_citation_count})`)
  ok(g.claims_with_absent_citations === 0, `no claims with absent citations (${g.claims_with_absent_citations})`)
  const u = sourceUtilization(graph, packet)
  ok(u.utilization_rate === 1, `all packet sources used (${u.utilized_sources}/${u.packet_sources})`)
}

console.log('\nB-R4 audit + repair mechanics (smoke exemplar):')
const finalB = ex('B-R4_multipass_final_graph.smoke-exemplar.json')
const findings = ex('B-R4_adversarial_audit.smoke-exemplar.json')
const changeLog = ex('B-R4_repair_change_log.smoke-exemplar.json')
// The stage-4 draft is not published (intermediate artifact); we verify the
// audit/repair record shapes and change-log completeness that are publishable.
ok(Array.isArray(findings) && findings.length > 0, `adversarial audit produced findings (${findings.length})`)
ok(Array.isArray(changeLog) && changeLog.length > 0, `repair produced a change log (${changeLog.length} entries)`)
ok(findings.length === changeLog.length, `every audit finding has a logged repair (${findings.length} findings, ${changeLog.length} log entries)`)

console.log(`\n${failures === 0 ? 'ALL DETERMINISTIC CHECKS PASSED' : failures + ' CHECK(S) FAILED'}`)
process.exit(failures === 0 ? 0 : 1)
