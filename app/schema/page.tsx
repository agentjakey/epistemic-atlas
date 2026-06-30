import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Schema | Epistemic Atlas',
}

const objectTypes = [
  {
    name: 'Source',
    id: 'src_NNN',
    desc: 'Core layer. A single consulted document or record. Carries full provenance, credibility, and conflict of interest.',
    key_fields: ['id', 'title', 'type', 'provenance', 'credibility', 'conflict_of_interest', 'needs_source_verification'],
  },
  {
    name: 'ExtractedClaim',
    id: 'EC_NNN',
    desc: 'Core layer. Verbatim or near-verbatim text extracted from one source. Not normalized, not interpreted.',
    key_fields: ['id', 'source_id', 'raw_text', 'location', 'extraction_notes', 'needs_source_verification'],
  },
  {
    name: 'NormalizedClaim',
    id: 'NC_NNN',
    desc: 'Core layer. An unambiguous, scope-explicit proposition synthesized from one or more extracted claims. Carries position and confidence.',
    key_fields: ['id', 'extracted_claim_ids', 'normalized_text', 'position', 'confidence', 'domain_type', 'failure_mode_flag_ids'],
  },
  {
    name: 'Relation',
    id: 'R_NNN',
    desc: 'Core layer. A directed edge between two normalized claims, grouped into one of five families, with a basis recording how the link is grounded.',
    key_fields: ['id', 'from_id', 'to_id', 'family', 'subtype', 'basis', 'strength', 'needs_source_verification'],
  },
  {
    name: 'AssessmentLayer',
    id: 'assessment_layer',
    desc: 'Container for the interpretive layer. Groups the objects below: cruxes, failure mode flags, missing evidence, assessments, reviews, and audit notes.',
    key_fields: ['cruxes', 'failure_mode_flags', 'missing_evidence', 'assessments', 'reviews', 'audit_notes'],
  },
  {
    name: 'Crux',
    id: 'CX_NNN',
    desc: 'Assessment layer. A pivotal question whose resolution would significantly change the epistemic status of the dispute.',
    key_fields: ['id', 'statement', 'dependent_normalized_claim_ids', 'status', 'resolution_notes', 'triggers'],
  },
  {
    name: 'FailureModeFlag',
    id: 'FF_NNN',
    desc: 'Assessment layer. An epistemic failure mode attached to a specific normalized claim, source, or relation, with severity and description.',
    key_fields: ['id', 'type', 'applies_to_id', 'applies_to_type', 'severity', 'affects_conclusion'],
  },
  {
    name: 'MissingEvidence',
    id: 'ME_NNN',
    desc: 'Assessment layer. Evidence that does not currently exist and whose existence would change at least one crux or claim.',
    key_fields: ['id', 'description', 'type', 'would_affect_ids', 'priority', 'feasibility', 'triggers'],
  },
  {
    name: 'Assessment',
    id: 'AS_NNN',
    desc: 'Assessment layer. One overall epistemic assessment. The layer holds an assessments array, so more than one assessment can sit over the same graph.',
    key_fields: ['id', 'author', 'perspective', 'status', 'weak_link_ids', 'sensitivity', 'what_would_update'],
  },
  {
    name: 'Review',
    id: 'RV_NNN',
    desc: 'Assessment layer. A record that a real collaborator, adversary, or domain expert reviewed the entry. Stays empty unless an actual review happened.',
    key_fields: ['id', 'assessor', 'role', 'summary', 'dissents_from_ids'],
  },
  {
    name: 'AuditNote',
    id: 'AN_NNN',
    desc: 'Assessment layer. A quality flag left by the adversarial audit step. Tracks known issues without suppressing them.',
    key_fields: ['id', 'type', 'description', 'applies_to_ids', 'severity', 'status', 'triggers'],
  },
]

const relationFamilies = [
  { type: 'supports', desc: 'A raises the credibility of B, by logical justification or empirical evidence. Absorbs the older supports and evidence_for.' },
  { type: 'opposes', desc: 'A lowers the credibility of B or stands in tension with it. Absorbs the older attacks, evidence_against, and conflicts_with.' },
  { type: 'depends_on', desc: 'A is only meaningful or true if B is true.' },
  { type: 'contextualizes', desc: 'A reframes, narrows, or generalizes B without simply supporting or opposing it.' },
  { type: 'equivalent', desc: 'A and B make the same claim, usually from different sources. Absorbs the older duplicates.' },
]

