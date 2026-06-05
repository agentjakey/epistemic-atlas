import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Workflow -- Epistemic Atlas',
}

const steps = [
  {
    n: '01',
    title: 'Source Ingestion',
    file: 'prompts/01_source_ingestion.md',
    goal: 'Build the sources array with full provenance metadata before extracting any claims.',
    produces: 'A JSON array of source objects with IDs, type, provenance, credibility, and conflict of interest fields.',
    rules: [
      'Capture every source regardless of apparent quality. Low-credibility sources are not discarded.',
      'Do not invent or guess any provenance field. Missing fields are set to null.',
      'Assign credibility based only on source type and venue, not content agreement.',
      'Record all known conflicts of interest explicitly.',
    ],
    output: 'sources[] -- each with id, title, type, provenance, credibility, conflict_of_interest, notes',
  },
  {
    n: '02',
    title: 'Claim Extraction',
    file: 'prompts/02_claim_extraction.md',
    goal: 'Extract every significant epistemic claim from each source as an atomic proposition.',
    produces: 'A raw claims array with verbatim text, source IDs, and domain type. No normalization yet.',
    rules: [
      'Each claim is expressible as one declarative sentence.',
      'Preserve all hedges exactly as stated (may, suggests, is consistent with).',
      'Preserve all quantification exactly (some studies, most experts, under condition X).',
      'Do not correct or improve -- capture as stated. Ambiguous claims become two separate claims.',
    ],
    output: 'claims[] -- each with id, raw, source_id, domain_type (normalized/position/confidence left null)',
  },
  {
    n: '03',
    title: 'Claim Normalization',
    file: 'prompts/03_claim_normalization.md',
    goal: 'Convert raw claims into standardized, unambiguous propositions. Assign position and confidence.',
    produces: 'A filled claims array with normalized forms, position classifications, confidence levels, and failure flags.',
    rules: [
      'Resolve all ambiguous referents. Replace "it", "this study", "they" with explicit referents.',
      'Make scope explicit. Quantification, conditions, and populations must be named.',
      'Do not change the meaning. If normalization would change the assertion, preserve raw and flag ambiguity.',
      'Failure flags attach only to the specific claim where the failure occurs, not the entire source.',
    ],
    output: 'claims[] -- normalized, position, confidence.level, confidence.notes, failure_flags filled in',
  },
  {
    n: '04',
    title: 'Relation Mapping',
    file: 'prompts/04_relation_mapping.md',
    goal: 'Identify and record logical and evidential relationships between normalized claims.',
    produces: 'A directed relation graph with typed, strength-rated edges between claims.',
    rules: [
      'Relations are directed. "A supports B" is not "B supports A".',
      'Only record logically significant relations -- not every possible connection.',
      'Do not introduce external facts. Relations are only between claims in the atlas.',
      'Check for cycles after mapping: A -> B -> A usually indicates an error.',
    ],
    output: 'relations[] -- each with id, from_claim_id, to_claim_id, type, strength, notes',
  },
  {
    n: '05',
    title: 'Crux and Missing Evidence Assessment',
    file: 'prompts/05_assessment.md',
    goal: 'Identify pivotal questions (cruxes), catalog absent evidence, and produce the overall assessment.',
    produces: 'Crux objects with resolution status, missing evidence items with affected IDs, and overall assessment.',
    rules: [
      'A crux is load-bearing, not merely contested. Aim for 2-5 cruxes per entry.',
      'Missing evidence is not evidence one side has not provided -- it is evidence that does not exist.',
      'The overall assessment must be consistent with claim-level and relation-level data.',
      'Do not flatten genuine uncertainty into consensus. Do not inflate consensus into controversy.',
    ],
    output: 'cruxes[], missing_evidence[], assessment{}',
  },
  {
    n: '06',
    title: 'Adversarial Review',
    file: 'prompts/06_adversarial_review.md',
    goal: 'Actively try to break the completed entry. Find errors, biases, and inconsistencies.',
    produces: 'A structured issue log with severity ratings and recommended corrections.',
    rules: [
      'Check normalization drift: did normalization change what was being asserted?',
      'Check asymmetric failure flagging: are both sides scrutinized equally?',
      'Check crux quality: are identified cruxes actually load-bearing?',
      'If LLM-assisted: check for hallucinated source references and claim attributions.',
    ],
    output: 'adversarial_review[] -- issues with id, category, severity, recommended_action, resolution',
  },
]

export default function WorkflowPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12 pb-10 border-b border-page-border max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-ink-faint mb-5">
          Methodology
        </p>
        <h1 className="text-3xl font-bold text-ink mb-4">Six-Step Pipeline</h1>
        <p className="text-base text-ink-light leading-relaxed">
          The pipeline converts raw source material into a structured atlas entry.
          Steps 1-5 are constructive. Step 6 is adversarial: it tries to break
          what the earlier steps built. Each step has a corresponding prompt
          template in the <code>prompts/</code> directory.
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
                <code className="text-xs text-accent-DEFAULT leading-relaxed block">
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
              each stage. Steps 1, 2, and 4 can be largely automated with the provided
              prompts and a human review pass. Steps 3, 5, and 6 require domain judgment
              and benefit from a human expert reviewer.
            </p>
            <p>
              Each prompt is parameterized to take prior step output as input. This anchors
              each step to the actual source material rather than to the LLM's background
              knowledge, which substantially reduces hallucination risk.
            </p>
            <p>
              A complete atlas entry from 6 sources typically requires 4-8 hours of
              human review time across all steps. The adversarial review step is most
              valuable when performed by someone who did not build the entry.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
