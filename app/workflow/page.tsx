import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Workflow | Epistemic Atlas',
}

const stages = [
  {
    n: '01',
    title: 'Scope the question',
    prompts: ['prompts/01_scope.md'],
    goal: 'Define the central dispute as a single, well-formed question before collecting any sources. A poorly scoped question produces a poorly scoped atlas entry.',
    produces: 'A case skeleton: id, title, domain, status (open), summary (draft), and a statement of what the atlas is and is not claiming to answer.',
    rules: [
      'The question must be disputable. Not "was X ever true" but "under what conditions is X true and what would resolve the dispute."',
      'Name the populations, time periods, and conditions that are in scope. Vagueness at this stage propagates through all later stages.',
      'Do not pre-answer the question. The scope statement is epistemic framing, not a preliminary verdict.',
      'If the question dissolves into multiple independent questions, record each as a separate case or as named sub-questions with explicit scope boundaries.',
    ],
    output: 'case._meta fields: id, title, domain, status, summary (draft)',
  },
  {
    n: '02',
    title: 'Ingest sources',
    prompts: ['prompts/02_source_ingestion.md'],
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
    title: 'Extract and normalize claims',
    prompts: ['prompts/03_claim_extraction.md', 'prompts/04_claim_normalization.md'],
    goal: 'Extract every significant epistemic claim as an atomic object, then normalize each into an unambiguous, scope-explicit proposition.',
    produces: 'An extracted_claims array of minimally processed statements from sources, and a normalized_claims array of standardized propositions with position and confidence assignments.',
    rules: [
      'Each extracted claim maps to exactly one source. Preserve all hedges and quantification exactly as stated.',
      'Do not normalize during extraction. Capture the claim as it appears in the source.',
      'Normalization resolves ambiguous referents, undefined scope, and implicit quantification. It does not change the meaning.',
      'Multiple extracted claims from different sources can back one normalized claim. Track the full mapping in extracted_claim_ids.',
    ],
    output: 'extracted_claims[]: id, source_id, raw_text | normalized_claims[]: id, extracted_claim_ids, normalized_text, position, confidence',
  },
  {
    n: '04',
    title: 'Map structure',
    prompts: [
      'prompts/05_relation_mapping.md',
      'prompts/06_crux_identification.md',
      'prompts/07_failure_mode_flagging.md',
    ],
    goal: 'Map logical and evidential relations between normalized claims, identify pivotal cruxes, and attach failure mode flags to specific claims and sources.',
    produces: 'A directed relation graph with typed edges, a cruxes array with resolution status and dependency links, and a failure_mode_flags array attached to individual claims and sources.',
    rules: [
      'Relations are directed: "A supports B" is not "B supports A." Only record logically significant relations.',
      'A crux is load-bearing, not merely contested. Resolving it one way should significantly weaken one major position.',
      'Failure mode flags attach to specific claims or sources, not to the case as a whole. Apply them symmetrically.',
      'A flag is only valid if it can be substantiated from the source material.',
    ],
    output: 'relations[]: from_id, to_id, type, strength | cruxes[]: statement, status, dependent_ids | failure_mode_flags[]: type, applies_to_id, severity',
  },
  {
    n: '05',
    title: 'Produce assessment',
    prompts: ['prompts/08_assessment.md'],
    goal: 'Synthesize the full graph into an overall epistemic assessment with explicit status, crux dependencies, and update conditions.',
    produces: 'The assessment object: status, settled_direction (if settled), key_crux_ids, weak_link_ids, dominant_failure_modes, and what_would_update.',
    rules: [
      'Status must be consistent with the claim-level and crux-level data. Do not flatten genuine uncertainty into consensus.',
      'Identify weak links: normalized claims that the conclusion most depends on but where confidence is low.',
      'what_would_update must list concrete scenarios, not vague conditions. "If Hawking radiation is confirmed" is concrete. "If more research is done" is not.',
      'Do not produce a medical, legal, or policy recommendation. The assessment is epistemic, not actionable.',
    ],
    output: 'assessment{}: status, settled_direction, epistemic_status_summary, key_crux_ids, weak_link_ids, what_would_update',
  },
  {
    n: '06',
    title: 'Adversarial audit',
    prompts: ['prompts/09_audit.md'],
    goal: 'Actively try to break the completed entry. Find normalization drift, asymmetric flagging, inconsistent crux identification, and unverified source references.',
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
        <h1 className="text-3xl font-bold text-ink mb-4">Six-Stage Pipeline</h1>
        <p className="text-base text-ink-light leading-relaxed">
          The pipeline converts raw source material into a structured atlas entry.
          Stages 1 through 5 are constructive. Stage 6 is adversarial: it actively
          tries to break what the earlier stages built. Each stage has one or more
          corresponding prompt templates in the <code>prompts/</code> directory,
          parameterized to take prior stage output as input.
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
              <h2 className="text-lg font-semibold text-ink mb-2">{stage.title}</h2>
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
              The pipeline is designed for LLM-assisted execution with human oversight at
              each stage. Stages 2, 3, and 4 (relation mapping portion) can be largely
              automated with the provided prompts and a human review pass. Stages 1, 3
              (normalization), 4 (crux and flag identification), 5, and 6 require domain
              judgment and benefit from a reviewer with subject-matter expertise. Stage 6
              is most valuable when performed by someone who did not build the entry.
            </p>
            <p>
              Each prompt is parameterized to take prior stage output as input, anchoring
              the LLM to the actual source material rather than to background knowledge.
              This substantially reduces hallucination risk, but does not eliminate it.
              Any LLM-assisted entry should be treated as requiring human verification of
              every source reference and claim attribution before the data_status field
              is set to anything other than "partial."
            </p>
            <p>
              A complete atlas entry from 8 sources typically requires 6-10 hours of
              human review time across all stages. The bottleneck is usually Stage 3
              (normalization) and Stage 6 (adversarial audit), both of which require
              sustained attention to the gap between what was said and what was written.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
