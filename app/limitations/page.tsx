import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Limitations -- Epistemic Atlas',
}

const sections = [
  {
    heading: 'Schema limitations',
    items: [
      {
        title: 'Atomicity is an ideal, not a guarantee.',
        body: 'The requirement that each claim be atomic is a target standard, not always achievable. Many real-world claims bundle multiple propositions, and deciding where to split them involves judgment that the schema does not fully systematize. Different annotators will produce different decompositions for the same source text.',
      },
      {
        title: 'Normalization introduces interpretation.',
        body: 'The gap between the raw claim and the normalized claim is where interpretive work happens. The schema preserves both forms, but there is no automated check that the normalized form accurately captures the raw form. Normalization bias is a real failure mode that the adversarial review catches partially, not completely.',
      },
      {
        title: 'Relation strength is subjective.',
        body: 'The strong/moderate/weak scale is not formally defined. Two annotators working from the same source material will often assign different strengths to the same relation. The schema records judgment but does not calibrate it.',
      },
      {
        title: 'The failure mode vocabulary is incomplete.',
        body: 'The 17-item failure flag list does not exhaust the space of epistemic failure modes. It reflects pragmatic coverage of common patterns. Adding new flags without disciplined definition risks making the taxonomy unusable.',
      },
    ],
  },
  {
    heading: 'Coverage limitations',
    items: [
      {
        title: 'The atlas only knows what its sources know.',
        body: 'If the consulted sources do not include a significant position, that position is absent from the atlas. Source selection is a major determinant of what the atlas represents, and there is no automated completeness check.',
      },
      {
        title: 'Translation across technical domains is hard.',
        body: 'The pipeline works best on disputes where primary claims are stated in ordinary language or can be accurately paraphrased. Disputes turning on highly technical mathematical or empirical claims require domain expertise that cannot be fully offloaded to the pipeline.',
      },
      {
        title: 'Disputes evolve; the atlas does not automatically update.',
        body: 'The schema represents a dispute at a point in time. New evidence emerges, positions shift, cruxes get resolved. The schema records created/updated dates at the entry level, but has no native versioning mechanism.',
      },
    ],
  },
  {
    heading: 'Process limitations',
    items: [
      {
        title: 'LLM hallucination.',
        body: 'When the pipeline is executed with LLM assistance, the LLM may generate claims, sources, or relations not supported by the actual source material. The adversarial review step is designed to catch this but is not a guarantee. Any LLM-assisted entry should be treated as requiring human verification of every source reference and claim attribution.',
      },
      {
        title: 'Adversarial review quality depends on reviewer quality.',
        body: 'An adversarial reviewer who shares the same biases as the original annotator will not catch those biases. Ideally, the adversarial review is done by someone with no prior involvement in building the entry.',
      },
      {
        title: 'Crux identification requires epistemic sophistication.',
        body: 'This step is most dependent on judgment. A reviewer unfamiliar with the structure of arguments in the domain may miss load-bearing claims or misidentify pivotal questions.',
      },
    ],
  },
  {
    heading: 'Structural limitations',
    items: [
      {
        title: 'The schema is a graph, not a formal logic.',
        body: 'Relation types (supports, attacks, etc.) are not formally defined in a logical system. This makes the atlas more accessible but means that consistency checks are informal. There is no automated detection of transitively inconsistent claims.',
      },
      {
        title: 'Missing evidence is underconstrained.',
        body: 'Everything is technically missing evidence for something. The schema leaves it to the annotator to decide what missing evidence is significant enough to record, which introduces variability between entries.',
      },
      {
        title: 'No uncertainty quantification.',
        body: 'Confidence levels are ordinal categories, not probability estimates. They capture rough epistemic status but do not support formal uncertainty propagation across the graph. A claim with "medium" confidence that depends on a "low" confidence claim has no derived confidence level.',
      },
    ],
  },
]

const notFor = [
  'Producing authoritative verdicts on active scientific disputes.',
  'Replacing domain expert review in high-stakes policy contexts.',
  'Any use case requiring the entry to be fully verified against primary sources -- check the data_status fields.',
  'Generating legally or medically actionable conclusions.',
]

export default function LimitationsPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12 pb-10 border-b border-page-border max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-ink-faint mb-5">
          Honest accounting
        </p>
        <h1 className="text-3xl font-bold text-ink mb-4">Limitations</h1>
        <p className="text-base text-ink-light leading-relaxed">
          This page is an honest account of what Epistemic Atlas does not do well,
          where its design choices involve real tradeoffs, and what failure modes
          the system itself is susceptible to. It is part of the submission, not
          an afterthought.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-base font-semibold text-ink mb-6 pb-2 border-b border-page-border">
                {section.heading}
              </h2>
              <div className="space-y-6">
                {section.items.map((item) => (
                  <div key={item.title}>
                    <h3 className="text-sm font-semibold text-ink mb-2">{item.title}</h3>
                    <p className="text-sm text-ink-light leading-relaxed">{item.body}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="section-heading">What this should not be used for</h2>
            <div className="border border-page-border">
              {notFor.map((item, i) => (
                <div
                  key={i}
                  className={`p-4 flex gap-3 ${i < notFor.length - 1 ? 'border-b border-page-border' : ''}`}
                >
                  <span className="text-red-300 shrink-0 mt-0.5">--</span>
                  <p className="text-sm text-ink-light leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="section-heading">Design tradeoffs</h2>
            <div className="space-y-4 text-sm text-ink-faint">
              <div>
                <p className="font-semibold text-ink mb-1">Accessibility vs. formalism</p>
                <p className="leading-relaxed">
                  Using prose-level relation types (supports, attacks) instead of
                  first-order logic predicates makes the schema more accessible but
                  sacrifices formal consistency checking.
                </p>
              </div>
              <div>
                <p className="font-semibold text-ink mb-1">Coverage vs. depth</p>
                <p className="leading-relaxed">
                  Building two partially verified case studies demonstrates reuse better
                  than building one fully verified case study. The tradeoff is that
                  neither case study is a gold-standard verified record.
                </p>
              </div>
              <div>
                <p className="font-semibold text-ink mb-1">JSON vs. ontology</p>
                <p className="leading-relaxed">
                  JSON Schema is more accessible than OWL or RDF but does not support
                  the kind of semantic reasoning that a formal ontology enables. The
                  choice prioritized adoption potential over expressive power.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
