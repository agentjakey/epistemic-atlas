import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Workflow | Epistemic Atlas',
}

const steps = [
  {
    n: '01',
    title: 'Scope the question',
    file: 'prompts/01_scope.md',
    goal: 'Define the central dispute as a single, well-formed question before collecting any sources. A poorly scoped question produces a poorly scoped atlas entry.',
    produces: 'A case skeleton: id, title, domain, status (open), summary (draft), and a statement of what the atlas is and is not claiming to answer.',
    rules: [
      'The question must be disputable. Not "was X ever true" but "under what conditions is X true and what would resolve the dispute."',
      'Name the populations, time periods, and conditions that are in scope. Vagueness at this stage propagates through all later steps.',
      'Do not pre-answer the question. The scope statement is epistemic framing, not a preliminary verdict.',
      'If the question dissolves into multiple independent questions, record each as a separate case or as named sub-questions with explicit scope boundaries.',
    ],
    output: 'case._meta fields: id, title, domain, status, summary (draft)',
  },
  {
    n: '02',
    title: 'Ingest sources',
    file: 'prompts/02_source_ingestion.md',
    goal: 'Build the sources array with full provenance metadata before extracting any claims.',
    produces: 'A sources array with IDs, type, provenance objects, credibility assessments, and conflict of interest fields.',
    rules: [
      'Capture every consulted source regardless of apparent quality. Low-credibility sources are not discarded.',
      'Do not invent or guess any provenance field. Set missing fields to null explicitly.',
      'Assign credibility based on source type and venue, not based on whether the content agrees with other sources.',
      'Record all known or suspected conflicts of interest. When in doubt, record the concern rather than omitting it.',
    ],
    output: 'sources[]: each with id, title, type, provenance, credibility, conflict_of_interest, notes',
  },
  {
    n: '03',
    title: 'Extract atomic claims',
    file: 'prompts/03_claim_extraction.md',
    goal: 'Extract every significant epistemic claim from each source as an atomic extracted claim object.',
    produces: 'An extracted_claims array where each item is a minimally processed verbatim or near-verbatim statement from one source.',
    rules: [
      'Each extracted claim maps to exactly one source. One source can produce many extracted claims.',
      'Preserve all hedges exactly as stated: "may," "suggests," "is consistent with," "under some conditions."',
      'Preserve all quantification exactly: "some studies," "most experts," "under 5 percent."',
      'Do not normalize. Do not correct. Do not improve. Ambiguous claims become two separate extracted claims.',
    ],
    output: 'extracted_claims[]: each with id, source_id, raw_text, location, extraction_notes',
  },
  {
    n: '04',
    title: 'Normalize claims',
    file: 'prompts/04_claim_normalization.md',
    goal: 'Group extracted claims into normalized claims: unambiguous, scope-explicit propositions with position and confidence assignments.',
    produces: 'A normalized_claims array where each item synthesizes one or more extracted claims into a single, clearly stated proposition.',
    rules: [
      'Resolve all ambiguous referents. Replace "it," "this study," "they" with explicit referents.',
      'Make scope explicit. Quantification, conditions, and populations must be named in the normalized text.',
      'Do not change the meaning. If normalization would change the assertion, preserve the raw form and flag the ambiguity.',
      'Multiple extracted claims from different sources can back one normalized claim. Track the mapping in extracted_claim_ids.',
    ],
    output: 'normalized_claims[]: with id, extracted_claim_ids, normalized_text, position, confidence, domain_type',
  },
  {
    n: '05',
    title: 'Map relations',
    file: 'prompts/05_relation_mapping.md',
    goal: 'Identify and record logical and evidential relationships between normalized claims.',
    produces: 'A directed relation graph with typed, strength-rated edges between normalized claims.',
    rules: [
      'Relations are directed: "A supports B" is not "B supports A."',
      'Only record logically significant relations. Not every pair of claims needs an edge.',
      'Use the full relation vocabulary: supports, attacks, depends_on, reframes, narrows, generalizes, duplicates, conflicts_with, evidence_for, evidence_against.',
      'Check for cycles after mapping. A depends_on B depends_on A usually indicates an error.',
    ],
    output: 'relations[]: each with id, from_id, to_id, type, strength, notes',
  },
  {
    n: '06',
    title: 'Identify cruxes',
    file: 'prompts/06_crux_identification.md',
    goal: 'Identify pivotal questions whose resolution would significantly change the outcome of the dispute.',
    produces: 'A cruxes array with resolution status, dependency links to affected normalized claims, and (where available) resolution notes.',
    rules: [
      'A crux is load-bearing, not merely contested. Identifying more than 5-7 cruxes usually indicates imprecise identification.',
      'Record resolution status honestly. "Resolved" requires a concrete mechanism, not just expert consensus.',
      'Link each crux to the normalized claims whose validity depends on it.',
      'A crux that has been resolved still belongs in the atlas. Resolution is information.',
    ],
    output: 'cruxes[]: each with id, statement, description, dependent_normalized_claim_ids, status, resolution_notes',
  },
  {
    n: '07',
    title: 'Flag failure modes',
    file: 'prompts/07_failure_mode_flagging.md',
    goal: 'Identify and attach epistemic failure modes to individual normalized claims and sources.',
    produces: 'A failure_mode_flags array where each flag is attached to a specific claim or source with a severity rating and description.',
    rules: [
      'Flags attach to specific claims or sources, not to the case as a whole. This granularity is what makes them queryable.',
      'Apply flags symmetrically. If one side of a dispute is scrutinized for funding bias, scrutinize the other side equally.',
      'A flag is only valid if it can be substantiated from the source material. Do not flag based on prior beliefs about a source.',
      'Severity: critical (changes the conclusion), significant (should be disclosed but conclusion may hold), minor (worth noting).',
    ],
    output: 'failure_mode_flags[]: each with id, type, applies_to_id, applies_to_type, severity, description',
  },
  {
    n: '08',
    title: 'Produce assessment',
    file: 'prompts/08_assessment.md',
    goal: 'Synthesize the full graph into an overall epistemic assessment with explicit status, crux dependencies, and update conditions.',
    produces: 'The assessment object: status, settled_direction (if settled), key_crux_ids, weak_link_ids, dominant_failure_modes, what_would_update.',
    rules: [
      'Status must be consistent with the claim-level and crux-level data. Do not flatten genuine uncertainty into consensus.',
      'Identify weak links: normalized claims that the conclusion most depends on but where confidence is low.',
      'what_would_update must list concrete scenarios, not vague conditions. "If Hawking radiation is confirmed" is concrete. "If more research is done" is not.',
      'Do not produce a medical, legal, or policy recommendation. The assessment is epistemic, not actionable.',
    ],
    output: 'assessment{}: status, settled_direction, epistemic_status_summary, key_crux_ids, weak_link_ids, what_would_update, missing_evidence[]',
  },
  {
    n: '09',
    title: 'Audit and update',
    file: 'prompts/09_audit.md',
    goal: 'Actively try to break the completed entry. Find normalization drift, asymmetric flagging, inconsistent crux identification, and hallucinated source references.',
    produces: 'An audit_notes array with categorized issues, severity ratings, and recommended actions. Update the entry based on findings.',
    rules: [
      'Check normalization drift: does the normalized claim accurately represent what the source actually said?',
      'Check asymmetric failure flagging: are all positions scrutinized with equal rigor?',
      'If LLM-assisted: verify every source reference and claim attribution against the actual source document.',
      'Record unresolved issues as open audit notes. A known open issue is better than a silent inaccuracy.',
    ],
    output: 'audit_notes[]: each with id, type, description, applies_to_ids, severity, status',
  },
]

