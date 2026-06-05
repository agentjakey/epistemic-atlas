import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Showcase | Epistemic Atlas',
}

const flow = [
  'Sources',
  'Extracted Claims',
  'Normalized Claims',
  'Relations',
  'Cruxes',
  'Assessment',
]

const cards = [
  {
    id: 'LHC-2008',
    title: 'LHC Black-Hole Risk',
    type: 'Technical risk assessment',
    status: 'Largely resolved',
    statusClass: 'badge badge-status-resolved',
    metrics: '12 norm. claims / 5 cruxes / 8 flags',
    note: 'Two independent safety arguments; primary report carries correlated-evidence flags from shared authorship.',
  },
  {
    id: 'EGGS',
    title: 'Dietary Eggs and CVD Risk',
    type: 'Public-health evidence dispute',
    status: 'Open',
    statusClass: 'badge badge-status-open',
    metrics: '12 norm. claims / 5 cruxes / 10 flags',
    note: 'All five cruxes unresolved or empirically underdetermined. Funding pressure and population heterogeneity flags prominent.',
  },
  {
    id: 'SCHEMA-V2',
    title: 'Reusable Schema',
    type: 'JSON Schema Draft 2020-12',
    status: 'v2',
    statusClass: 'badge badge-status-underdetermined',
    metrics: '9 object types / 10 relation types / 12 failure modes',
    note: 'JSON export, typed audit notes, update conditions. Case-agnostic: same specification covers both cases without extensions.',
  },
]

