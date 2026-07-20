import Ajv2020 from 'ajv/dist/2020.js'
import addFormats from 'ajv-formats'

// AJV validator over the repo's real JSON Schema Draft 2020-12 document.
export function makeValidator(schema) {
  const ajv = new Ajv2020.default({ allErrors: true, strict: false })
  addFormats.default(ajv)
  return ajv.compile(schema)
}

// Harness v1.3 (2026-07-16). Parse modes, recorded per call:
//   strict_json                  - the raw response parsed as JSON directly
//   single_json_fence_fallback   - the raw response was exactly one Markdown
//                                  fenced block whose contents parsed as JSON
//
// Strict JSON.parse is always attempted first. The fallback exists only because
// claude-sonnet-5 wraps its JSON in a Markdown fence (observed on every
// SMK-LHC-A-R2 call, both complete and schema-valid). It is deliberately narrow:
// it accepts ONLY a response whose entire trimmed body is a single fenced block.
// It never extracts an object out of surrounding prose, never repairs malformed
// JSON, never concatenates multiple fences, and never mutates the raw response.
// Anything outside that exact shape stays a parse failure.
const SINGLE_FENCE_RE = /^```([A-Za-z0-9_+-]*)[ \t]*\r?\n([\s\S]*?)\r?\n```$/

export const PARSE_MODE_STRICT = 'strict_json'
export const PARSE_MODE_FENCE = 'single_json_fence_fallback'

export function tryParseJson(text) {
  const raw = typeof text === 'string' ? text : String(text ?? '')
  let strictError
  try {
    return { ok: true, value: JSON.parse(raw), parseMode: PARSE_MODE_STRICT }
  } catch (err) {
    strictError = String(err.message || err)
  }

  // Fallback path. Whitespace may surround the fence; nothing else may.
  const trimmed = raw.trim()
  const m = SINGLE_FENCE_RE.exec(trimmed)
  if (!m) {
    return { ok: false, error: strictError, parseMode: null }
  }
  const tag = m[1]
  if (tag !== '' && tag.toLowerCase() !== 'json') {
    return { ok: false, error: `${strictError} (fenced block has non-JSON language tag "${tag}")`, parseMode: null }
  }
  const inner = m[2]
  // A lazy match plus the end anchor can span two fences; the inner body of a
  // single legitimate block never contains a fence delimiter. This is what
  // rejects multi-fence responses.
  if (inner.includes('```')) {
    return { ok: false, error: `${strictError} (response contains multiple fenced blocks)`, parseMode: null }
  }
  try {
    return { ok: true, value: JSON.parse(inner), parseMode: PARSE_MODE_FENCE }
  } catch (err) {
    // The fence was well-formed but its contents are not JSON. No repair.
    return { ok: false, error: String(err.message || err), parseMode: null }
  }
}

export function validateGraph(graph, validate) {
  const valid = validate(graph)
  return {
    schemaValid: !!valid,
    errors: valid ? [] : (validate.errors || []).map((e) => `${e.instancePath || '/'} ${e.message}`),
  }
}

function findDuplicates(ids) {
  const seen = new Set()
  const dup = new Set()
  for (const id of ids) {
    if (seen.has(id)) dup.add(id)
    seen.add(id)
  }
  return [...dup]
}

