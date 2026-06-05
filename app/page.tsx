import Link from 'next/link'

const features = [
  'Provenance-aware source capture',
  'Atomic claim extraction and normalization',
  'Typed directed relation graph',
  'Crux identification with resolution status',
  'Failure-mode flags at claim level',
  'Explicit update conditions per assessment',
]

const pillars = [
  {
    n: '01',
    label: 'Ingestion',
    summary: 'Every source captured with full provenance, credibility, and conflict-of-interest record.',
    items: [
      'Source objects: title, author, venue, credibility, conflict of interest',
      'Extracted claims: verbatim or near-verbatim text tied to a single source',
      'All sources retained regardless of quality or epistemic position',
    ],
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    heading: 'text-blue-800',
    num: 'text-blue-100',
    bullet: 'bg-blue-300',
  },
  {
    n: '02',
    label: 'Structure',
    summary: 'Claims normalized into unambiguous propositions and mapped into a typed directed graph.',
    items: [
      'Normalized claims: scope-explicit propositions with position and confidence',
      'Relation graph: typed directed edges across 10 relation categories',
      'Failure-mode flags: attached to individual claims and sources, queryable across cases',
    ],
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    heading: 'text-amber-800',
    num: 'text-amber-100',
    bullet: 'bg-amber-300',
  },
  {
    n: '03',
    label: 'Assessment',
    summary: 'Crux identification, overall verdict, and concrete update conditions.',
    items: [
      'Cruxes: pivotal questions with resolution status and dependency links',
      'Assessment: settled or unsettled, with named weak links in the dominant argument',
      'Update conditions: concrete scenarios that would change the conclusion',
    ],
    bg: 'bg-green-50',
    border: 'border-green-200',
    heading: 'text-green-800',
    num: 'text-green-100',
    bullet: 'bg-green-400',
  },
]

const cases = [
  {
    href: '/lhc',
    id: 'LHC-2008',
    title: 'LHC Black Holes',
    domain: 'Particle physics / Risk assessment',
    status: 'Largely resolved',
    statusClass: 'badge badge-status-resolved',
    description:
      'A largely resolved technical risk case built from contested theory, astrophysical constraints, institutional review, public concern, and legal challenge.',
    insight:
      'Shows how two independent safety arguments of different epistemic strengths produce a settled verdict with explicitly named weak links.',
    counts: [
      { v: 8, k: 'sources' },
      { v: 12, k: 'norm. claims' },
      { v: 5, k: 'cruxes' },
      { v: 8, k: 'flags' },
    ],
    tags: ['risk assessment', 'theoretical physics', 'public communication'],
  },
  {
    href: '/eggs',
    id: 'EGGS',
    title: 'Dietary Eggs and CVD Risk',
    domain: 'Nutrition science / Epidemiology',
    status: 'Open',
    statusClass: 'badge badge-status-open',
    description:
      'An open-ended public-health evidence case shaped by conflicting observational studies, population heterogeneity, changing dietary guidance, and unresolved methodological questions.',
    insight:
      'Shows how a dispute can remain structurally open even after regulatory guidance has changed and expert opinion has shifted.',
    counts: [
      { v: 8, k: 'sources' },
      { v: 12, k: 'norm. claims' },
      { v: 5, k: 'cruxes' },
      { v: 10, k: 'flags' },
    ],
    tags: ['funding bias', 'observational epidemiology', 'dietary guidelines'],
  },
]

const artifacts = [
  {
    href: '/workflow',
    title: 'Workflow',
    desc: 'Six-stage human-AI pipeline with prompt templates for each stage.',
  },
  {
    href: '/schema',
    title: 'Schema',
    desc: 'JSON Schema Draft 2020-12 specification for all nine object types.',
  },
  {
    href: '/evaluation',
    title: 'Evaluation',
    desc: 'Assessment across four lenses: faithfulness, usefulness, generality, and robustness.',
  },
  {
    href: '/limitations',
    title: 'Limitations',
    desc: 'Structural constraints and failure modes of the current design.',
  },
]

type PipelineNode = {
  type: string
  id: string
  label: string
  meta: string
  card: string
  typeColor: string
  dot: string
  annotation: { text: string; color: string } | null
  connector: string | null
}

