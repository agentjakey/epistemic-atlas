// Automatic (deterministic) part of source-grounding evaluation:
// citation-ID existence and provenance-field completeness. Whether a cited
// excerpt actually SUPPORTS the claim is a human judgment (blinded review);
// no model is the final authority for citation correctness.
//
// Harness v1.3 (2026-07-16), measurement-integrity fix. The previous version
// hardcoded the excerpt-ID shape /src_[A-Za-z0-9]+_e\d+/. The frozen LHC packet
// uses lhc_c001..lhc_c016, so ZERO of its 16 real excerpt IDs could ever match:
// passage_linked_rate would have reported 0 for every run in BOTH conditions
// across the entire primary study, silently invalidating H1. Validity is now
// decided by EXACT MEMBERSHIP in the excerpt-ID set of the frozen packet used by
// the run. No ID shape is assumed anywhere, so a packet with any future naming
// convention (including the eggs packet) works with no code change.

import { sha256Text } from './hashing.mjs'

// A citation token. Deliberately excludes brackets, whitespace, and commas so
// that "[excerpt lhc_c001]" yields exactly "lhc_c001". Charset is permissive
// enough for any plausible ID convention, but IDs are never pattern-matched --
// the token is only ever compared to the packet set by exact equality.
const TOKEN = '[A-Za-z0-9_.:+-]+'
// The ONLY citation form the frozen prompts require, verbatim from
// prompts/single-pass.md and prompts/01_extract.md:
//   "cite the supporting excerpt id(s) in the extraction_notes field using the
//    form: \"excerpt <excerpt_id>[, <excerpt_id>...]\""
// Nothing else is treated as a citation. Bare IDs appearing in prose without the
// "excerpt" keyword are NOT citations.
const EXCERPT_RE = new RegExp(`\\bexcerpts?\\s+(${TOKEN}(?:\\s*,\\s*${TOKEN})*)`, 'gi')

// Structured citation fields are preferred when present. The frozen schema's
// ExtractedClaim defines no such field, so this never fires on current output;
// it exists so that a future schema revision that adds one is honored without
// silently falling back to prose scanning.
const STRUCTURED_FIELDS = ['excerpt_ids', 'cited_excerpt_ids', 'supporting_excerpt_ids']

function stripTrailingPunctuation(token) {
  // Recovers "lhc_c004" from "excerpt lhc_c003, lhc_c004." Only ever narrows a
  // token toward an exact-membership test; it cannot turn a wrong ID into a
  // right one, because the result must still match the packet set exactly.
  return token.replace(/[.,;:]+$/, '')
}

export function citedExcerptIds(extractedClaim, excerptIdSet) {
  // 1. Structured field wins if the model (or a future schema) provides one.
  for (const f of STRUCTURED_FIELDS) {
    const v = extractedClaim[f]
    if (Array.isArray(v) && v.length > 0) {
      return { ids: v.map((x) => String(x)), source: 'structured' }
    }
  }
  // 2. Otherwise the frozen textual form, in extraction_notes. location is a
  //    structured object per the schema; scan its string values too in case a
  //    model places the citation there.
  const loc = extractedClaim.location
  const locText = loc && typeof loc === 'object'
    ? Object.values(loc).filter((v) => typeof v === 'string').join(' ')
    : (typeof loc === 'string' ? loc : '')
  const text = `${locText} ${extractedClaim.extraction_notes ?? ''}`
  const ids = []
  for (const m of text.matchAll(EXCERPT_RE)) {
    for (const rawTok of m[1].split(',')) {
      const tok = rawTok.trim()
      if (!tok) continue
      // Exact match first; only if that fails, retry once with trailing
      // sentence punctuation removed. Both paths end in exact membership.
      if (excerptIdSet && excerptIdSet.has(tok)) ids.push(tok)
      else ids.push(stripTrailingPunctuation(tok))
    }
  }
  return { ids, source: ids.length ? 'text' : 'none' }
}

