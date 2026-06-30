import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Workflow | Epistemic Atlas',
}

const stages = [
  {
    n: '01',
    title: 'Scope the question',
    layer: 'Framing',
    prompts: ['prompts/01_scope.md'],
    goal: 'Define the central dispute as a single, well-formed question before collecting any sources. A poorly scoped question produces a poorly scoped atlas entry.',
    rules: [
      'The question must be disputable. Not "was X ever true" but "under what conditions is X true and what would resolve the dispute."',
      'Name the populations, time periods, and conditions that are in scope. Vagueness here propagates through every later stage.',
      'Do not pre-answer the question. The scope statement is epistemic framing, not a preliminary verdict.',
      'Do not produce cruxes or an assessment here. The scope can also be revisited later (the rescope trigger).',
    ],
    output: 'case skeleton: id, title, domain, status, summary (draft)',
  },
  {
    n: '02',
    title: 'Ingest sources',
    layer: 'Core knowledge layer',
    prompts: ['prompts/02_source_ingestion.md'],
    goal: 'Build the sources array with full provenance metadata before extracting any claims.',
    rules: [
      'Capture every consulted source regardless of apparent quality. Low-credibility sources are not discarded.',
      'Do not invent or guess any provenance field. Set missing fields to null explicitly.',
      'Assign credibility based on source type and venue, not on whether the content agrees with other sources.',
      'Set needs_source_verification true when provenance has not been checked against the source itself.',
    ],
    output: 'sources[]: id, title, type, provenance, credibility, conflict_of_interest, needs_source_verification',
  },
  {
    n: '03',
    title: 'Extract claims',
    layer: 'Core knowledge layer',
    prompts: ['prompts/03_claim_extraction.md'],
    goal: 'Capture each significant claim as an extracted claim that stays close to the source. Do not normalize, merge, relate, or assess here.',
    rules: [
      'Each extracted claim belongs to exactly one source. Preserve hedges, quantification, and scope qualifiers exactly.',
      'Record verbatim text or a minimal meaning-preserving paraphrase in raw_text.',
      'Mark needs_source_verification true when raw_text is a paraphrase or has not been checked.',
      'Do not invent claims or metadata the source does not provide.',
    ],
    output: 'extracted_claims[]: id (EC_NNN), source_id, raw_text, location, speaker, needs_source_verification',
  },
  {
    n: '04',
    title: 'Normalize claims',
    layer: 'Core knowledge layer',
    prompts: ['prompts/04_claim_normalization.md'],
    goal: 'Turn extracted claims into unambiguous, scope-explicit propositions that link back to the extracted claims they came from.',
    rules: [
      'Link every normalized claim to one or more extracted_claim_ids.',
      'Make scope and quantification explicit and preserve hedges. Do not make a claim stronger than its sources support.',
      'Merge only genuinely equivalent claims. Preserve meaningful disagreements and population or context limits.',
      'Assign a position and a confidence level (high, medium, low, speculative).',
    ],
    output: 'normalized_claims[]: id (NC_NNN), extracted_claim_ids, normalized_text, domain_type, position, confidence',
  },
  {
    n: '05',
    title: 'Map relations',
    layer: 'Core knowledge layer',
    prompts: ['prompts/05_relation_mapping.md'],
    goal: 'Connect normalized claims with a small, clear directed graph using five relation families, recording how each link is grounded.',
    rules: [
      'Relations are directed: "A supports B" is not "B supports A." Prefer fewer, clearer relations over graph noise.',
      'Use the five families: supports, opposes, depends_on, contextualizes, equivalent. Put finer distinctions in subtype or tags.',
      'Record basis: asserted_in_source, asserted_by_later_source, inferred_across_sources, analyst_inferred, or unclear.',
      'Default needs_source_verification to true when the grounding is uncertain.',
    ],
    output: 'relations[]: id, from_id, to_id, family, subtype, basis, strength, notes, needs_source_verification',
  },
  {
    n: '06',
    title: 'Build the assessment layer',
    layer: 'Assessment layer',
    prompts: ['prompts/06_assessment_layer.md'],
    goal: 'Build the interpretive layer on top of the core structure: cruxes, failure mode flags, missing evidence, and one or more assessments. This layer is more subjective and can hold more than one view of the same graph.',
    rules: [
      'Cruxes are load-bearing, not merely contested. Failure mode flags attach to specific claims, sources, or relations and are applied symmetrically.',
      'Use assessments[] even for a single assessment. Record author, perspective, weak links, sensitivity, and concrete what_would_update scenarios.',
      'Leave reviews[] empty unless a real collaborator, adversary, or domain expert reviewed the entry. Do not fabricate reviews.',
      'Add triggers (rescope, reingest, reextract, renormalize, remap_relations, reassess, re_review) only where an item clearly implies a next action.',
    ],
    output: 'assessment_layer: cruxes[], failure_mode_flags[], missing_evidence[], assessments[], reviews[], audit_notes[]',
  },
  {
    n: '07',
    title: 'Adversarial audit',
    layer: 'Assessment layer',
    prompts: ['prompts/07_adversarial_audit.md'],
    goal: 'Actively try to break the completed entry. Check extraction faithfulness, normalization drift, relation grounding, asymmetric flagging, crux quality, and whether the assessment layer overstates what the core layer supports.',
    rules: [
      'Check that extracted claims stay faithful to sources and that normalized claims do not overstate them.',
      'Check that each relation basis is honest and that inferred relations carry notes that make the inference checkable.',
      'Check that the assessment does not lean on analyst-inferred or unverified relations as if they were established.',
      'Record unresolved issues as open audit notes, with triggers where a fix is implied. A known open issue is better than a silent inaccuracy.',
    ],
    output: 'audit_notes[] in assessment_layer: id, type, description, applies_to_ids, severity, status, triggers',
  },
]

