import Link from 'next/link'

const dimensions = [
  {
    n: '01',
    title: 'Provenance preservation',
    desc: 'Every claim traces to a source object. Every source carries author, institution, date, venue, and credibility assessment. Missing provenance is represented explicitly, not silently omitted.',
  },
  {
    n: '02',
    title: 'Structural completeness',
    desc: 'Claims are related through a controlled vocabulary: supports, attacks, depends on, qualifies, implies. The relation graph is directed and typed, not just a list of associated sources.',
  },
  {
    n: '03',
    title: 'Failure mode detection',
    desc: 'Epistemic failure modes (funding bias, cherry-picking, motivated reasoning, etc.) attach to individual claims, not to entire sources. This makes patterns queryable at fine granularity.',
  },
  {
    n: '04',
    title: 'Crux explicitness',
    desc: 'Pivotal questions are first-class objects with resolution status and dependency links. Identifying cruxes changes how you read the rest of a dispute.',
  },
  {
    n: '05',
    title: 'Honest incompleteness',
    desc: 'Missing evidence is a structured category. The system records what is absent and what it would resolve, not only what exists.',
  },
]

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
    tags: ['funding bias', 'observational epidemiology', 'dietary guidelines'],
  },
]

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="py-20 border-b border-page-border">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-ink-faint mb-5">
            FLF Epistemic Case Study Competition
          </p>
          <h1 className="text-4xl font-bold text-ink mb-5 leading-tight">
            Epistemic Atlas
          </h1>
          <p className="text-lg text-ink-light leading-relaxed mb-8 max-w-2xl">
            A methodology and schema for converting real-world disputes into structured,
            queryable epistemic knowledge bases -- preserving provenance, surfacing cruxes,
            and tracking failure modes at the claim level.
          </p>
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

      <div className="py-16 border-b border-page-border">
        <div className="max-w-3xl">
          <h2 className="text-xl font-semibold text-ink mb-5">The problem</h2>
          <div className="prose-atlas text-ink-light">
            <p>
              Public epistemic failures share common structural features: claims that outlived
              their evidence, missing provenance chains, unacknowledged cruxes, and failure
              modes that only became visible in retrospect. The same errors recur because
              disputes happen in prose, and prose does not preserve structure.
            </p>
            <p>
              Standard tools address symptoms. Fact-checkers verify isolated claims.
              AI summarizers compress debates into neutral overviews. Citation managers
              track sources. None produce an artifact that makes the full epistemic content
              of a dispute queryable, navigable, and reusable over time.
            </p>
            <p>
              Epistemic Atlas proposes a schema and six-step pipeline for encoding disputes
              as structured knowledge graphs. The output is a machine-readable JSON file.
              It is also a human-navigable research artifact.
            </p>
          </div>
        </div>
      </div>

      <div className="py-16 border-b border-page-border">
        <h2 className="text-sm section-heading">Case Studies</h2>
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

      <div className="py-16 border-b border-page-border">
        <h2 className="text-sm section-heading">Five Design Dimensions</h2>
        <div className="space-y-0">
          {dimensions.map((d) => (
            <div
              key={d.n}
              className="flex gap-8 py-6 border-b border-page-border last:border-b-0"
            >
              <span className="text-2xl font-mono font-light text-ink-faint w-12 shrink-0 pt-0.5">
                {d.n}
              </span>
              <div>
                <h3 className="text-sm font-semibold text-ink mb-2">{d.title}</h3>
                <p className="text-sm text-ink-light leading-relaxed">{d.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="py-16">
        <h2 className="text-sm section-heading">Project Artifacts</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { href: '/workflow', title: 'Workflow', desc: 'Six-step pipeline with prompt templates' },
            { href: '/schema', title: 'Schema', desc: 'JSON Schema specification v1' },
            { href: '/evaluation', title: 'Evaluation', desc: 'Criteria and self-assessment' },
            { href: '/limitations', title: 'Limitations', desc: 'Honest account of what this is not' },
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
