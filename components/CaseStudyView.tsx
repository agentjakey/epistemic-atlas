'use client'

import { useState, useMemo } from 'react'
import type {
  Source,
  ExtractedClaim,
  NormalizedClaim,
  Relation,
  Crux,
  FailureModeFlag,
  Assessment,
  MissingEvidence,
  CaseStatus,
  DataStatus,
  RelationType,
  CruxStatus,
} from '@/lib/types_v2'

// ---- badge helpers ----

function ConfBadge({ level }: { level: string }) {
  const cls: Record<string, string> = {
    high: 'badge badge-conf-high',
    medium: 'badge badge-conf-medium',
    low: 'badge badge-conf-low',
    speculative: 'badge badge-conf-speculative',
  }
  return <span className={cls[level] ?? 'badge badge-conf-speculative'}>{level}</span>
}

function PosBadge({ pos }: { pos: string }) {
  const cls: Record<string, string> = {
    pro: 'badge badge-pos-pro',
    con: 'badge badge-pos-con',
    neutral: 'badge badge-pos-neutral',
    conditional: 'badge badge-pos-conditional',
    methodological: 'badge badge-pos-methodological',
  }
  return <span className={cls[pos] ?? 'badge badge-pos-neutral'}>{pos}</span>
}

function CruxBadge({ status }: { status: CruxStatus }) {
  const cls: Record<string, string> = {
    unresolved: 'badge badge-status-open',
    resolved_true: 'badge badge-status-resolved',
    resolved_false: 'badge badge-status-resolved',
    empirically_underdetermined: 'badge badge-status-underdetermined',
    theoretically_underdetermined: 'badge badge-status-underdetermined',
  }
  const label: Record<string, string> = {
    unresolved: 'unresolved',
    resolved_true: 'resolved: true',
    resolved_false: 'resolved: false',
    empirically_underdetermined: 'empirically underdetermined',
    theoretically_underdetermined: 'theoretically underdetermined',
  }
  return <span className={cls[status] ?? 'badge badge-status-underdetermined'}>{label[status] ?? status}</span>
}

function RelTypeBadge({ type }: { type: RelationType }) {
  const positive: RelationType[] = ['supports', 'evidence_for', 'generalizes']
  const negative: RelationType[] = ['attacks', 'evidence_against', 'conflicts_with']
  let cls = 'badge badge-pos-methodological'
  if (positive.includes(type)) cls = 'badge badge-pos-con'
  if (negative.includes(type)) cls = 'badge badge-pos-pro'
  return <span className={cls}>{type.replace(/_/g, ' ')}</span>
}

function SevBadge({ severity }: { severity: string }) {
  const cls: Record<string, string> = {
    critical: 'badge badge-pos-pro',
    significant: 'badge badge-conf-medium',
    minor: 'badge badge-status-underdetermined',
  }
  return <span className={cls[severity] ?? 'badge badge-status-underdetermined'}>{severity}</span>
}

function authorStr(author: string | string[] | null | undefined): string {
  if (!author) return 'Unknown'
  if (Array.isArray(author)) {
    if (author.length > 3) return `${author[0]} et al.`
    return author.join(', ')
  }
  return author
}

// ---- claim detail panel ----