export default function WorkflowPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12 pb-10 border-b border-page-border max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-ink-faint mb-5">
          Methodology
        </p>
        <h1 className="text-3xl font-bold text-ink mb-4">The Atlas Workflow</h1>
        <p className="text-base text-ink-light leading-relaxed mb-4">
          The workflow converts raw source material into a structured atlas entry. Stages 2
          through 5 build the <strong>core knowledge layer</strong> (sources, extracted claims,
          normalized claims, and relations), which is meant to be relatively reusable and
          source-grounded. Stage 6 builds the <strong>assessment layer</strong> (cruxes, failure
          mode flags, missing evidence, and assessments), which is more interpretive and
          contestable. Stage 7 audits the whole entry. Each stage has a prompt template in the{' '}
          <code>prompts/</code> directory.
        </p>
        <p className="text-base text-ink-light leading-relaxed">
          The order below is a default starting path, not a strict one-way pipeline. A new
          crux, a missing-evidence item, an audit note, or a newly found source can send the
          work back to rescope, reingest, re-extract, renormalize, remap relations, or reassess.
          See <code>docs/living_workflow.md</code> for how the loop works.
        </p>
      </div>

      <div className="space-y-0">
        {stages.map((stage) => (
          <div
            key={stage.n}
            className="grid grid-cols-12 gap-8 py-10 border-b border-page-border"
          >
            <div className="col-span-1">
              <span className="text-3xl font-mono font-light text-ink-faint">
                {stage.n}
              </span>
            </div>

            <div className="col-span-11 lg:col-span-4">
              <h2 className="text-lg font-semibold text-ink mb-1">{stage.title}</h2>
              <p className="text-xs font-medium uppercase tracking-wide text-ink-faint mb-3">
                {stage.layer}
              </p>
              <p className="text-sm text-ink-light leading-relaxed mb-3">{stage.goal}</p>
              <div className="space-y-1">
                {stage.prompts.map((f) => (
                  <p key={f} className="text-xs text-ink-faint">
                    Prompt file:{' '}
                    <code className="text-accent">{f}</code>
                  </p>
                ))}
              </div>
            </div>

            <div className="col-span-11 lg:col-span-4">
              <p className="text-xs section-heading">Rules</p>
              <ul className="space-y-2">
                {stage.rules.map((rule, j) => (
                  <li key={j} className="flex gap-3">
                    <span className="text-ink-faint mt-0.5 shrink-0">--</span>
                    <span className="text-sm text-ink-light leading-relaxed">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-11 lg:col-span-3">
              <p className="text-xs section-heading">Output</p>
              <div className="bg-page-off border border-page-border p-3">
                <code className="text-xs text-accent leading-relaxed block">
                  {stage.output}
                </code>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t border-page-border">
        <div className="max-w-2xl">
          <h2 className="text-lg font-semibold text-ink mb-4">Implementation Notes</h2>
          <div className="prose-atlas text-ink-light">
            <p>
              The workflow is designed for LLM-assisted execution with human oversight at each
              stage. Source ingestion, extraction, and relation mapping can be largely drafted
              with the provided prompts and a human review pass. Scoping, normalization, and the
              assessment layer (cruxes, flags, and the overall assessment) require domain
              judgment and benefit from a reviewer with subject-matter expertise. The
              adversarial audit is most valuable when performed by someone who did not build the
              entry.
            </p>
            <p>
              Each prompt is parameterized to take prior stage output as input, anchoring the
              model to the actual source material rather than to background knowledge. This
              reduces hallucination risk but does not eliminate it. Any LLM-assisted entry
              should be treated as requiring human verification of every source reference and
              claim attribution before the data_status field is set to anything other than
              "partial."
            </p>
            <p>
              A complete atlas entry from 8 sources typically requires several hours of human
              review across all stages. The bottlenecks are usually normalization (the gap
              between what a source said and what was written) and the adversarial audit. The
              workflow is meant to be returned to as new sources and evidence arrive, not run
              once and considered finished.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
