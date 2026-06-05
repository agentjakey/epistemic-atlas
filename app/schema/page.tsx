import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Schema | Epistemic Atlas',
}

const objectTypes = [
  {
    name: 'Source',
    id: 'src_NNN',
    desc: 'A single consulted document or record. Carries full provenance, credibility, and conflict of interest.',
    key_fields: ['id', 'title', 'type', 'provenance', 'credibility', 'conflict_of_interest', 'retracted'],
  },
  {
    name: 'ExtractedClaim',
    id: 'EC_NNN',
    desc: 'Verbatim or near-verbatim text extracted from one source. Not normalized, not interpreted.',
    key_fields: ['id', 'source_id', 'raw_text', 'location', 'extraction_notes', 'needs_source_verification'],
  },
  {
    name: 'NormalizedClaim',
    id: 'NC_NNN',
    desc: 'An unambiguous, scope-explicit proposition synthesized from one or more extracted claims. Carries position and confidence.',
    key_fields: ['id', 'extracted_claim_ids', 'normalized_text', 'position', 'confidence', 'domain_type', 'failure_mode_flag_ids'],
  },
  {
    name: 'Relation',
    id: 'R_NNN',
    desc: 'A directed, typed, strength-rated edge between two normalized claims.',
    key_fields: ['id', 'from_id', 'to_id', 'type', 'strength', 'notes'],
  },
  {
    name: 'Crux',
    id: 'CX_NNN',
    desc: 'A pivotal question whose resolution would significantly change the epistemic status of the dispute.',
    key_fields: ['id', 'statement', 'description', 'dependent_normalized_claim_ids', 'status', 'resolution_notes'],
  },
  {
    name: 'FailureModeFlag',
    id: 'FF_NNN',
    desc: 'An epistemic failure mode attached to a specific normalized claim or source, with severity and description.',
    key_fields: ['id', 'type', 'applies_to_id', 'applies_to_type', 'severity', 'affects_conclusion', 'description'],
  },
  {
    name: 'Assessment',
    id: '(singleton)',
    desc: 'The overall epistemic verdict. Synthesizes crux status, weak links, and explicit update conditions.',
    key_fields: ['status', 'settled_direction', 'key_crux_ids', 'weak_link_ids', 'dominant_failure_modes', 'what_would_update'],
  },
  {
    name: 'MissingEvidence',
    id: 'ME_NNN',
    desc: 'Evidence that does not currently exist and whose existence would change at least one crux or claim.',
    key_fields: ['id', 'description', 'type', 'would_affect_ids', 'priority', 'feasibility', 'reason_absent'],
  },
  {
    name: 'AuditNote',
    id: 'AN_NNN',
    desc: 'A quality flag left by the adversarial review step. Tracks known issues without suppressing them.',
    key_fields: ['id', 'type', 'description', 'applies_to_ids', 'severity', 'status', 'resolution'],
  },
]

const relationTypes = [
  { type: 'supports', desc: 'A provides evidence or logical justification for B.' },
  { type: 'attacks', desc: 'A contradicts or undermines B.' },
  { type: 'depends_on', desc: 'A is only meaningful if B is true.' },
  { type: 'reframes', desc: 'A changes the interpretive frame of B without directly contradicting it.' },
  { type: 'narrows', desc: 'A restricts the scope or conditions of B.' },
  { type: 'generalizes', desc: 'A extends B to a broader scope or population.' },
  { type: 'duplicates', desc: 'A and B make the same claim from different sources.' },
  { type: 'conflicts_with', desc: 'A and B cannot both be true but neither clearly attacks the other.' },
  { type: 'evidence_for', desc: 'A is direct empirical evidence that B is true.' },
  { type: 'evidence_against', desc: 'A is direct empirical evidence that B is false.' },
]

const failureModes = [
  { type: 'correlated_evidence_treated_as_independent', desc: 'Multiple sources are presented as independent when they share authorship, data, or institutional context.' },
  { type: 'rhetorical_weight_exceeds_evidence', desc: 'Confidence in the claim is higher than the underlying evidence supports.' },
  { type: 'hidden_assumption', desc: 'The claim is only valid conditional on an unstated assumption.' },
  { type: 'source_incentive_pressure', desc: 'The source has a financial or institutional incentive that creates plausible bias in this direction.' },
  { type: 'proxy_measure_problem', desc: 'The claim uses a proxy measure (e.g., LDL as proxy for CVD risk) where the proxy relationship is contested.' },
  { type: 'population_heterogeneity', desc: 'The claim aggregates across subpopulations with meaningfully different outcomes.' },
  { type: 'temporal_drift', desc: 'The claim was true in a prior period but may not hold under current conditions.' },
  { type: 'closed_case_overconfidence', desc: 'The dispute is treated as settled when at least one significant crux remains open.' },
  { type: 'vague_question', desc: 'The claim responds to an imprecisely scoped question, making it true under some interpretations and false under others.' },
  { type: 'analogy_dependency', desc: 'The argument depends on an analogy that may not hold in the target domain.' },
  { type: 'direct_evidence_absent', desc: 'No direct empirical evidence for this claim exists; it rests on inference or extrapolation.' },
  { type: 'expert_consensus_without_dependency_map', desc: 'Expert agreement is cited as evidence without identifying the underlying claims the consensus depends on.' },
]