function WorkflowPanel() {
  const nodes: PipelineNode[] = [
    {
      type: 'source',
      id: 'src_001',
      label: 'LSAG Report 2008',
      meta: 'credibility: high',
      card: 'border-blue-200 bg-blue-50',
      typeColor: 'text-blue-500',
      dot: 'bg-blue-400',
      annotation: { text: 'COI: CERN institutional', color: 'border-blue-200 bg-blue-50 text-blue-700' },
      connector: 'extracts',
    },
    {
      type: 'extracted_claim',
      id: 'EC_012',
      label: 'LSAG concluded: no catastrophic risk',
      meta: 'verbatim paraphrase',
      card: 'border-slate-200 bg-slate-50',
      typeColor: 'text-slate-400',
      dot: 'bg-slate-300',
      annotation: null,
      connector: 'normalizes to',
    },
    {
      type: 'normalized_claim',
      id: 'NC_012',
      label: 'Safety conclusion',
      meta: 'confidence: high / position: pro',
      card: 'border-slate-300 bg-white',
      typeColor: 'text-slate-500',
      dot: 'bg-slate-400',
      annotation: { text: 'correlated_evidence flag', color: 'border-orange-200 bg-orange-50 text-orange-700' },
      connector: 'supported by relation',
    },
    {
      type: 'relation',
      id: 'R_019',
      label: 'NC_004 supports NC_012',
      meta: 'strength: strong',
      card: 'border-indigo-200 bg-indigo-50',
      typeColor: 'text-indigo-500',
      dot: 'bg-indigo-400',
      annotation: { text: 'CX_004: resolved_true', color: 'border-blue-200 bg-blue-50 text-blue-700' },
      connector: 'produces',
    },
    {
      type: 'assessment',
      id: 'result',
      label: 'status: settled',
      meta: 'weak_links: NC_003, NC_005',
      card: 'border-green-200 bg-green-50',
      typeColor: 'text-green-600',
      dot: 'bg-green-500',
      annotation: null,
      connector: null,
    },
  ]

  return (
    <div className="border border-page-border bg-white p-5">
      <p className="text-xs section-heading mb-5">Example trace: LHC case</p>
      <div>
        {nodes.map((node) => (
          <div key={node.type} className="flex gap-3 items-stretch">
            <div className="flex flex-col items-center w-4 shrink-0">
              <div className={`w-2.5 h-2.5 rounded-full mt-3 shrink-0 ${node.dot}`} />
              {node.connector && (
                <div className="w-px bg-slate-200 flex-1 mt-1" />
              )}
            </div>
            <div className="flex-1 mb-3">
              <div className="flex gap-2 items-start">
                <div className={`flex-1 border px-3 py-2.5 ${node.card}`}>
                  <p className={`text-xs font-mono mb-0.5 ${node.typeColor}`}>
                    {node.type} / {node.id}
                  </p>
                  <p className="text-xs font-semibold text-ink">{node.label}</p>
                  <p className="text-xs text-ink-faint">{node.meta}</p>
                </div>
                {node.annotation && (
                  <div className={`border px-2 py-2 text-xs leading-snug shrink-0 w-28 ${node.annotation.color}`}>
                    {node.annotation.text}
                  </div>
                )}
              </div>
              {node.connector && (
                <p className="text-xs text-ink-faint italic mt-1.5 ml-0.5">{node.connector}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-6">

      {/* HERO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 py-20 border-b border-page-border items-start">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-6">
            FLF Epistemic Case Study Competition
          </p>
          <h1 className="text-5xl font-bold text-ink mb-4 leading-none tracking-tight">
            Epistemic<br />Atlas
          </h1>
          <p className="text-xl text-ink-faint font-light leading-snug mb-6">
            Turning messy disputes into inspectable claim graphs.
          </p>
          <p className="text-sm text-ink-light leading-relaxed mb-3">
            A schema, methodology, and prototype for converting real-world epistemic
            disputes into structured, queryable knowledge bases. Every source, claim,
            relation, crux, and failure mode is typed, linked, and traceable.
          </p>
          <p className="text-sm text-ink-light leading-relaxed mb-9">
            Two partially verified worked examples demonstrate the approach across
            structurally different disputes: one largely resolved, one open.
          </p>
          <ul className="space-y-2.5 mb-10">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                <span className="text-sm text-ink-light">{f}</span>
              </li>
            ))}
          </ul>
          <div className="flex gap-3">
            <Link
              href="/lhc"
              className="inline-flex items-center bg-accent text-white px-5 py-2.5 text-sm font-medium hover:bg-accent-light transition-colors"
            >
              Explore Cases
            </Link>
            <Link
              href="/workflow"
              className="inline-flex items-center border border-page-border text-ink-light px-5 py-2.5 text-sm font-medium hover:text-ink hover:border-ink-faint transition-colors"
            >
              View Workflow
            </Link>
          </div>
        </div>

        <div>
          <WorkflowPanel />
        </div>
      </div>

      {/* WHY STRIP */}
      <div className="py-14 border-b border-page-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-200">
          {[
            {
              n: '01',
              point: 'Most tools summarize disputes.',
              body: 'Summaries collapse provenance, erase reasoning chains, and make prior investigations difficult to inspect or challenge.',
            },
            {
              n: '02',
              point: 'The record of resolution is usually lost.',
              body: 'When a dispute ends, later users cannot see what the conclusion depended on or which evidence was considered weak.',
            },
            {
              n: '03',
              point: 'Epistemic Atlas preserves the full graph.',
              body: 'Not just the verdict: every source, claim, relation, flag, and crux is queryable, challengeable, and reusable.',
            },
          ].map((item, i) => (
            <div
              key={item.n}
              className={`py-8 md:py-0 ${i === 0 ? 'md:pr-8' : i === 1 ? 'md:px-8' : 'md:pl-8'}`}
            >
              <span className="text-xs font-mono text-ink-faint block mb-2">{item.n}</span>
              <p className="text-sm font-semibold text-ink mb-2">{item.point}</p>
              <p className="text-sm text-ink-light leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* THREE-LAYER STACK */}
      <div className="py-16 border-b border-page-border">
        <p className="text-xs section-heading mb-8">Three-Layer Stack</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {pillars.map((p) => (
            <div key={p.n} className={`p-8 border ${p.border} ${p.bg}`}>
              <div className={`text-6xl font-mono font-light leading-none mb-5 select-none ${p.num}`}>
                {p.n}
              </div>
              <h3 className={`text-base font-semibold mb-1.5 ${p.heading}`}>{p.label}</h3>
              <p className="text-sm text-ink-light leading-relaxed mb-5">{p.summary}</p>
              <ul className="space-y-2.5">
                {p.items.map((item) => (
                  <li key={item} className="flex gap-3 items-start">
                    <span className={`w-1 h-1 rounded-full mt-1.5 shrink-0 ${p.bullet}`} />
                    <span className="text-xs text-ink-light leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="text-xs text-ink-faint mt-5 leading-relaxed max-w-2xl">
          Layer 1 objects are never discarded. A low-credibility source is retained and
          flagged, not removed. Missing provenance is recorded as null. The goal is a
          complete audit trail, not a curated summary.
        </p>
      </div>

      {/* WORKED EXAMPLES */}
      <div className="py-16 border-b border-page-border">
        <p className="text-xs section-heading mb-6">Worked Examples</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cases.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="block border border-page-border bg-white hover:border-slate-300 hover:shadow-sm transition-all group"
            >
              <div className="flex items-start justify-between gap-4 p-6 border-b border-page-border">
                <div>
                  <span className="text-xs font-mono text-ink-faint block mb-1">{c.id}</span>
                  <h3 className="text-lg font-semibold text-ink group-hover:text-accent transition-colors leading-snug">
                    {c.title}
                  </h3>
                  <p className="text-xs text-ink-faint mt-0.5">{c.domain}</p>
                </div>
                <span className={`${c.statusClass} shrink-0`}>{c.status}</span>
              </div>
              <div className="p-6">
                <p className="text-sm text-ink-light leading-relaxed mb-3">{c.description}</p>
                <p className="text-xs text-ink-faint italic leading-relaxed mb-5">{c.insight}</p>
                <div className="grid grid-cols-4 gap-3 pb-5 mb-5 border-b border-page-border">
                  {c.counts.map(({ v, k }) => (
                    <div key={k}>
                      <p className="text-2xl font-mono font-light text-ink leading-none mb-1">{v}</p>
                      <p className="text-xs text-ink-faint">{k}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {c.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-ink-faint bg-page-off border border-page-border px-2 py-0.5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
        <p className="text-xs text-ink-faint mt-4 border border-amber-200 bg-amber-50 px-4 py-2.5 max-w-2xl leading-relaxed">
          Both examples are partially verified. All extracted claims carry
          needs_source_verification: true and have not been checked against
          primary source documents.
        </p>
      </div>

      {/* PROJECT ARTIFACTS */}
      <div className="py-16">
        <p className="text-xs section-heading mb-6">Project Artifacts</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {artifacts.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block border border-page-border bg-white p-5 hover:border-slate-300 hover:shadow-sm transition-all group"
            >
              <h3 className="text-sm font-semibold text-ink mb-2 group-hover:text-accent transition-colors">
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
