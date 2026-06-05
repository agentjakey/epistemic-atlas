import type {
  Source,
  Claim,
  Relation,
  Crux,
  MissingEvidence,
  Assessment,
  CaseStatus,
  DataStatus,
  ConfidenceLevel,
  Position,
  CruxStatus,
} from '@/lib/types'

function confidenceBadge(level: ConfidenceLevel) {
  const map: Record<ConfidenceLevel, string> = {
    high: 'badge badge-conf-high',
    medium: 'badge badge-conf-medium',
    low: 'badge badge-conf-low',
    speculative: 'badge badge-conf-speculative',
  }
  return <span className={map[level]}>{level}</span>
}

function positionBadge(pos: Position) {
  const map: Record<Position, string> = {
    pro: 'badge badge-pos-pro',
    con: 'badge badge-pos-con',
    neutral: 'badge badge-pos-neutral',
    conditional: 'badge badge-pos-conditional',
    methodological: 'badge badge-pos-methodological',
  }
  return <span className={map[pos]}>{pos}</span>
}

function statusBadge(status: CaseStatus) {
  const map: Record<CaseStatus, string> = {
    resolved: 'badge badge-status-resolved',
    open: 'badge badge-status-open',
    partially_resolved: 'badge badge-status-open',
    contested: 'badge badge-status-open',
    archived: 'badge badge-status-underdetermined',
  }
  return <span className={map[status]}>{status.replace('_', ' ')}</span>
}

function dataBadge(status: DataStatus) {
  const map: Record<DataStatus, string> = {
    verified: 'badge badge-data-verified',
    partial: 'badge badge-data-partial',
    sample: 'badge badge-data-sample',
  }
  return <span className={map[status]}>data: {status}</span>
}

function cruxStatusBadge(status: CruxStatus) {
  const map: Record<CruxStatus, string> = {
    unresolved: 'badge badge-status-open',
    resolved_true: 'badge badge-status-resolved',
    resolved_false: 'badge badge-status-resolved',
    empirically_underdetermined: 'badge badge-status-underdetermined',
    theoretically_underdetermined: 'badge badge-status-underdetermined',
  }
  const label: Record<CruxStatus, string> = {
    unresolved: 'Unresolved',
    resolved_true: 'Resolved: true',
    resolved_false: 'Resolved: false',
    empirically_underdetermined: 'Empirically underdetermined',
    theoretically_underdetermined: 'Theoretically underdetermined',
  }
  return <span className={map[status]}>{label[status]}</span>
}

function authorStr(author: string | string[] | null | undefined): string {
  if (!author) return 'Unknown'
  if (Array.isArray(author)) {
    if (author.length > 3) return `${author[0]} et al.`
    return author.join(', ')
  }
  return author
}

interface Props {
  title: string
  domain: string
  subdomain?: string
  status: CaseStatus
  data_status: DataStatus
  summary: string
  tags: string[]
  sources: Source[]
  claims: Claim[]
  relations: Relation[]
  cruxes: Crux[]
  missing_evidence: MissingEvidence[]
  assessment: Assessment
}

