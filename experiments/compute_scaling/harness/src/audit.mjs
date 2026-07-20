// Audit-quality evaluation (Condition B only): deterministic diff of the
// stage-4 draft vs the final graph, cross-checked against the repair
// change_log. Whether each audit finding is a REAL defect is adjudicated by
// the human rater via the generated form.
import { canonicalJson } from './hashing.mjs'

function flatten(obj, prefix = '', out = new Map()) {
  if (Array.isArray(obj)) {
    obj.forEach((v, i) => {
      const key = v && typeof v === 'object' && v.id ? `${prefix}[id=${v.id}]` : `${prefix}[${i}]`
      flatten(v, key, out)
    })
  } else if (obj && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) flatten(v, prefix ? `${prefix}.${k}` : k, out)
  } else {
    out.set(prefix, canonicalJson(obj))
  }
  return out
}

export function diffGraphs(draft, final) {
  const a = flatten(draft)
  const b = flatten(final)
  const changed = []
  for (const [k, v] of b) {
    if (!a.has(k)) changed.push({ path: k, kind: 'added' })
    else if (a.get(k) !== v) changed.push({ path: k, kind: 'modified' })
  }
  for (const k of a.keys()) if (!b.has(k)) changed.push({ path: k, kind: 'removed' })
  return changed
}

export function auditRepairMetrics({ draftGraph, finalGraph, findings, changeLog }) {
  const changes = diffGraphs(draftGraph, finalGraph)
  const loggedPaths = (changeLog || []).map((c) => String(c.path || ''))
  // A diff entry counts as logged if any change_log path mentions the changed
  // object id or path fragment; conservative string containment.
  const unlogged = changes.filter((ch) => {
    return !loggedPaths.some((lp) => lp && (ch.path.includes(lp) || lp.includes(idFragment(ch.path))))
  })
  return {
    findings_count: (findings || []).length,
    change_log_entries: (changeLog || []).length,
    diff_change_count: changes.length,
    unlogged_change_count: unlogged.length,
    unlogged_changes: unlogged.slice(0, 50),
  }
}

function idFragment(path) {
  const m = path.match(/\[id=([^\]]+)\]/)
  return m ? m[1] : path
}

export function buildAuditAdjudicationForm({ reviewId, caseId, findings }) {
  const lines = [`# Audit-finding adjudication form - review ${reviewId} (case: ${caseId})`, '']
  lines.push('For each finding: real (a genuine defect) / spurious / ambiguous, judged')
  lines.push('against the frozen packet and the draft graph. Note whether the final graph')
  lines.push('fixed it, left it, or documented it as open.', '')
  for (const f of findings || []) {
    lines.push(`## ${f.finding_id} [${f.severity}] target=${f.target_id} type=${f.type}`)
    lines.push(`   ${f.description}`)
    lines.push('   verdict: ____   resolution: fixed/unfixed/documented-open   note: ____', '')
  }
  if (!findings || findings.length === 0) lines.push('(no findings emitted by the audit stage)')
  return lines.join('\n') + '\n'
}
