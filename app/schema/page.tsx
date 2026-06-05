import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Schema -- Epistemic Atlas',
}

const topLevel = [
  { field: 'id', type: 'string', required: true, desc: 'Unique kebab-case identifier.' },
  { field: 'title', type: 'string', required: true, desc: 'Human-readable title of the dispute.' },
  { field: 'domain', type: 'string', required: true, desc: 'Primary knowledge domain.' },
  { field: 'subdomain', type: 'string', required: false, desc: 'Optional more specific domain label.' },
  { field: 'status', type: 'enum', required: true, desc: 'open | resolved | partially_resolved | contested | archived' },
  { field: 'data_status', type: 'enum', required: true, desc: 'verified | partial | sample -- coverage of primary source verification.' },
  { field: 'summary', type: 'string', required: true, desc: 'Neutral 2-5 sentence description. No position taken.' },
  { field: 'created / updated', type: 'date', required: true, desc: 'ISO date strings.' },
  { field: 'tags', type: 'string[]', required: false, desc: 'Thematic tags for cross-entry indexing.' },
]

const sourceFields = [
  { field: 'id', type: 'string', desc: 'Unique source identifier (src_NNN).' },
  { field: 'title', type: 'string', desc: 'Full title of the source.' },
  { field: 'type', type: 'enum', desc: 'paper | report | article | book | statement | legal_filing | dataset | preprint | commentary | other' },
  { field: 'provenance', type: 'object', desc: 'author, institution, date, venue, url, doi, retrieved.' },
  { field: 'credibility', type: 'enum', desc: 'high | medium | low | unknown -- based on venue and methodology disclosure, not content.' },
  { field: 'conflict_of_interest', type: 'string?', desc: 'Known or suspected conflicts of interest. Required if known.' },
  { field: 'notes', type: 'string?', desc: 'Any notes relevant to how this source should be used.' },
]

const claimFields = [
  { field: 'id', type: 'string', desc: 'Unique claim identifier (C_NNN).' },
  { field: 'raw', type: 'string', desc: 'Verbatim text or minimal paraphrase from the source. Preserved, never discarded.' },
  { field: 'normalized', type: 'string', desc: 'Standardized restatement with explicit scope, quantification, and referents.' },
  { field: 'source_id', type: 'string', desc: 'References the source this claim is drawn from.' },
  { field: 'position', type: 'enum', desc: 'pro | con | neutral | conditional | methodological -- relative to the main dispute.' },
  { field: 'domain_type', type: 'enum', desc: 'empirical | theoretical | methodological | normative | historical' },
  { field: 'confidence', type: 'object', desc: 'level (high | medium | low | speculative) + notes explaining the assignment.' },
  { field: 'failure_flags', type: 'string[]', desc: 'Epistemic failure modes at the individual claim level. See vocabulary below.' },
]

const relationTypes = [
  { type: 'supports', desc: 'A provides evidence or logical justification for B.' },
  { type: 'attacks', desc: 'A contradicts or undermines B.' },
  { type: 'depends_on', desc: 'A is only meaningful if B is true.' },
  { type: 'qualifies', desc: 'A narrows B\'s scope without contradicting it.' },
  { type: 'implies', desc: 'A logically entails B (stronger than supports).' },
  { type: 'is_crux_of', desc: 'A is a pivotal load-bearing claim for B.' },
]

const failureFlags = [
  'motivated_reasoning',
  'cherry_picking',
  'overgeneralization',
  'false_dichotomy',
  'appeal_to_authority',
  'funding_bias',
  'methodological_weakness',
  'equivocation',
  'base_rate_neglect',
  'status_quo_bias',
  'asymmetric_skepticism',
  'publication_bias',
  'scope_creep',
  'moving_goalposts',
  'no_true_scotsman',
  'false_precision',
  'suppressed_evidence',
]

