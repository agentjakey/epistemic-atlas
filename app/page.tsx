import Link from 'next/link'

const cases = [
  {
    href: '/lhc',
    id: 'LHC-2008',
    title: 'LHC Black Holes',
    domain: 'Particle physics / Risk assessment',
    status: 'Resolved',
    statusClass: 'badge badge-status-resolved',
    summary:
      'The 2008 dispute over whether the Large Hadron Collider could produce micro black holes capable of catastrophic harm. Involves contested theoretical physics, institutional safety assessment, and a federal legal challenge.',
    counts: { sources: 8, claims: 12, cruxes: 5, flags: 8 },
    tags: ['risk assessment', 'theoretical physics', 'public communication'],
  },
  {
    href: '/eggs',
    id: 'EGGS',
    title: 'Dietary Eggs and CVD Risk',
    domain: 'Nutrition science / Epidemiology',
    status: 'Open',
    statusClass: 'badge badge-status-open',
    summary:
      'A decades-long dispute over whether egg consumption increases cardiovascular disease risk. Involves contradictory observational studies, documented industry funding bias, and regulatory guidance that shifted without scientific resolution.',
    counts: { sources: 8, claims: 12, cruxes: 5, flags: 10 },
    tags: ['funding bias', 'observational epidemiology', 'dietary guidelines'],
  },
]

const layers = [
  {
    n: '1',
    label: 'Ingestion',
    color: 'border-accent bg-accent-faint',
    items: [
      'Source objects: full provenance, credibility, conflict of interest',
      'Extracted claims: verbatim text tied to source IDs',
      'All sources retained regardless of quality or position',
    ],
  },
  {
    n: '2',
    label: 'Structure',
    color: 'border-amber-500 bg-amber-50',
    items: [
      'Normalized claims: unambiguous, scope-explicit propositions',
      'Relation graph: typed directed edges (supports, attacks, depends_on, ...)',
      'Failure mode flags: attached to individual claims and sources',
    ],
  },
  {
    n: '3',
    label: 'Assessment',
    color: 'border-green-600 bg-green-50',
    items: [
      'Cruxes: pivotal questions with resolution status and dependency links',
      'Overall status: settled / unsettled / partially settled',
      'What would update: scenarios that would change the conclusion',
    ],
  },
]

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-6">

      {/* hero */}
      <div className="py-20 border-b border-page-border">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-ink-faint mb-5">
            FLF Epistemic Case Study Competition
          </p>
          <h1 className="text-4xl font-bold text-ink mb-5 leading-tight">
            Epistemic Atlas
          </h1>
          <div className="prose-atlas text-ink-light mb-8 max-w-2xl">
            <p>
              Epistemic Atlas is a schema, methodology, and interactive prototype for
              converting real-world disputes into structured, queryable knowledge bases.
              The goal is to make the full epistemic content of a dispute (sources,
              claims, logical relations, failure modes, cruxes) explicit, navigable,
              and reusable over time, rather than buried in prose or collapsed into a
              summary verdict.
            </p>
            <p>
              The system works in three layers: ingestion extracts raw source material
              into typed objects with full provenance; structure normalizes claims and
              maps their logical relations into a directed graph; assessment synthesizes
              the graph into crux identification, failure mode cataloging, and an honest
              epistemic verdict with explicit update conditions. Each layer feeds the next
              without discarding what came before.
            </p>
            <p>
              Two worked case studies demonstrate the methodology: the 2008 LHC black hole
              risk dispute (settled, with a clear resolution supported by multiple independent
              lines of evidence) and the decades-long debate over dietary eggs and
              cardiovascular disease risk (unsettled, with conflicting high-quality studies,
              population heterogeneity, and unresolved cruxes). The cases were chosen because
              they differ in domain, resolution status, and failure mode profile. A schema
              that handles both without modification is one step toward a general-purpose tool.
            </p>
          </div>
          <div className="flex gap-4 flex-wrap">
            <Link
              href="/workflow"
              className="inline-flex items-center gap-2 bg-accent text-white px-5 py-2.5 text-sm font-medium hover:bg-accent-light transition-colors"
            >
              View Pipeline
            </Link>
            <Link
              href="/schema"
              className="inline-flex items-center gap-2 border border-page-border text-ink-light px-5 py-2.5 text-sm font-medium hover:text-ink hover:border-ink-light transition-colors"
            >
              Schema Reference
            </Link>
          </div>
        </div>
      </div>

      {/* three-layer stack */}
      <div className="py-16 border-b border-page-border">
        <h2 className="text-sm section-heading mb-8">Three-Layer Stack</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-page-border">
          {layers.map((layer, i) => (
            <div
              key={layer.n}
              className={`p-6 border-l-4 ${layer.color} ${
                i < layers.length - 1 ? 'border-r border-page-border' : ''
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl font-mono font-light text-ink-faint w-6">{layer.n}</span>
                <h3 className="text-sm font-semibold text-ink">{layer.label}</h3>
              </div>
              <ul className="space-y-2.5">
                {layer.items.map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span className="text-ink-faint shrink-0 mt-0.5">--</span>
                    <span className="text-xs text-ink-light leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="text-xs text-ink-faint mt-4 leading-relaxed max-w-2xl">
          Layer 1 objects are never discarded. A low-credibility source with a conflict of interest
          is retained and flagged, not removed. Missing provenance is represented as null. The
          goal is a complete audit trail, not a curated summary.
        </p>
      </div>

      {/* case studies */}
      <div className="py-16 border-b border-page-border">
        <h2 className="text-sm section-heading mb-6">Case Studies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cases.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="block border border-page-border p-6 hover:border-ink-faint transition-colors group"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-xs font-mono text-ink-faint">{c.id}</span>
                <span className={c.statusClass}>{c.status}</span>
              </div>
              <h3 className="text-lg font-semibold text-ink mb-1 group-hover:text-accent transition-colors">
                {c.title}
              </h3>
              <p className="text-xs text-ink-faint mb-4">{c.domain}</p>
              <p className="text-sm text-ink-light leading-relaxed mb-4">{c.summary}</p>
              <div className="grid grid-cols-4 gap-3 mb-4 pt-4 border-t border-page-border">
                {Object.entries(c.counts).map(([k, v]) => (
                  <div key={k}>
                    <p className="text-lg font-mono font-light text-ink">{v}</p>
                    <p className="text-xs text-ink-faint">{k}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {c.tags.map((tag) => (
                  <span key={tag} className="text-xs text-ink-faint border border-page-border px-2 py-0.5">
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* project artifacts */}
      <div className="py-16">
        <h2 className="text-sm section-heading mb-6">Project Artifacts</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { href: '/workflow', title: 'Workflow', desc: 'Six-stage pipeline with prompt templates' },
            { href: '/schema', title: 'Schema', desc: 'JSON Schema specification v2' },
            { href: '/evaluation', title: 'Evaluation', desc: 'Four evaluation lenses with honest gaps' },
            { href: '/limitations', title: 'Limitations', desc: 'Candid account of what this is not' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block border border-page-border p-4 hover:border-ink-faint transition-colors group"
            >
              <h3 className="text-sm font-semibold text-ink mb-1.5 group-hover:text-accent transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-ink-faint leading-relaxed">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