const relationBasis = [
  { type: 'asserted_in_source', desc: 'A single source states the relation directly.' },
  { type: 'asserted_by_later_source', desc: 'A later source explicitly draws the connection between earlier claims.' },
  { type: 'inferred_across_sources', desc: 'Synthesized by comparing several sources, none of which states it outright.' },
  { type: 'analyst_inferred', desc: 'The annotator\'s own logical inference, not stated by any source.' },
  { type: 'unclear', desc: 'The grounding has not been determined.' },
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
    "schema_version": "3",
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
    "conflict_of_interest": null,
    "needs_source_verification": true
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
    "family": "opposes",
    "subtype": "empirical",
    "basis": "analyst_inferred",
    "strength": "moderate",
    "notes": "Null finding lowers the credibility of the causal hypothesis but does not refute it.",
    "needs_source_verification": true
  }],

  "assessment_layer": {
    "cruxes": [{
      "id": "CX_001",
      "statement": "Does X independently cause Y after controlling for confounders?",
      "description": "If this crux resolves true, the mechanistic hypothesis is supported. If false, the association is likely confounding.",
      "dependent_normalized_claim_ids": ["NC_001", "NC_002"],
      "status": "unresolved",
      "triggers": ["reassess"]
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

    "missing_evidence": [],

    "assessments": [{
      "id": "AS_001",
      "author": null,
      "perspective": "primary builder",
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
    }],

    "reviews": [],

    "audit_notes": []
  }
}`

export default function SchemaPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12 pb-10 border-b border-page-border max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-ink-faint mb-5">
          Schema Reference
        </p>
        <h1 className="text-3xl font-bold text-ink mb-4">Epistemic Atlas Schema v3</h1>
        <p className="text-base text-ink-light leading-relaxed mb-4">
          Each atlas entry is split across three JSON files:{' '}
          <code>sources.json</code> (sources only),{' '}
          <code>claims.json</code> (extracted and normalized claims), and{' '}
          <code>graph.json</code> (the relations array and the <code>assessment_layer</code>:
          cruxes, failure mode flags, missing evidence, assessments, reviews, and audit notes).
          The full JSON Schema is in <code>schema/epistemic-atlas.schema.json</code>{' '}
          (JSON Schema Draft 2020-12). Small worked examples are in <code>schema/examples/</code>.
        </p>
        <p className="text-sm text-ink-light leading-relaxed mb-4">
          v3 separates a core knowledge layer (sources, extracted claims, normalized claims,
          relations) from a more subjective assessment layer (cruxes, failure mode flags,
          missing evidence, assessments, reviews, audit notes). It replaces the older ten
          relation types with five broad families plus an optional subtype and tags, and records
          how each relation is grounded with a <code>basis</code> field. The assessment layer
          holds an <code>assessments</code> array and a <code>reviews</code> array, so more than
          one assessment or an adversarial review can sit over the same core graph.
        </p>
        <p className="text-sm text-ink-faint">
          The schema intentionally avoids a hard support versus evidence split, because real
          evidential support often combines empirical observations, theoretical assumptions,
          source interpretation, and analyst judgment. For how the schema relates to existing
          provenance and argument formats, see <code>docs/prior_art_mapping.md</code>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">

          {/* object types */}
          <section>
            <h2 className="section-heading">Object Types</h2>
            <p className="text-sm text-ink-faint mb-4 leading-relaxed">
              Each object type has its own ID namespace. IDs are strings in the format
              PREFIX_NNN (e.g., NC_001, CX_004) and must be unique within a case. The objects
              divide into a core knowledge layer and an assessment layer, marked in each
              description.
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

          {/* relation families */}
          <section>
            <h2 className="section-heading">Relation Families (5)</h2>
            <p className="text-sm text-ink-faint mb-4">
              Relations are directed. Direction matters: "A supports B" is not "B supports A."
              v3 uses five broad families instead of a long list of fixed types. Finer
              distinctions go into an optional subtype and tags rather than into more family
              names. Strength is rated strong / moderate / weak.
            </p>
            <div className="border border-page-border">
              {relationFamilies.map((r, i) => (
                <div
                  key={r.type}
                  className={`p-4 flex gap-6 ${i < relationFamilies.length - 1 ? 'border-b border-page-border' : ''}`}
                >
                  <code className="text-xs font-semibold text-accent w-40 shrink-0 pt-0.5">
                    {r.type}
                  </code>
                  <p className="text-xs text-ink-light leading-relaxed">{r.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-ink-faint mt-6 mb-3">
              Each relation also records a <code>basis</code>: how the link is grounded, so a
              reader can tell what a source actually said from what an analyst inferred. In the
              current worked examples every relation is <code>inferred_across_sources</code> and
              still marked <code>needs_source_verification</code>.
            </p>
            <div className="border border-page-border">
              {relationBasis.map((r, i) => (
                <div
                  key={r.type}
                  className={`p-4 flex gap-6 ${i < relationBasis.length - 1 ? 'border-b border-page-border' : ''}`}
                >
                  <code className="text-xs font-semibold text-accent w-48 shrink-0 pt-0.5">
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
              A single case with one source, one extracted claim, one normalized claim, one
              relation, and an <code>assessment_layer</code> holding one crux, one failure mode
              flag, and one assessment. All three files (sources.json, claims.json, graph.json)
              share the same _meta wrapper.
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
                <p className="text-ink font-semibold mb-1">relation family</p>
                <div className="flex flex-wrap gap-1">
                  {['supports', 'opposes', 'depends_on', 'contextualizes', 'equivalent'].map((v) => (
                    <code key={v} className="text-ink-faint border border-page-border px-1.5 py-0.5">{v}</code>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-ink font-semibold mb-1">relation basis</p>
                <div className="flex flex-wrap gap-1">
                  {['asserted_in_source', 'asserted_by_later_source', 'inferred_across_sources', 'analyst_inferred', 'unclear'].map((v) => (
                    <code key={v} className="text-ink-faint border border-page-border px-1.5 py-0.5">{v}</code>
                  ))}
                </div>
              </div>
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