export default function CaseStudyView({
  title,
  domain,
  subdomain,
  status,
  data_status,
  summary,
  tags,
  sources,
  claims,
  relations,
  cruxes,
  missing_evidence,
  assessment,
}: Props) {
  const sourceMap: Record<string, Source> = Object.fromEntries(sources.map((s) => [s.id, s]))

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12 pb-10 border-b border-page-border">
        <div className="flex flex-wrap gap-2 mb-4">
          {statusBadge(status)}
          {dataBadge(data_status)}
        </div>
        <h1 className="text-3xl font-bold text-ink mb-3 leading-tight">{title}</h1>
        <p className="text-sm text-ink-faint mb-6">
          {domain}{subdomain ? ` -- ${subdomain}` : ''}
        </p>
        <p className="text-base text-ink-light leading-relaxed max-w-3xl mb-6">
          {summary}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span key={tag} className="text-xs text-ink-faint border border-page-border px-2 py-0.5">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-14">
          <section>
            <h2 className="section-heading">
              Sources ({sources.length})
            </h2>
            <div className="border border-page-border">
              {sources.map((src, i) => (
                <div key={src.id} className={`p-5 ${i < sources.length - 1 ? 'border-b border-page-border' : ''}`}>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <span className="text-xs font-mono text-ink-faint">{src.id}</span>
                    <div className="flex gap-1.5 flex-wrap justify-end">
                      <span className="badge badge-status-underdetermined">{src.type}</span>
                      <span className={`badge ${
                        src.credibility === 'high' ? 'badge-conf-high' :
                        src.credibility === 'medium' ? 'badge-conf-medium' :
                        src.credibility === 'low' ? 'badge-conf-low' : 'badge-conf-speculative'
                      }`}>{src.credibility}</span>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-ink mb-1">{src.title}</p>
                  <p className="text-xs text-ink-faint mb-2">
                    {authorStr(src.provenance.author)}
                    {src.provenance.institution && ` -- ${src.provenance.institution}`}
                    {src.provenance.date && ` -- ${src.provenance.date}`}
                    {src.provenance.venue && ` -- ${src.provenance.venue}`}
                  </p>
                  {src.conflict_of_interest && (
                    <div className="mt-2 bg-orange-50 border border-orange-100 px-3 py-2">
                      <p className="text-xs text-orange-800">
                        <span className="font-semibold">Conflict of interest:</span>{' '}
                        {src.conflict_of_interest}
                      </p>
                    </div>
                  )}
                  {src.notes && (
                    <p className="text-xs text-ink-faint mt-2 leading-relaxed">{src.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="section-heading">
              Claims ({claims.length})
            </h2>
            <div className="border border-page-border">
              {claims.map((claim, i) => (
                <div
                  key={claim.id}
                  className={`p-5 ${i < claims.length - 1 ? 'border-b border-page-border' : ''}`}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <span className="text-xs font-mono text-ink-faint">{claim.id}</span>
                    <div className="flex gap-1.5 flex-wrap justify-end">
                      {positionBadge(claim.position)}
                      {confidenceBadge(claim.confidence.level)}
                      <span className="badge badge-status-underdetermined">{claim.domain_type}</span>
                    </div>
                  </div>
                  <p className="text-sm text-ink leading-relaxed mb-2 font-medium">
                    {claim.normalized}
                  </p>
                  {claim.normalized !== claim.raw && (
                    <div className="mt-2 mb-3">
                      <p className="text-xs text-ink-faint leading-relaxed">
                        <span className="font-semibold">Raw:</span> {claim.raw}
                      </p>
                    </div>
                  )}
                  <div className="flex items-center gap-4 text-xs text-ink-faint mb-2">
                    <span>
                      Source:{' '}
                      <span className="font-mono">
                        {claim.source_id}
                        {sourceMap[claim.source_id]
                          ? ` (${sourceMap[claim.source_id].title.slice(0, 50)}...)`
                          : ''}
                      </span>
                    </span>
                  </div>
                  {claim.confidence.notes && (
                    <p className="text-xs text-ink-faint leading-relaxed mt-2 border-t border-page-border pt-2">
                      {claim.confidence.notes}
                    </p>
                  )}
                  {claim.failure_flags && claim.failure_flags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {claim.failure_flags.map((flag) => (
                        <span key={flag} className="badge badge-flag">
                          {flag.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="section-heading">
              Relations ({relations.length})
            </h2>
            <div className="border border-page-border">
              {relations.map((rel, i) => (
                <div
                  key={rel.id}
                  className={`p-4 ${i < relations.length - 1 ? 'border-b border-page-border' : ''}`}
                >
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="text-xs font-mono text-ink-faint">{rel.id}</span>
                    <span className="text-xs font-mono font-semibold text-ink">
                      {rel.from_claim_id}
                    </span>
                    <span className={`badge ${
                      rel.type === 'attacks' ? 'badge-pos-pro' :
                      rel.type === 'supports' ? 'badge-pos-con' :
                      rel.type === 'depends_on' ? 'badge-pos-conditional' :
                      'badge-pos-methodological'
                    }`}>{rel.type.replace('_', ' ')}</span>
                    <span className="text-xs font-mono font-semibold text-ink">
                      {rel.to_claim_id}
                    </span>
                    <span className="badge badge-status-underdetermined">{rel.strength}</span>
                  </div>
                  {rel.notes && (
                    <p className="text-xs text-ink-faint leading-relaxed">{rel.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-10">
          <section>
            <h2 className="section-heading">Assessment</h2>
            <div className={`border-l-4 p-5 ${
              assessment.resolved
                ? 'border-l-green-600 bg-green-50'
                : 'border-l-amber-500 bg-amber-50'
            }`}>
              <p className="text-sm text-ink leading-relaxed mb-4">
                {assessment.epistemic_status}
              </p>
              {assessment.resolution_summary && (
                <div className="mt-3 pt-3 border-t border-page-border">
                  <p className="text-xs text-ink-light leading-relaxed">
                    {assessment.resolution_summary}
                  </p>
                </div>
              )}
            </div>

            {assessment.failure_modes_observed.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-semibold text-ink-faint mb-2">Failure modes observed</p>
                <div className="flex flex-wrap gap-1.5">
                  {assessment.failure_modes_observed.map((fm) => (
                    <span key={fm} className="badge badge-flag">
                      {fm.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {assessment.notes && (
              <div className="mt-4 pt-4 border-t border-page-border">
                <p className="text-xs text-ink-faint leading-relaxed">{assessment.notes}</p>
              </div>
            )}
          </section>

          <section>
            <h2 className="section-heading">
              Cruxes ({cruxes.length})
            </h2>
            <div className="space-y-3">
              {cruxes.map((crux) => (
                <div
                  key={crux.id}
                  className={`border-l-4 p-4 ${
                    crux.status === 'resolved_true' || crux.status === 'resolved_false'
                      ? 'border-l-green-600 bg-green-50'
                      : crux.status === 'unresolved'
                      ? 'border-l-amber-500 bg-amber-50'
                      : 'border-l-gray-400 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-mono text-ink-faint">{crux.id}</span>
                    {cruxStatusBadge(crux.status)}
                  </div>
                  <p className="text-sm font-medium text-ink mb-2">{crux.statement}</p>
                  <p className="text-xs text-ink-faint leading-relaxed mb-2">
                    {crux.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <span className="text-xs text-ink-faint">Affects:</span>
                    {crux.dependent_claim_ids.map((id) => (
                      <span key={id} className="text-xs font-mono text-ink-faint">{id}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="section-heading">
              Missing Evidence ({missing_evidence.length})
            </h2>
            <div className="space-y-3">
              {missing_evidence.map((me) => (
                <div key={me.id} className="border border-page-border p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-mono text-ink-faint">{me.id}</span>
                    <div className="flex gap-1.5">
                      <span className={`badge ${
                        me.priority === 'critical' ? 'badge-pos-pro' :
                        me.priority === 'important' ? 'badge-pos-conditional' :
                        'badge-status-underdetermined'
                      }`}>{me.priority}</span>
                      <span className="badge badge-pos-methodological">{me.type}</span>
                    </div>
                  </div>
                  <p className="text-xs text-ink-light leading-relaxed">
                    {me.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="section-heading">Well-supported claims</h2>
            <div className="flex flex-wrap gap-1.5">
              {assessment.well_supported_claim_ids.map((id) => (
                <span key={id} className="badge badge-conf-high">{id}</span>
              ))}
            </div>
          </section>

          <section>
            <h2 className="section-heading">Contested claims</h2>
            <div className="flex flex-wrap gap-1.5">
              {assessment.contested_claim_ids.map((id) => (
                <span key={id} className="badge badge-conf-low">{id}</span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