const exampleJson = `{
  "_meta": {
    "schema_version": "2",
    "case_id": "my-dispute-2024",
    "data_status": "partial"
  },

  "sources": [{
    "id": "src_001",
    "title": "Example Study Title",
    "type": "paper",
    "provenance": {
      "author": ["Jane Smith", "John Doe"],
      "institution": "University of Example",
      "date": "2022",
      "venue": "Nature, vol. 600, pp. 1-10",
      "doi": "10.1038/example.2022.001"
    },
    "credibility": "high",
    "conflict_of_interest": null
  }],

  "extracted_claims": [{
    "id": "EC_001",
    "source_id": "src_001",
    "raw_text": "We found no significant association between X and Y (RR 0.98, 95% CI 0.91-1.05).",
    "needs_source_verification": true
  }],

  "normalized_claims": [{
    "id": "NC_001",
    "extracted_claim_ids": ["EC_001"],
    "normalized_text": "Smith et al. 2022 found no statistically significant association between X and Y in the study population (RR 0.98, 95% CI 0.91-1.05).",
    "domain_type": "empirical",
    "position": "neutral",
    "confidence": { "level": "medium", "notes": "Single prospective study. No replication." },
    "failure_mode_flag_ids": []
  }],

  "relations": [{
    "id": "R_001",
    "from_id": "NC_001",
    "to_id": "NC_002",
    "type": "evidence_against",
    "strength": "moderate",
    "notes": "Null finding weakens the causal hypothesis but does not refute it."
  }],

  "cruxes": [{
    "id": "CX_001",
    "statement": "Does X independently cause Y after controlling for confounders?",
    "description": "If this crux resolves true, the mechanistic hypothesis is supported. If false, the association is likely confounding.",
    "dependent_normalized_claim_ids": ["NC_001", "NC_002"],
    "status": "unresolved"
  }],

  "failure_mode_flags": [{
    "id": "FF_001",
    "type": "direct_evidence_absent",
    "description": "No randomized trial exists. All evidence is observational.",
    "applies_to_id": "NC_001",
    "applies_to_type": "normalized_claim",
    "severity": "significant",
    "affects_conclusion": false
  }],

  "assessment": {
    "status": "unsettled",
    "settled_direction": null,
    "epistemic_status_summary": "The available evidence is observational and underpowered to resolve the causal question.",
    "key_crux_ids": ["CX_001"],
    "weak_link_ids": ["NC_001"],
    "what_would_update": [{
      "scenario": "A well-powered Mendelian randomization study with consistent results across populations.",
      "would_affect_ids": ["CX_001", "NC_001"],
      "direction": "resolve",
      "magnitude": "significant"
    }]
  }
}`

