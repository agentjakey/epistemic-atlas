import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Evaluation -- Epistemic Atlas',
}

const dimensions = [
  {
    n: '01',
    title: 'Provenance preservation',
    question: 'Can every claim be traced to its source without ambiguity?',
    howAddressed: 'Every claim links to a source object. Every source carries full provenance metadata. Missing provenance is represented as null, not omitted silently.',
    evidence: 'See the sources arrays in both case studies. The conflict_of_interest field is populated where relevant.',
    strength: 'Strong',
    gap: null,
  },
  {
    n: '02',
    title: 'Structural completeness',
    question: 'Does the representation capture support, attack, dependency, and qualification relations?',
    howAddressed: 'Six relation types with direction and strength ratings. The relation graph is directed, typed, and queryable.',
    evidence: 'See the relations arrays in both case studies. The LHC graph has 9 relations; the eggs graph has 8.',
    strength: 'Strong',
    gap: 'No visual graph renderer in the current prototype. Relations are displayed as a structured list.',
  },
  {
    n: '03',
    title: 'Failure mode detection',
    question: 'Are epistemic failure modes identified at the claim level, not just the case level?',
    howAddressed: 'A 17-item failure flag vocabulary attaches to individual claims. Flags are applied only where clearly present in the source material.',
    evidence: 'In the eggs case: C106 flags funding_bias and cherry_picking. In the LHC case: C005 and C007 flag scope_creep and overgeneralization.',
    strength: 'Strong',
    gap: 'The failure flag vocabulary is incomplete. It covers common failure modes but does not exhaust the space.',
  },
  {
    n: '04',
    title: 'Crux explicitness',
    question: 'Are the pivotal questions made explicit rather than buried?',
    howAddressed: 'Cruxes are first-class objects with IDs, resolution status, and dependency links to claims. The two cases demonstrate different crux structures: one largely resolved (LHC), one still open (eggs).',
    evidence: 'CX001-CX002 in the LHC case; CX101-CX103 in the eggs case.',
    strength: 'Strong',
    gap: null,
  },
  {
    n: '05',
    title: 'Honest incompleteness',
    question: 'Does the system represent what is not known as well as what is?',
    howAddressed: 'Missing evidence is a first-class category with type, priority, and affect-IDs. The data_status field distinguishes verified from sample data. The Limitations page is a candid accounting.',
    evidence: 'See missing_evidence arrays in both cases. ME101 in eggs (the infeasible RCT) is an example of evidence that is missing for structural reasons, not just absence of citation.',
    strength: 'Strong',
    gap: 'Confidence levels are ordinal (high/medium/low), not probabilistic. No formal uncertainty propagation across the graph.',
  },
]

const selfAssessment = [
  {
    question: 'Does the submission identify genuine epistemic failure modes?',
    answer: 'Yes, at two levels: case-level (paradigm cases of failure) and claim-level (flags on individual claims).',
  },
  {
    question: 'Does it produce a reusable artifact?',
    answer: 'Yes. The schema is a reusable specification. The pipeline is parameterized and transferable. The prototype demonstrates reuse across two substantively different cases.',
  },
  {
    question: 'Does it handle provenance rigorously?',
    answer: 'Yes. Provenance is a first-class field with conflict of interest, credibility assessment, and explicit null representation for missing fields.',
  },
  {
    question: 'Does it surface cruxes?',
    answer: 'Yes. Cruxes are first-class objects with resolution status tracking and dependency links.',
  },
  {
    question: 'Does it represent uncertainty honestly?',
    answer: 'Yes. Confidence levels, missing evidence, and the data_status field all contribute. The limitations page is an honest account of what the uncertainty representation does not capture.',
  },
]

const weaknesses = [
  {
    area: 'Primary source verification',
    detail: 'The case study data is partially verified. Claims marked data_status: partial have not been checked against primary sources. A stronger submission would have every claim verified.',
  },
  {
    area: 'Graph visualization',
    detail: 'Relations are displayed as a structured list. A force-directed or DAG visualization would make the graph structure more legible.',
  },
  {
    area: 'Quantified uncertainty',
    detail: 'Confidence levels are ordinal, not probabilistic. No uncertainty propagation across the relation graph is supported.',
  },
  {
    area: 'Cross-dispute comparison',
    detail: 'The schema supports it in principle, but the prototype does not demonstrate it. Showing that funding bias appears in similar structural positions across multiple disputes would be a meaningful finding.',
  },
]

export default function EvaluationPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12 pb-10 border-b border-page-border max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-ink-faint mb-5">
          Self-assessment
        </p>
        <h1 className="text-3xl font-bold text-ink mb-4">Evaluation</h1>
        <p className="text-base text-ink-light leading-relaxed">
          This page maps the submission against five evaluation dimensions and
          provides an honest self-assessment. See also{' '}
          <Link href="/limitations" className="text-accent hover:underline">
            Limitations
          </Link>{' '}
          for structural weaknesses.
        </p>
      </div>

      <div className="mb-16">
        <h2 className="section-heading">Five dimensions</h2>
        <div className="space-y-0">
          {dimensions.map((d) => (
            <div key={d.n} className="py-8 border-b border-page-border grid grid-cols-12 gap-8">
              <div className="col-span-1">
                <span className="text-2xl font-mono font-light text-ink-faint">{d.n}</span>
              </div>
              <div className="col-span-11 lg:col-span-3">
                <h3 className="text-sm font-semibold text-ink mb-1">{d.title}</h3>
                <p className="text-xs text-ink-faint leading-relaxed italic">{d.question}</p>
                <div className="mt-3">
                  <span className={`badge ${
                    d.strength === 'Strong' ? 'badge-conf-high' : 'badge-conf-medium'
                  }`}>{d.strength}</span>
                </div>
              </div>
              <div className="col-span-11 lg:col-span-5">
                <p className="text-xs section-heading">How addressed</p>
                <p className="text-sm text-ink-light leading-relaxed">{d.howAddressed}</p>
                <p className="text-xs text-ink-faint mt-3 leading-relaxed">
                  {d.evidence}
                </p>
              </div>
              <div className="col-span-11 lg:col-span-3">
                {d.gap ? (
                  <>
                    <p className="text-xs section-heading">Gap</p>
                    <p className="text-sm text-ink-faint leading-relaxed">{d.gap}</p>
                  </>
                ) : (
                  <p className="text-xs text-green-700 bg-green-50 border border-green-100 px-3 py-2">
                    No significant gap identified.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-16">
        <h2 className="section-heading">Judging criteria Q&amp;A</h2>
        <div className="border border-page-border">
          {selfAssessment.map((item, i) => (
            <div
              key={i}
              className={`p-5 grid grid-cols-12 gap-6 ${i < selfAssessment.length - 1 ? 'border-b border-page-border' : ''}`}
            >
              <div className="col-span-12 lg:col-span-5">
                <p className="text-sm font-medium text-ink">{item.question}</p>
              </div>
              <div className="col-span-12 lg:col-span-7">
                <p className="text-sm text-ink-light leading-relaxed">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="section-heading">Known weaknesses</h2>
        <div className="space-y-4">
          {weaknesses.map((w) => (
            <div key={w.area} className="flex gap-6 p-4 border border-page-border">
              <div className="w-48 shrink-0">
                <p className="text-sm font-semibold text-ink">{w.area}</p>
              </div>
              <p className="text-sm text-ink-light leading-relaxed">{w.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