// Referential integrity for a combined v3 Case object (same relations checked in
// the 2026-07-13 repository audit, adapted from split files to the Case root).
export function integrityCheck(graph) {
  const S = graph.sources || []
  const EC = graph.extracted_claims || []
  const NC = graph.normalized_claims || []
  const R = graph.relations || []
  const al = graph.assessment_layer || {}
  const CX = al.cruxes || []
  const FF = al.failure_mode_flags || []
  const ME = al.missing_evidence || []
  const AS = al.assessments || []
  const RV = al.reviews || []
  const AN = al.audit_notes || []

  const srcIds = new Set(S.map((x) => x.id))
  const ecIds = new Set(EC.map((x) => x.id))
  const ncIds = new Set(NC.map((x) => x.id))
  const relIds = new Set(R.map((x) => x.id))
  const cxIds = new Set(CX.map((x) => x.id))
  const ffIds = new Set(FF.map((x) => x.id))
  const meIds = new Set(ME.map((x) => x.id))
  const asIds = new Set(AS.map((x) => x.id))
  const rvIds = new Set(RV.map((x) => x.id))
  const anIds = new Set(AN.map((x) => x.id))
  // Harness/evaluator v1.5 (2026-07-17): anyId's valid-ID universe now covers
  // EVERY object family a reference may legitimately target -- derived from the
  // graph's own families, not a hardcoded subset. Before v1.5 it omitted the
  // missing-evidence, assessment, review, and audit-note ID sets, so a valid
  // cross-family reference (e.g. an audit note pointing at an assessment or a
  // missing-evidence item) was OVER-reported as dangling. This corrects an
  // over-reporting false positive found during B-R4 smoke validation; it does
  // not special-case any specific ID. See experiments/compute_scaling/
  // HARNESS_V1_5_FIX_NOTE.md.
  const idFamilies = [srcIds, ecIds, ncIds, relIds, cxIds, ffIds, meIds, asIds, rvIds, anIds]
  const anyId = (id) => idFamilies.some((set) => set.has(id))

  const dangling = []
  const push = (msg) => dangling.push(msg)

  for (const c of EC) {
    if (!srcIds.has(c.source_id)) push(`EC ${c.id}: dangling source_id ${c.source_id}`)
  }
  for (const n of NC) {
    const ecs = n.extracted_claim_ids || []
    if (ecs.length === 0) push(`NC ${n.id}: empty extracted_claim_ids (no provenance)`)
    for (const e of ecs) if (!ecIds.has(e)) push(`NC ${n.id}: dangling extracted_claim_id ${e}`)
    for (const f of n.failure_mode_flag_ids || []) if (!ffIds.has(f)) push(`NC ${n.id}: dangling failure_mode_flag_id ${f}`)
  }
  for (const r of R) {
    if (!ncIds.has(r.from_id)) push(`REL ${r.id}: dangling from_id ${r.from_id}`)
    if (!ncIds.has(r.to_id)) push(`REL ${r.id}: dangling to_id ${r.to_id}`)
  }
  for (const cx of CX) {
    for (const n of cx.dependent_normalized_claim_ids || []) if (!ncIds.has(n)) push(`CX ${cx.id}: dangling dependent claim ${n}`)
    for (const s of cx.resolution_source_ids || []) if (!srcIds.has(s)) push(`CX ${cx.id}: dangling resolution source ${s}`)
  }
  for (const f of FF) {
    if (f.applies_to_id && !anyId(f.applies_to_id)) push(`FF ${f.id}: dangling applies_to_id ${f.applies_to_id}`)
  }
  for (const a of AS) {
    for (const k of a.key_crux_ids || []) if (!cxIds.has(k)) push(`AS ${a.id}: dangling key_crux_id ${k}`)
    for (const w of a.weak_link_ids || []) if (!ncIds.has(w)) push(`AS ${a.id}: dangling weak_link_id ${w}`)
    for (const w of a.well_supported_claim_ids || []) if (!ncIds.has(w)) push(`AS ${a.id}: dangling well_supported id ${w}`)
    for (const w of a.contested_claim_ids || []) if (!ncIds.has(w)) push(`AS ${a.id}: dangling contested id ${w}`)
  }
  for (const m of ME) {
    for (const w of m.would_affect_ids || []) if (!anyId(w)) push(`ME ${m.id}: dangling would_affect id ${w}`)
  }
  for (const an of AN) {
    for (const w of an.applies_to_ids || []) if (!anyId(w) && w !== 'ALL') push(`AN ${an.id}: dangling applies_to id ${w}`)
  }

  const allIds = [...S, ...EC, ...NC, ...R, ...CX, ...FF, ...ME, ...AS, ...RV, ...AN].map((o) => o.id)
  const duplicateIds = findDuplicates(allIds)

  return {
    duplicateIds,
    danglingRefs: dangling,
    counts: {
      sources: S.length,
      extracted_claims: EC.length,
      normalized_claims: NC.length,
      relations: R.length,
      cruxes: CX.length,
      failure_mode_flags: FF.length,
      missing_evidence: ME.length,
      assessments: AS.length,
      reviews: RV.length,
      audit_notes: AN.length,
    },
  }
}