export default function SchemaPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12 pb-10 border-b border-page-border max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-ink-faint mb-5">
          Schema Reference
        </p>
        <h1 className="text-3xl font-bold text-ink mb-4">Epistemic Atlas Schema v2</h1>
        <p className="text-base text-ink-light leading-relaxed mb-4">
          Each atlas entry is split across three JSON files:{' '}
          <code>sources.json</code> (sources only),{' '}
          <code>claims.json</code> (extracted and normalized claims), and{' '}
          <code>graph.json</code> (relations, cruxes, flags, assessment, missing evidence, audit notes).
          The full JSON Schema is in <code>schema/epistemic-atlas.schema.json</code>{' '}
          (JSON Schema Draft 2020-12). Small worked examples are in <code>schema/examples/</code>.
        </p>
        <p className="text-sm text-ink-faint">
          The v2 schema separates extracted claims from normalized claims. This preserves
          verbatim source text while allowing structured normalization, and makes it explicit
          when a single normalized claim is backed by evidence from multiple independent sources.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">

          {/* object types */}
          <section>
            <h2 className="section-heading">Object Types (9)</h2>
            <p className="text-sm text-ink-faint mb-4 leading-relaxed">
              Each object type has its own ID namespace. IDs are strings in the format
              PREFIX_NNN (e.g., NC_001, CX_004). IDs must be unique within a case.
            </p>
            <div className="border border-page-border">
              {objectTypes.map((obj, i) => (
                <div
                  key={obj.name}
                  className={`p-4 grid grid-cols-12 gap-4 ${
                    i < objectTypes.length - 1 ? 'border-b border-page-border' : ''
                  }`}
                >
                  <div className="col-span-12 lg:col-span-3">
                    <code className="text-xs font-semibold text-accent block mb-1">{obj.name}</code>
                    <span className="text-xs text-ink-faint font-mono">{obj.id}</span>
                  </div>
                  <div className="col-span-12 lg:col-span-5">
                    <p className="text-xs text-ink-light leading-relaxed">{obj.desc}</p>
                  </div>
                  <div className="col-span-12 lg:col-span-4">
                    <div className="flex flex-wrap gap-1">
                      {obj.key_fields.map((f) => (
                        <code key={f} className="text-xs text-ink-faint border border-page-border px-1.5 py-0.5">
                          {f}
                        </code>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* relation types */}
          <section>
            <h2 className="section-heading">Relation Types (10)</h2>
            <p className="text-sm text-ink-faint mb-4">
              Relations are directed. Direction matters: "A supports B" is not "B supports A."
              Strength is rated strong / moderate / weak.
            </p>
            <div className="border border-page-border">
              {relationTypes.map((r, i) => (
                <div
                  key={r.type}
                  className={`p-4 flex gap-6 ${i < relationTypes.length - 1 ? 'border-b border-page-border' : ''}`}
                >
                  <code className="text-xs font-semibold text-accent w-40 shrink-0 pt-0.5">
                    {r.type}
                  </code>
                  <p className="text-xs text-ink-light leading-relaxed">{r.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* JSON example */}
          <section>
            <h2 className="section-heading">Minimal valid example (graph.json)</h2>
            <p className="text-sm text-ink-faint mb-4">
              A single case with one source, one extracted claim, one normalized claim,
              one relation, one crux, one failure mode flag, and an assessment. All three
              files (sources.json, claims.json, graph.json) share the same _meta wrapper.
            </p>
            <div className="bg-page-off border border-page-border p-4 overflow-x-auto">
              <pre className="text-xs text-ink-light font-mono leading-relaxed whitespace-pre">
                {exampleJson}
              </pre>
            </div>
          </section>
        </div>

        <div className="space-y-10">

          {/* failure mode vocabulary */}
          <section>
            <h2 className="section-heading">Failure mode types (12)</h2>
            <p className="text-xs text-ink-faint mb-4 leading-relaxed">
              Flags attach to individual claims or sources, not to the case as a whole.
              This granularity enables cross-case pattern queries.
            </p>
            <div className="space-y-3">
              {failureModes.map((fm) => (
                <div key={fm.type} className="border border-page-border p-3">
                  <span className="badge badge-flag mb-1.5 block w-fit">
                    {fm.type.replace(/_/g, ' ')}
                  </span>
                  <p className="text-xs text-ink-faint leading-relaxed">{fm.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* enums */}
          <section>
            <h2 className="section-heading">Key enums</h2>
            <div className="space-y-4 text-xs">
              <div>
                <p className="text-ink font-semibold mb-1">position</p>
                <div className="flex flex-wrap gap-1">
                  {['pro', 'con', 'neutral', 'conditional', 'methodological'].map((v) => (
                    <code key={v} className="text-ink-faint border border-page-border px-1.5 py-0.5">{v}</code>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-ink font-semibold mb-1">confidence.level</p>
                <div className="flex flex-wrap gap-1">
                  {['high', 'medium', 'low', 'speculative'].map((v) => (
                    <code key={v} className="text-ink-faint border border-page-border px-1.5 py-0.5">{v}</code>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-ink font-semibold mb-1">crux status</p>
                <div className="flex flex-wrap gap-1">
                  {['unresolved', 'resolved_true', 'resolved_false', 'empirically_underdetermined', 'theoretically_underdetermined'].map((v) => (
                    <code key={v} className="text-ink-faint border border-page-border px-1.5 py-0.5">{v}</code>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-ink font-semibold mb-1">assessment status</p>
                <div className="flex flex-wrap gap-1">
                  {['settled', 'unsettled', 'partially_settled'].map((v) => (
                    <code key={v} className="text-ink-faint border border-page-border px-1.5 py-0.5">{v}</code>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-ink font-semibold mb-1">data_status</p>
                <div className="space-y-1.5">
                  {[
                    { status: 'verified', cls: 'badge badge-data-verified', desc: 'All claims checked against primary sources.' },
                    { status: 'partial', cls: 'badge badge-data-partial', desc: 'Some claims verified, some not.' },
                    { status: 'sample', cls: 'badge badge-data-sample', desc: 'Illustrative only.' },
                  ].map((item) => (
                    <div key={item.status} className="flex gap-2 items-start">
                      <span className={item.cls}>{item.status}</span>
                      <p className="text-ink-faint leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* file structure */}
          <section>
            <h2 className="section-heading">File layout</h2>
            <div className="bg-page-off border border-page-border p-4">
              <div className="space-y-1 text-xs font-mono text-ink-faint">
                <p>data/</p>
                <p className="pl-4">lhc/</p>
                <p className="pl-8">sources.json</p>
                <p className="pl-8">claims.json</p>
                <p className="pl-8">graph.json</p>
                <p className="pl-4">eggs/</p>
                <p className="pl-8">sources.json</p>
                <p className="pl-8">claims.json</p>
                <p className="pl-8">graph.json</p>
                <p className="mt-3">schema/</p>
                <p className="pl-4">epistemic-atlas.schema.json</p>
                <p className="pl-4">GUIDE.md</p>
                <p className="pl-4">examples/</p>
                <p className="pl-8">lhc_black_holes.json</p>
                <p className="pl-8">eggs.json</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