export default function WorkflowPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12 pb-10 border-b border-page-border max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-ink-faint mb-5">
          Methodology
        </p>
        <h1 className="text-3xl font-bold text-ink mb-4">Pipeline</h1>
        <p className="text-base text-ink-light leading-relaxed">
          The pipeline converts raw source material into a structured atlas entry.
          Steps 1-8 are constructive. Step 9 is adversarial: it actively tries to
          break what earlier steps built. Each step has a corresponding prompt template
          in the <code>prompts/</code> directory, parameterized to take prior step
          output as input.
        </p>
      </div>

      <div className="space-y-0">
        {steps.map((step, i) => (
          <div
            key={step.n}
            className="grid grid-cols-12 gap-8 py-10 border-b border-page-border"
          >
            <div className="col-span-1">
              <span className="text-3xl font-mono font-light text-ink-faint">
                {step.n}
              </span>
            </div>

            <div className="col-span-11 lg:col-span-4">
              <h2 className="text-lg font-semibold text-ink mb-2">{step.title}</h2>
              <p className="text-sm text-ink-light leading-relaxed mb-3">{step.goal}</p>
              <p className="text-xs text-ink-faint">
                Prompt file:{' '}
                <code className="text-accent">{step.file}</code>
              </p>
            </div>

            <div className="col-span-11 lg:col-span-4">
              <p className="text-xs section-heading">Rules</p>
              <ul className="space-y-2">
                {step.rules.map((rule, j) => (
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
                  {step.output}
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
              The pipeline is designed for LLM-assisted execution with human oversight at
              each stage. Steps 2, 3, and 5 can be largely automated with the provided
              prompts and a human review pass. Steps 1, 4, 6, 7, and 8 require domain
              judgment and benefit from a reviewer with subject-matter expertise. Step 9
              is most valuable when performed by someone who did not build the entry.
            </p>
            <p>
              Each prompt is parameterized to take prior step output as input, anchoring
              the LLM to the actual source material rather than to background knowledge.
              This substantially reduces hallucination risk, but does not eliminate it.
              Any LLM-assisted entry should be treated as requiring human verification of
              every source reference and claim attribution before the data_status field
              is set to anything other than "partial."
            </p>
            <p>
              A complete atlas entry from 8 sources typically requires 6-10 hours of
              human review time across all steps. The bottleneck is usually Step 4
              (normalization) and Step 9 (adversarial audit), both of which require
              sustained attention to the gap between what was said and what was written.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