export default function SchemaPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12 pb-10 border-b border-page-border max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-ink-faint mb-5">
          Schema Reference
        </p>
        <h1 className="text-3xl font-bold text-ink mb-4">Epistemic Atlas Schema v1</h1>
        <p className="text-base text-ink-light leading-relaxed mb-4">
          Each atlas entry is a single JSON object conforming to this schema.
          The schema is defined in{' '}
          <code>schema/epistemic-atlas.schema.json</code>{' '}
          (JSON Schema Draft-07). Full worked examples in{' '}
          <code>schema/examples/</code>.
        </p>
        <p className="text-sm text-ink-faint">
          All fields marked Required must be present. Optional fields should be
          included when the information is available.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h2 className="section-heading">Top-level fields</h2>
            <SchemaTable rows={topLevel.map(r => ({...r, desc: r.desc}))} />
          </section>

          <section>
            <h2 className="section-heading">sources[]</h2>
            <p className="text-sm text-ink-faint mb-4">
              All consulted sources. Low-credibility sources are included,
              not excluded. Missing provenance is represented as null, not omitted.
            </p>
            <SchemaTable rows={sourceFields} />
          </section>

          <section>
            <h2 className="section-heading">claims[]</h2>
            <p className="text-sm text-ink-faint mb-4">
              Atomic, normalized propositions extracted from sources.
              Both raw and normalized forms are preserved.
            </p>
            <SchemaTable rows={claimFields} />
          </section>

          <section>
            <h2 className="section-heading">relations[]</h2>
            <p className="text-sm text-ink-faint mb-4">
              Directed, typed, strength-rated edges between claims.
              Direction matters: "A supports B" is not "B supports A."
            </p>
            <div className="border border-page-border">
              {relationTypes.map((r, i) => (
                <div
                  key={r.type}
                  className={`p-4 flex gap-6 ${i < relationTypes.length - 1 ? 'border-b border-page-border' : ''}`}
                >
                  <code className="text-xs font-semibold text-accent w-28 shrink-0 pt-0.5">
                    {r.type}
                  </code>
                  <p className="text-sm text-ink-light">{r.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-ink-faint mt-3">
              Strength: <code>strong</code> | <code>moderate</code> | <code>weak</code>
            </p>
          </section>

          <section>
            <h2 className="section-heading">cruxes[]</h2>
            <p className="text-sm text-ink-faint mb-4">
              Pivotal questions whose resolution would significantly change the dispute.
              First-class objects with their own ID space and dependency links.
            </p>
            <div className="border border-page-border">
              {[
                { field: 'id', desc: 'Unique crux identifier (CX_NNN).' },
                { field: 'statement', desc: 'A clear question or proposition that is the crux.' },
                { field: 'description', desc: 'Why this is a crux and what changes depending on resolution.' },
                { field: 'dependent_claim_ids', desc: 'Claims whose validity depends on this crux.' },
                { field: 'status', desc: 'unresolved | resolved_true | resolved_false | empirically_underdetermined | theoretically_underdetermined' },
                { field: 'resolution_notes', desc: 'How and by what evidence the crux was resolved, if applicable.' },
              ].map((row, i) => (
                <div key={row.field} className={`p-4 flex gap-6 ${i < 5 ? 'border-b border-page-border' : ''}`}>
                  <code className="text-xs font-semibold text-accent w-36 shrink-0 pt-0.5">{row.field}</code>
                  <p className="text-sm text-ink-light">{row.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="section-heading">missing_evidence[]</h2>
            <p className="text-sm text-ink-faint mb-4">
              Evidence that does not currently exist but whose existence would change the
              epistemic status of at least one crux. Distinct from evidence that exists but
              was not cited.
            </p>
            <div className="border border-page-border">
              {[
                { field: 'id', desc: 'Unique identifier (ME_NNN).' },
                { field: 'description', desc: 'What the evidence is and why it is absent.' },
                { field: 'type', desc: 'empirical | theoretical | historical | legal_institutional' },
                { field: 'would_affect_ids', desc: 'IDs of claims or cruxes this evidence would affect.' },
                { field: 'priority', desc: 'critical | important | helpful' },
              ].map((row, i) => (
                <div key={row.field} className={`p-4 flex gap-6 ${i < 4 ? 'border-b border-page-border' : ''}`}>
                  <code className="text-xs font-semibold text-accent w-36 shrink-0 pt-0.5">{row.field}</code>
                  <p className="text-sm text-ink-light">{row.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-10">
          <section>
            <h2 className="section-heading">Failure flag vocabulary</h2>
            <p className="text-xs text-ink-faint mb-4 leading-relaxed">
              Flags attach to individual claims, not to entire sources.
              This allows patterns to be queried at fine granularity.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {failureFlags.map((flag) => (
                <span key={flag} className="badge badge-flag">
                  {flag.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h2 className="section-heading">Data status</h2>
            <div className="space-y-2">
              {[
                { status: 'verified', cls: 'badge badge-data-verified', desc: 'All claims checked against primary sources.' },
                { status: 'partial', cls: 'badge badge-data-partial', desc: 'Some claims verified, some not.' },
                { status: 'sample', cls: 'badge badge-data-sample', desc: 'Illustrative only. Do not treat as verified record.' },
              ].map((item) => (
                <div key={item.status} className="flex gap-3 items-start">
                  <span className={item.cls}>{item.status}</span>
                  <p className="text-xs text-ink-faint leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="section-heading">Assessment object</h2>
            <div className="space-y-2 text-xs">
              {[
                { field: 'epistemic_status', desc: 'Plain-language summary for non-specialists.' },
                { field: 'resolved', desc: 'Boolean. Whether the central dispute has a clear resolution.' },
                { field: 'well_supported_claim_ids', desc: 'High or medium confidence with no significant unaddressed attacks.' },
                { field: 'contested_claim_ids', desc: 'Genuinely contested claims.' },
                { field: 'failure_modes_observed', desc: 'All failure modes found anywhere in this entry.' },
              ].map((row) => (
                <div key={row.field} className="border-b border-page-border pb-2">
                  <code className="text-accent block mb-0.5">{row.field}</code>
                  <p className="text-ink-faint">{row.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="section-heading">File reference</h2>
            <div className="bg-page-off border border-page-border p-4">
              <div className="space-y-1 text-xs font-mono text-ink-faint">
                <p>schema/</p>
                <p className="pl-4">epistemic-atlas.schema.json</p>
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

function SchemaTable({ rows }: { rows: { field: string; type?: string; required?: boolean; desc: string }[] }) {
  return (
    <div className="border border-page-border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-page-border bg-page-off">
            <th className="text-left text-xs font-semibold text-ink-faint uppercase tracking-wide py-2.5 px-4 w-36">
              Field
            </th>
            <th className="text-left text-xs font-semibold text-ink-faint uppercase tracking-wide py-2.5 px-4 w-24">
              Type
            </th>
            <th className="text-left text-xs font-semibold text-ink-faint uppercase tracking-wide py-2.5 px-4">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.field} className={i < rows.length - 1 ? 'border-b border-page-border' : ''}>
              <td className="py-3 px-4 align-top">
                <code className="text-xs text-accent">{row.field}</code>
                {row.required !== undefined && (
                  <span className={`ml-2 text-xs ${row.required ? 'text-ink-faint' : 'text-gray-300'}`}>
                    {row.required ? '*' : ''}
                  </span>
                )}
              </td>
              <td className="py-3 px-4 align-top">
                {row.type && (
                  <span className="text-xs text-ink-faint font-mono">{row.type}</span>
                )}
              </td>
              <td className="py-3 px-4 align-top">
                <p className="text-xs text-ink-light leading-relaxed">{row.desc}</p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