export function packetExcerptIdSet(packet) {
  const set = new Set()
  for (const s of packet.sources || []) {
    for (const e of s.excerpts || []) if (e && e.excerpt_id != null) set.add(String(e.excerpt_id))
  }
  return set
}

export function packetSourceIdSet(packet) {
  const set = new Set()
  for (const s of packet.sources || []) if (s && s.source_id != null) set.add(String(s.source_id))
  return set
}

// Stable fingerprint of exactly which IDs were treated as valid for this run.
export function excerptIdSetSha256(packet) {
  return sha256Text([...packetExcerptIdSet(packet)].sort().join('\n'))
}

export function groundingMetrics(graph, packet, opts = {}) {
  const excerptIds = packetExcerptIdSet(packet)
  const sourceIds = packetSourceIdSet(packet)
  const claims = graph.extracted_claims || []

  let linked = 0
  let provenanceComplete = 0
  let claimsWithNoCitation = 0
  let validCitationCount = 0
  const invalidCitations = []
  const citationsByClaim = []

  for (const ec of claims) {
    const { ids: cited, source: citationSource } = citedExcerptIds(ec, excerptIds)
    // Exact membership. A source_id is NOT an excerpt_id: the real packet has
    // source_id "src_001" and excerpt_id "lhc_c001", so citing "excerpt src_001"
    // is invalid and is flagged as such. Exact Set membership on whole tokens
    // also makes prefix/substring collisions impossible ("lhc_c001" never
    // matches "lhc_c0012", and vice versa).
    const valid = cited.filter((id) => excerptIds.has(id))
    const invalid = cited.filter((id) => !excerptIds.has(id))

    if (cited.length === 0) claimsWithNoCitation += 1
    if (valid.length > 0) linked += 1
    validCitationCount += valid.length

    for (const id of invalid) {
      invalidCitations.push({
        claim_id: ec.id,
        cited: id,
        // Diagnostic only; classification is unaffected.
        reason: sourceIds.has(id) ? 'source_id_cited_as_excerpt_id' : 'not_in_packet',
      })
    }
    citationsByClaim.push({
      claim_id: ec.id,
      citation_source: citationSource,
      cited_ids: cited,
      valid_ids: valid,
      invalid_ids: invalid,
    })
    if (ec.source_id && ec.location) provenanceComplete += 1
  }

  return {
    extracted_claims: claims.length,
    // Frozen numerator and denominator, unchanged from v1.1: claims with at
    // least one VALID packet citation, over all extracted claims.
    passage_linked_claims: linked,
    passage_linked_rate: claims.length ? linked / claims.length : null,
    valid_citation_count: validCitationCount,
    invalid_citation_count: invalidCitations.length,
    invalid_citations: invalidCitations,
    // Distinct from "invalid": the claim cited nothing at all.
    claims_with_absent_citations: claimsWithNoCitation,
    citations_by_claim: citationsByClaim,
    provenance_complete_rate: claims.length ? provenanceComplete / claims.length : null,
    packet_excerpt_id_count: excerptIds.size,
    packet_sha256: opts.packetSha256 ?? null,
    excerpt_id_set_sha256: excerptIdSetSha256(packet),
  }
}

export function relationBasisCompleteness(graph) {
  const rels = graph.relations || []
  const dist = {}
  for (const r of rels) dist[r.basis ?? '(missing)'] = (dist[r.basis ?? '(missing)'] || 0) + 1
  return {
    relations: rels.length,
    basis_distribution: dist,
    basis_missing: dist['(missing)'] || 0,
    basis_unclear: dist['unclear'] || 0,
  }
}

export function sourceUtilization(graph, packet) {
  const packetSources = new Set((packet.sources || []).map((s) => s.source_id))
  const used = new Set((graph.extracted_claims || []).map((c) => c.source_id))
  let usedCount = 0
  for (const s of packetSources) if (used.has(s)) usedCount += 1
  return {
    packet_sources: packetSources.size,
    utilized_sources: usedCount,
    utilization_rate: packetSources.size ? usedCount / packetSources.size : null,
  }
}