function ClaimDetail({
  claim,
  extractedClaims,
  sourceMap,
  normalizedClaimMap,
  relationsFrom,
  relationsTo,
  flags,
  cruxes,
  updateScenarios,
  onSelectClaim,
}: {
  claim: NormalizedClaim
  extractedClaims: ExtractedClaim[]
  sourceMap: Record<string, Source>
  normalizedClaimMap: Record<string, NormalizedClaim>
  relationsFrom: Relation[]
  relationsTo: Relation[]
  flags: FailureModeFlag[]
  cruxes: Crux[]
  updateScenarios: Assessment['what_would_update']
  onSelectClaim: (id: string) => void
}) {
  const inbound = relationsTo.filter((r) => r.to_id === claim.id)
  const outbound = relationsFrom.filter((r) => r.from_id === claim.id)

  const relatedECs = claim.extracted_claim_ids
    .map((id) => extractedClaims.find((ec) => ec.id === id))
    .filter(Boolean) as ExtractedClaim[]

  const directionLabel = (dir: string) =>
    dir === 'strengthen' ? 'would strengthen' :
    dir === 'weaken' ? 'would weaken' : 'would resolve'

  const magnitudeLabel = (m: string) =>
    m === 'decisive' ? 'decisively' :
    m === 'significant' ? 'significantly' : 'marginally'

  return (
    <div className="bg-page-off border-x border-b border-page-border px-6 py-6 space-y-7">
      {/* normalized text + metadata */}
      <div>
        <div className="flex flex-wrap gap-1.5 mb-3">
          <PosBadge pos={claim.position} />
          <ConfBadge level={claim.confidence.level} />
          <span className="badge badge-pos-methodological">{claim.domain_type}</span>
          {(claim.needs_source_verification) && (
            <span className="badge badge-data-partial">needs verification</span>
          )}
        </div>
        <p className="text-sm text-ink leading-relaxed">{claim.normalized_text}</p>
        {claim.scope && (
          <p className="text-xs text-ink-faint mt-2 leading-relaxed">
            <span className="font-medium">Scope:</span> {claim.scope}
          </p>
        )}
        {claim.quantification && (
          <p className="text-xs text-ink-faint mt-1 leading-relaxed">
            <span className="font-medium">Quantification:</span> {claim.quantification}
          </p>
        )}
        {claim.hedges && claim.hedges.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            <span className="text-xs text-ink-faint font-medium mr-1">Hedges:</span>
            {claim.hedges.map((h) => (
              <span key={h} className="text-xs text-ink-faint italic">{h}</span>
            ))}
          </div>
        )}
        {claim.confidence.notes && (
          <p className="text-xs text-ink-faint mt-2 pt-2 border-t border-page-border leading-relaxed italic">
            {claim.confidence.notes}
          </p>
        )}
      </div>

      {/* provenance */}
      <div>
        <p className="text-xs section-heading mb-2">Provenance</p>
        <div className="space-y-2">
          {relatedECs.map((ec) => {
            const src = sourceMap[ec.source_id]
            return (
              <div key={ec.id} className="border border-page-border bg-white p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-ink-faint">{ec.id}</span>
                  <span className="text-xs text-ink-faint">from</span>
                  <span className="text-xs font-mono text-accent">{ec.source_id}</span>
                  {src && (
                    <span className="text-xs text-ink-faint truncate max-w-xs">
                      {src.title.length > 55 ? src.title.slice(0, 55) + '...' : src.title}
                    </span>
                  )}
                  {ec.needs_source_verification && (
                    <span className="badge badge-data-partial">paraphrase</span>
                  )}
                </div>
                <p className="text-xs text-ink-light leading-relaxed">{ec.raw_text}</p>
                {ec.extraction_notes && (
                  <p className="text-xs text-ink-faint mt-1 italic">{ec.extraction_notes}</p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* inbound relations */}
      {inbound.length > 0 && (
        <div>
          <p className="text-xs section-heading mb-2">Incoming relations</p>
          <div className="space-y-2">
            {inbound.map((r) => {
              const other = normalizedClaimMap[r.from_id]
              return (
                <div key={r.id} className="border border-page-border bg-white p-3">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <button
                      onClick={() => onSelectClaim(r.from_id)}
                      className="text-xs font-mono text-accent hover:underline"
                    >
                      {r.from_id}
                    </button>
                    <RelTypeBadge type={r.type} />
                    <span className="badge badge-status-underdetermined">{r.strength}</span>
                    <span className="text-xs text-ink-faint">this claim</span>
                  </div>
                  {other && (
                    <p className="text-xs text-ink-faint leading-relaxed">
                      {other.normalized_text.length > 120
                        ? other.normalized_text.slice(0, 120) + '...'
                        : other.normalized_text}
                    </p>
                  )}
                  {r.notes && (
                    <p className="text-xs text-ink-faint mt-1 italic leading-relaxed">{r.notes}</p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* outbound relations */}
      {outbound.length > 0 && (
        <div>
          <p className="text-xs section-heading mb-2">Outgoing relations</p>
          <div className="space-y-2">
            {outbound.map((r) => {
              const other = normalizedClaimMap[r.to_id]
              return (
                <div key={r.id} className="border border-page-border bg-white p-3">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs text-ink-faint">this claim</span>
                    <RelTypeBadge type={r.type} />
                    <button
                      onClick={() => onSelectClaim(r.to_id)}
                      className="text-xs font-mono text-accent hover:underline"
                    >
                      {r.to_id}
                    </button>
                    <span className="badge badge-status-underdetermined">{r.strength}</span>
                  </div>
                  {other && (
                    <p className="text-xs text-ink-faint leading-relaxed">
                      {other.normalized_text.length > 120
                        ? other.normalized_text.slice(0, 120) + '...'
                        : other.normalized_text}
                    </p>
                  )}
                  {r.notes && (
                    <p className="text-xs text-ink-faint mt-1 italic leading-relaxed">{r.notes}</p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* failure mode flags */}
      {flags.length > 0 && (
        <div>
          <p className="text-xs section-heading mb-2">Failure mode flags</p>
          <div className="space-y-2">
            {flags.map((f) => (
              <div key={f.id} className="border border-orange-100 bg-orange-50 p-3">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-mono text-ink-faint">{f.id}</span>
                  <span className="badge badge-flag">{f.type.replace(/_/g, ' ')}</span>
                  <SevBadge severity={f.severity} />
                  {f.affects_conclusion && (
                    <span className="badge badge-pos-pro">affects conclusion</span>
                  )}
                </div>
                <p className="text-xs text-ink-light leading-relaxed">{f.description}</p>
                {f.notes && (
                  <p className="text-xs text-ink-faint mt-1 italic">{f.notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* cruxes */}
      {cruxes.length > 0 && (
        <div>
          <p className="text-xs section-heading mb-2">Referenced by cruxes</p>
          <div className="space-y-2">
            {cruxes.map((cx) => (
              <div key={cx.id} className="border border-page-border bg-white p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-ink-faint">{cx.id}</span>
                  <CruxBadge status={cx.status} />
                </div>
                <p className="text-xs text-ink-light leading-relaxed">{cx.statement}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* what would update */}
      {updateScenarios.length > 0 && (
        <div>
          <p className="text-xs section-heading mb-2">What would update this</p>
          <div className="space-y-2">
            {updateScenarios.map((u, i) => (
              <div key={i} className="border border-page-border bg-white p-3">
                <div className="flex gap-1.5 mb-1 flex-wrap">
                  <span className={`badge ${
                    u.direction === 'weaken' ? 'badge-pos-pro' :
                    u.direction === 'strengthen' ? 'badge-pos-con' :
                    'badge-pos-conditional'
                  }`}>
                    {directionLabel(u.direction)} ({magnitudeLabel(u.magnitude)})
                  </span>
                </div>
                <p className="text-xs text-ink-light leading-relaxed">{u.scenario}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ---- main component props ----

export interface CaseStudyProps {
  title: string
  domain: string
  subdomain?: string | null
  status: CaseStatus
  dataStatus: DataStatus
  summary: string
  tags: string[]
  sources: Source[]
  extractedClaims: ExtractedClaim[]
  normalizedClaims: NormalizedClaim[]
  relations: Relation[]
  cruxes: Crux[]
  failureModeFlags: FailureModeFlag[]
  assessment: Assessment
  missingEvidence: MissingEvidence[]
}

export default function CaseStudyView({
  title,
  domain,
  subdomain,
  status,
  dataStatus,
  summary,
  tags,
  sources,
  extractedClaims,
  normalizedClaims,
  relations,
  cruxes,
  failureModeFlags,
  assessment,
  missingEvidence,
}: CaseStudyProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const sourceMap = useMemo(
    () => Object.fromEntries(sources.map((s) => [s.id, s])),
    [sources]
  )

  const normalizedClaimMap = useMemo(
    () => Object.fromEntries(normalizedClaims.map((nc) => [nc.id, nc])),
    [normalizedClaims]
  )

  const flagsByNcId = useMemo(() => {
    const map: Record<string, FailureModeFlag[]> = {}
    failureModeFlags.forEach((f) => {
      if (f.applies_to_type === 'normalized_claim') {
        if (!map[f.applies_to_id]) map[f.applies_to_id] = []
        map[f.applies_to_id].push(f)
      }
    })
    return map
  }, [failureModeFlags])

  const sourceFlagMap = useMemo(() => {
    const map: Record<string, FailureModeFlag[]> = {}
    failureModeFlags.forEach((f) => {
      if (f.applies_to_type === 'source') {
        if (!map[f.applies_to_id]) map[f.applies_to_id] = []
        map[f.applies_to_id].push(f)
      }
    })
    return map
  }, [failureModeFlags])

  const relationsFromMap = useMemo(() => {
    const map: Record<string, Relation[]> = {}
    relations.forEach((r) => {
      if (!map[r.from_id]) map[r.from_id] = []
      map[r.from_id].push(r)
    })
    return map
  }, [relations])

  const relationsToMap = useMemo(() => {
    const map: Record<string, Relation[]> = {}
    relations.forEach((r) => {
      if (!map[r.to_id]) map[r.to_id] = []
      map[r.to_id].push(r)
    })
    return map
  }, [relations])

  const cruxesByNcId = useMemo(() => {
    const map: Record<string, Crux[]> = {}
    cruxes.forEach((cx) => {
      cx.dependent_normalized_claim_ids.forEach((id) => {
        if (!map[id]) map[id] = []
        map[id].push(cx)
      })
    })
    return map
  }, [cruxes])

  const updatesByNcId = useMemo(() => {
    const map: Record<string, Assessment['what_would_update']> = {}
    assessment.what_would_update.forEach((u) => {
      u.would_affect_ids.forEach((id) => {
        if (!map[id]) map[id] = []
        map[id].push(u)
      })
    })
    return map
  }, [assessment.what_would_update])

  const handleSelectClaim = (id: string) => {
    setSelectedId((prev) => (prev === id ? null : id))
    // Scroll to selected claim after state update
    setTimeout(() => {
      const el = document.getElementById(`claim-${id}`)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }, 50)
  }

  const assessmentBorderClass =
    assessment.status === 'settled'
      ? 'border-l-4 border-l-green-600 bg-green-50'
      : assessment.status === 'partially_settled'
      ? 'border-l-4 border-l-amber-500 bg-amber-50'
      : 'border-l-4 border-l-slate-400 bg-slate-50'

  const statusBadgeClass =
    status === 'resolved'
      ? 'badge badge-status-resolved'
      : status === 'open' || status === 'contested'
      ? 'badge badge-status-open'
      : 'badge badge-status-underdetermined'

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">

      {/* ---- Header ---- */}
      <header className="mb-10 pb-10 border-b border-page-border">
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={statusBadgeClass}>{status.replace(/_/g, ' ')}</span>
          <span className={`badge ${
            dataStatus === 'verified' ? 'badge-data-verified' :
            dataStatus === 'partial' ? 'badge-data-partial' : 'badge-data-sample'
          }`}>data: {dataStatus}</span>
        </div>
        <h1 className="text-3xl font-bold text-ink mb-2 leading-tight">{title}</h1>
        <p className="text-sm text-ink-faint mb-5">
          {domain}{subdomain ? ` / ${subdomain}` : ''}
        </p>
        <p className="text-base text-ink-light leading-relaxed max-w-3xl mb-5">{summary}</p>
        <div className="flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <span key={t} className="text-xs text-ink-faint border border-page-border px-2 py-0.5">
              {t}
            </span>
          ))}
        </div>
      </header>

      {/* ---- Assessment ---- */}
      <section className="mb-12">
        <h2 className="section-heading mb-3">Assessment</h2>
        <div className={`p-5 ${assessmentBorderClass}`}>
          <div className="flex flex-wrap gap-1.5 mb-3">
            <span className={`badge ${
              assessment.status === 'settled' ? 'badge-status-resolved' :
              assessment.status === 'partially_settled' ? 'badge-status-open' :
              'badge-status-underdetermined'
            }`}>{assessment.status.replace(/_/g, ' ')}</span>
          </div>
          {assessment.settled_direction && (
            <p className="text-sm font-medium text-ink mb-2 leading-relaxed">
              {assessment.settled_direction}
            </p>
          )}
          {assessment.epistemic_status_summary && (
            <p className="text-sm text-ink-light leading-relaxed mb-4">
              {assessment.epistemic_status_summary}
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-black/5">
            <div>
              <p className="text-xs font-semibold text-ink-faint uppercase tracking-wide mb-1.5">Key cruxes</p>
              <div className="flex flex-wrap gap-1">
                {assessment.key_crux_ids.map((id) => (
                  <span key={id} className="text-xs font-mono text-accent">{id}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-ink-faint uppercase tracking-wide mb-1.5">Weak links</p>
              <div className="flex flex-wrap gap-1">
                {assessment.weak_link_ids.map((id) => (
                  <button
                    key={id}
                    onClick={() => handleSelectClaim(id)}
                    className="text-xs font-mono text-amber-700 hover:underline"
                  >
                    {id}
                  </button>
                ))}
              </div>
            </div>
            {assessment.well_supported_claim_ids && assessment.well_supported_claim_ids.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-ink-faint uppercase tracking-wide mb-1.5">Well supported</p>
                <div className="flex flex-wrap gap-1">
                  {assessment.well_supported_claim_ids.map((id) => (
                    <button
                      key={id}
                      onClick={() => handleSelectClaim(id)}
                      className="text-xs font-mono text-green-700 hover:underline"
                    >
                      {id}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {assessment.contested_claim_ids && assessment.contested_claim_ids.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-ink-faint uppercase tracking-wide mb-1.5">Contested</p>
                <div className="flex flex-wrap gap-1">
                  {assessment.contested_claim_ids.map((id) => (
                    <button
                      key={id}
                      onClick={() => handleSelectClaim(id)}
                      className="text-xs font-mono text-red-700 hover:underline"
                    >
                      {id}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          {assessment.dominant_failure_modes && assessment.dominant_failure_modes.length > 0 && (
            <div className="mt-4 pt-4 border-t border-black/5">
              <p className="text-xs font-semibold text-ink-faint uppercase tracking-wide mb-1.5">Dominant failure modes</p>
              <div className="flex flex-wrap gap-1.5">
                {assessment.dominant_failure_modes.map((fm) => (
                  <span key={fm} className="badge badge-flag">{fm.replace(/_/g, ' ')}</span>
                ))}
              </div>
            </div>
          )}
          {assessment.what_would_update.length > 0 && (
            <div className="mt-4 pt-4 border-t border-black/5">
              <p className="text-xs font-semibold text-ink-faint uppercase tracking-wide mb-2">What would update this assessment</p>
              <div className="space-y-2">
                {assessment.what_would_update.map((u, i) => (
                  <div key={i} className="text-xs text-ink-light leading-relaxed flex gap-2">
                    <span className={`shrink-0 mt-0.5 badge ${
                      u.direction === 'weaken' ? 'badge-pos-pro' :
                      u.direction === 'strengthen' ? 'badge-pos-con' : 'badge-pos-conditional'
                    }`}>{u.direction}</span>
                    <span>{u.scenario}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {assessment.notes && (
            <div className="mt-4 pt-4 border-t border-black/5">
              <p className="text-xs text-ink-faint leading-relaxed italic">{assessment.notes}</p>
            </div>
          )}
        </div>
      </section>

      {/* ---- Two-column layout ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* ---- Left: normalized claims ---- */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="section-heading">
              Normalized Claims ({normalizedClaims.length})
            </h2>
            <p className="text-xs text-ink-faint">Click a claim to inspect provenance, relations, flags, and update conditions.</p>
          </div>

          <div className="border border-page-border">
            {normalizedClaims.map((nc, i) => {
              const isSelected = nc.id === selectedId
              const claimFlags = flagsByNcId[nc.id] ?? []
              const outgoing = relationsFromMap[nc.id] ?? []
              const incoming = relationsToMap[nc.id] ?? []

              return (
                <div
                  key={nc.id}
                  id={`claim-${nc.id}`}
                  className={i < normalizedClaims.length - 1 ? 'border-b border-page-border' : ''}
                >
                  {/* claim row */}
                  <button
                    onClick={() => handleSelectClaim(nc.id)}
                    className={`w-full text-left p-4 hover:bg-slate-50 transition-colors ${
                      isSelected ? 'bg-accent-faint border-l-2 border-l-accent' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xs font-mono text-ink-faint shrink-0 pt-0.5 w-16">{nc.id}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          <PosBadge pos={nc.position} />
                          <ConfBadge level={nc.confidence.level} />
                          <span className="badge badge-pos-methodological">{nc.domain_type}</span>
                          {claimFlags.length > 0 && (
                            <span className="badge badge-flag">{claimFlags.length} flag{claimFlags.length > 1 ? 's' : ''}</span>
                          )}
                          {(incoming.length > 0 || outgoing.length > 0) && (
                            <span className="text-xs text-ink-faint font-mono">
                              {incoming.length}in {outgoing.length}out
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-ink leading-relaxed">
                          {isSelected
                            ? nc.normalized_text
                            : nc.normalized_text.length > 180
                            ? nc.normalized_text.slice(0, 180) + '...'
                            : nc.normalized_text}
                        </p>
                        {nc.tags && nc.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {nc.tags.map((tag) => (
                              <span key={tag} className="text-xs text-ink-faint border border-page-border px-1.5 py-0.5">
                                {tag.replace(/_/g, ' ')}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <span className="text-ink-faint shrink-0 text-xs mt-1">{isSelected ? '[-]' : '[+]'}</span>
                    </div>
                  </button>

                  {/* expanded detail */}
                  {isSelected && (
                    <ClaimDetail
                      claim={nc}
                      extractedClaims={extractedClaims}
                      sourceMap={sourceMap}
                      normalizedClaimMap={normalizedClaimMap}
                      relationsFrom={relationsFromMap[nc.id] ?? []}
                      relationsTo={relationsToMap[nc.id] ?? []}
                      flags={claimFlags}
                      cruxes={cruxesByNcId[nc.id] ?? []}
                      updateScenarios={updatesByNcId[nc.id] ?? []}
                      onSelectClaim={handleSelectClaim}
                    />
                  )}
                </div>
              )
            })}
          </div>

          {/* ---- Relations ---- */}
          <section className="mt-10">
            <h2 className="section-heading mb-3">Relations ({relations.length})</h2>
            <div className="border border-page-border">
              {relations.map((r, i) => (
                <div
                  key={r.id}
                  className={`p-3 ${i < relations.length - 1 ? 'border-b border-page-border' : ''}`}
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono text-ink-faint w-12 shrink-0">{r.id}</span>
                    <button
                      onClick={() => handleSelectClaim(r.from_id)}
                      className="text-xs font-mono text-accent hover:underline"
                    >
                      {r.from_id}
                    </button>
                    <RelTypeBadge type={r.type} />
                    <button
                      onClick={() => handleSelectClaim(r.to_id)}
                      className="text-xs font-mono text-accent hover:underline"
                    >
                      {r.to_id}
                    </button>
                    <span className="badge badge-status-underdetermined">{r.strength}</span>
                  </div>
                  {r.notes && (
                    <p className="text-xs text-ink-faint mt-1.5 ml-14 leading-relaxed">{r.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ---- Right sidebar ---- */}
        <div className="space-y-10">

          {/* cruxes */}
          <section>
            <h2 className="section-heading mb-3">Cruxes ({cruxes.length})</h2>
            <div className="space-y-3">
              {cruxes.map((cx) => (
                <div
                  key={cx.id}
                  className={`border-l-4 p-4 ${
                    cx.status === 'resolved_true' || cx.status === 'resolved_false'
                      ? 'border-l-green-600 bg-green-50'
                      : cx.status === 'unresolved'
                      ? 'border-l-amber-500 bg-amber-50'
                      : 'border-l-slate-400 bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-mono text-ink-faint">{cx.id}</span>
                    <CruxBadge status={cx.status} />
                  </div>
                  <p className="text-sm font-medium text-ink mb-2 leading-snug">{cx.statement}</p>
                  <p className="text-xs text-ink-faint leading-relaxed mb-2">{cx.description}</p>
                  {cx.resolution_notes && (
                    <p className="text-xs text-ink-light leading-relaxed italic mt-2 pt-2 border-t border-black/5">
                      {cx.resolution_notes}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1 mt-2">
                    <span className="text-xs text-ink-faint">Affects:</span>
                    {cx.dependent_normalized_claim_ids.map((id) => (
                      <button
                        key={id}
                        onClick={() => handleSelectClaim(id)}
                        className="text-xs font-mono text-accent hover:underline"
                      >
                        {id}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* failure mode flags (source-level and relation-level) */}
          {failureModeFlags.filter((f) => f.applies_to_type !== 'normalized_claim').length > 0 && (
            <section>
              <h2 className="section-heading mb-3">Source Flags</h2>
              <div className="space-y-2">
                {failureModeFlags
                  .filter((f) => f.applies_to_type !== 'normalized_claim')
                  .map((f) => (
                    <div key={f.id} className="border border-orange-100 bg-orange-50 p-3">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs font-mono text-ink-faint">{f.id}</span>
                        <code className="text-xs font-mono text-ink-faint">{f.applies_to_id}</code>
                        <span className="badge badge-flag">{f.type.replace(/_/g, ' ')}</span>
                        <SevBadge severity={f.severity} />
                      </div>
                      <p className="text-xs text-ink-light leading-relaxed">{f.description}</p>
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* all failure mode flags overview */}
          <section>
            <h2 className="section-heading mb-3">All Failure Mode Flags ({failureModeFlags.length})</h2>
            <div className="space-y-2">
              {failureModeFlags.map((f) => (
                <div key={f.id} className="border border-page-border p-3">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-mono text-ink-faint">{f.id}</span>
                    <span className="badge badge-flag">{f.type.replace(/_/g, ' ')}</span>
                    <SevBadge severity={f.severity} />
                    {f.applies_to_type === 'normalized_claim' ? (
                      <button
                        onClick={() => handleSelectClaim(f.applies_to_id)}
                        className="text-xs font-mono text-accent hover:underline"
                      >
                        {f.applies_to_id}
                      </button>
                    ) : (
                      <code className="text-xs font-mono text-ink-faint">{f.applies_to_id}</code>
                    )}
                  </div>
                  <p className="text-xs text-ink-faint leading-relaxed line-clamp-2">{f.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* missing evidence */}
          {missingEvidence.length > 0 && (
            <section>
              <h2 className="section-heading mb-3">Missing Evidence ({missingEvidence.length})</h2>
              <div className="space-y-3">
                {missingEvidence.map((me) => (
                  <div key={me.id} className="border border-page-border p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-xs font-mono text-ink-faint">{me.id}</span>
                      <div className="flex gap-1.5 flex-wrap">
                        <span className={`badge ${
                          me.priority === 'critical' ? 'badge-pos-pro' :
                          me.priority === 'important' ? 'badge-pos-conditional' :
                          'badge-status-underdetermined'
                        }`}>{me.priority}</span>
                        <span className="badge badge-pos-methodological">{me.type}</span>
                        {me.feasibility && (
                          <span className="badge badge-status-underdetermined">{me.feasibility}</span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-ink-light leading-relaxed">{me.description}</p>
                    {me.reason_absent && (
                      <p className="text-xs text-ink-faint mt-1 italic">{me.reason_absent}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* sources */}
          <section>
            <h2 className="section-heading mb-3">Sources ({sources.length})</h2>
            <div className="border border-page-border">
              {sources.map((src, i) => {
                const srcFlags = sourceFlagMap[src.id] ?? []
                return (
                  <div
                    key={src.id}
                    className={`p-4 ${i < sources.length - 1 ? 'border-b border-page-border' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="text-xs font-mono text-ink-faint">{src.id}</span>
                      <div className="flex gap-1.5 flex-shrink-0">
                        <span className="badge badge-status-underdetermined">{src.type}</span>
                        <span className={`badge ${
                          src.credibility === 'high' ? 'badge-conf-high' :
                          src.credibility === 'medium' ? 'badge-conf-medium' :
                          src.credibility === 'low' ? 'badge-conf-low' : 'badge-conf-speculative'
                        }`}>{src.credibility}</span>
                      </div>
                    </div>
                    <p className="text-xs font-medium text-ink mb-1 leading-snug">{src.title}</p>
                    <p className="text-xs text-ink-faint mb-1">
                      {authorStr(src.provenance.author)}
                      {src.provenance.date && ` (${src.provenance.date})`}
                    </p>
                    {src.provenance.doi && (
                      <p className="text-xs text-ink-faint font-mono">doi:{src.provenance.doi}</p>
                    )}
                    {src.conflict_of_interest && (
                      <div className="mt-2 bg-orange-50 border border-orange-100 px-2 py-1.5">
                        <p className="text-xs text-orange-800 leading-relaxed">
                          <span className="font-semibold">COI:</span> {src.conflict_of_interest}
                        </p>
                      </div>
                    )}
                    {srcFlags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {srcFlags.map((f) => (
                          <span key={f.id} className="badge badge-flag">{f.type.replace(/_/g, ' ')}</span>
                        ))}
                      </div>
                    )}
                    {src.notes && (
                      <p className="text-xs text-ink-faint mt-2 leading-relaxed">{src.notes}</p>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