export default function ShowcasePage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">

      {/* header block */}
      <div className="border-b border-page-border pb-10 mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-4">
              FLF Epistemic Case Study Competition
            </p>
            <h1 className="text-5xl font-bold text-ink leading-none tracking-tight mb-3">
              Epistemic Atlas
            </h1>
            <p className="text-2xl font-light text-ink-faint leading-snug mb-5">
              Turning messy disputes into inspectable claim graphs.
            </p>
            <p className="text-sm text-ink-light leading-relaxed max-w-xl">
              A human-AI workflow for preserving source provenance, normalized claims,
              support and objection relations, cruxes, missing evidence, uncertainty,
              and epistemic failure-mode flags in a structured, queryable form.
            </p>
          </div>
          <div>
            <p className="text-xs section-heading mb-4">Six-Stage Pipeline</p>
            <div className="flex flex-wrap items-center gap-0">
              {flow.map((stage, i) => (
                <div key={stage} className="flex items-center">
                  <span className="text-xs font-mono bg-page-off border border-page-border px-2.5 py-1.5 text-ink-faint whitespace-nowrap">
                    {stage}
                  </span>
                  {i < flow.length - 1 && (
                    <span className="text-ink-faint text-xs px-1">›</span>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-ink-faint mt-4 leading-relaxed max-w-lg">
              Each stage has a corresponding prompt template. LLM assistance reduces
              time cost; human oversight is required at every stage before upgrading
              data_status from partial to verified.
            </p>
          </div>
        </div>
      </div>

      {/* two-column body */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-10">

        {/* left: case cards */}
        <div className="lg:col-span-3 space-y-4">
          <p className="text-xs section-heading">Worked Examples and Schema</p>
          {cards.map((card) => (
            <div key={card.id} className="border border-page-border bg-white">
              <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-page-border">
                <div>
                  <span className="text-xs font-mono text-ink-faint block mb-0.5">{card.id}</span>
                  <h3 className="text-base font-semibold text-ink leading-snug">{card.title}</h3>
                  <p className="text-xs text-ink-faint mt-0.5">{card.type}</p>
                </div>
                <span className={`${card.statusClass} shrink-0`}>{card.status}</span>
              </div>
              <div className="px-5 py-4">
                <p className="text-xs text-ink-faint font-mono mb-2">{card.metrics}</p>
                <p className="text-xs text-ink-light leading-relaxed">{card.note}</p>
              </div>
            </div>
          ))}
        </div>

        {/* right: claim inspector preview */}
        <div className="lg:col-span-2">
          <p className="text-xs section-heading mb-4">Claim Inspector Preview</p>
          <div className="border border-page-border bg-white h-full">
            <div className="bg-page-off border-b border-page-border px-4 py-3">
              <p className="text-xs font-mono text-ink-faint">normalized_claim</p>
              <p className="text-sm font-semibold text-ink">NC_012</p>
            </div>

            <div className="p-4 border-b border-page-border">
              <p className="text-xs text-ink-light leading-relaxed">
                The LSAG 2008 assessment concluded that LHC operations pose no risk of
                catastrophic harm from microscopic black holes.
              </p>
              <div className="flex gap-3 mt-2.5">
                <span className="badge badge-pos-con">pro-safety</span>
                <span className="badge badge-conf-high">confidence: high</span>
              </div>
            </div>

            <div className="p-4 border-b border-page-border">
              <p className="text-xs section-heading" style={{ marginBottom: '0.5rem' }}>Incoming relations</p>
              <div className="space-y-2">
                {[
                  { from: 'NC_004', type: 'supports', strength: 'strong', flags: 0, color: 'text-blue-600' },
                  { from: 'NC_003', type: 'supports', strength: 'moderate', flags: 2, color: 'text-slate-500' },
                  { from: 'NC_005', type: 'supports', strength: 'moderate', flags: 0, color: 'text-slate-500' },
                ].map((r) => (
                  <div key={r.from} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono text-ink-faint">{r.from}</span>
                      <span className="text-xs text-ink-faint">›</span>
                      <span className={`text-xs font-mono ${r.color}`}>{r.type}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-ink-faint">{r.strength}</span>
                      {r.flags > 0 && (
                        <span className="badge badge-flag">{r.flags} flag{r.flags > 1 ? 's' : ''}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-b border-page-border">
              <p className="text-xs section-heading" style={{ marginBottom: '0.5rem' }}>Failure mode flags</p>
              <div className="space-y-1.5">
                {[
                  { id: 'FF_005', type: 'correlated_evidence_treated_as_independent' },
                  { id: 'FF_008', type: 'expert_consensus_without_dependency_map' },
                ].map((f) => (
                  <div key={f.id} className="flex items-start gap-2">
                    <span className="text-xs font-mono text-ink-faint shrink-0">{f.id}</span>
                    <span className="text-xs text-orange-700 leading-tight">{f.type}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-b border-page-border">
              <p className="text-xs section-heading" style={{ marginBottom: '0.5rem' }}>Crux dependencies</p>
              <div className="space-y-1.5">
                {[
                  { id: 'CX_001', status: 'resolved_true' },
                  { id: 'CX_004', status: 'resolved_true' },
                ].map((cx) => (
                  <div key={cx.id} className="flex items-center justify-between">
                    <span className="text-xs font-mono text-ink-faint">{cx.id}</span>
                    <span className="text-xs font-mono text-green-700">{cx.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-green-50 border-t border-green-200">
              <p className="text-xs section-heading" style={{ marginBottom: '0.5rem' }}>Assessment</p>
              <p className="text-xs font-semibold text-green-800 mb-1">status: settled</p>
              <p className="text-xs font-mono text-green-700">weak_links: NC_003, NC_005</p>
            </div>
          </div>
        </div>
      </div>

      {/* feature strip */}
      <div className="grid grid-cols-3 gap-6 py-8 border-t border-b border-page-border mb-8">
        {[
          {
            label: 'Claim-Level Granularity',
            text: 'Failure-mode flags attach to individual claims and sources, not to the case as a whole. This makes them queryable across cases.',
          },
          {
            label: 'Explicit Update Conditions',
            text: 'Each assessment names concrete scenarios that would change the conclusion: named study designs, specific crux resolutions, identified weak links.',
          },
          {
            label: 'Full Provenance Chain',
            text: 'Every normalized claim traces to its extracted form, which traces to its source. The audit trail is complete and inspectable at every layer.',
          },
        ].map((item) => (
          <div key={item.label}>
            <p className="text-xs section-heading">{item.label}</p>
            <p className="text-sm text-ink-light leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>

      {/* nav + disclaimer row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex gap-4">
          <Link href="/lhc" className="text-xs text-accent hover:underline">LHC Case</Link>
          <Link href="/eggs" className="text-xs text-accent hover:underline">Eggs Case</Link>
          <Link href="/workflow" className="text-xs text-accent hover:underline">Workflow</Link>
          <Link href="/schema" className="text-xs text-accent hover:underline">Schema</Link>
        </div>
        <p className="text-xs text-ink-faint max-w-lg leading-relaxed text-right">
          Current case data is partially verified and intended to demonstrate the
          workflow, not to provide final scientific or medical authority.
        </p>
      </div>

    </div>
  )
}
