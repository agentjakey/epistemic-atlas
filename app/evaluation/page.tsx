import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Evaluation | Epistemic Atlas',
}

const lenses = [
  {
    n: '01',
    title: 'Faithfulness',
    question: 'Does the encoded representation accurately reflect what the sources actually say?',
    description: 'A faithful encoding preserves the meaning of claims, not just their surface form. It does not normalize away hedges, does not infer stronger conclusions than the source states, and does not suppress claims that are inconvenient for a tidy narrative. The extraction-normalization split is the main mechanism: extracted claims carry verbatim text, and normalization is an explicit, reviewable transformation.',
    howAddressed: 'The needs_source_verification flag marks every claim that has not been verified against the primary source. Audit notes track normalization concerns. The adversarial review step explicitly checks for normalization drift.',
    evidence: 'All 50 extracted claims across both case studies are marked needs_source_verification: true and include raw text. AuditNote AN_001 (LHC) flags the entire entry as LLM-assisted and requiring verification.',
    strength: 'Partial',
    gap: 'Neither case study has been fully verified against primary sources. Any claim currently marked needs_source_verification is a faithfulness claim that has not been validated.',
  },
  {
    n: '02',
    title: 'Usefulness',
    question: 'Does the structure help a reader understand the dispute better than prose does?',
    description: 'A useful encoding surfaces something that reading the sources in order does not: the logical structure, the failure mode pattern, the pivotal questions, the update conditions. If the atlas just reproduces what a careful summary would say, it has not added value. Usefulness is measured by whether the structure generates insights that are hard to extract from unstructured text.',
    howAddressed: 'Cruxes make the pivotal questions explicit and queryable. Failure mode flags create a cross-case comparison surface. What-would-update scenarios make update conditions concrete rather than vague. The interactive claim inspector makes the relation graph navigable.',
    evidence: 'The Giddings-Mangano HR-independence argument (LHC case) appears as a named crux and several relations. It would be easy to miss in a literature review but is load-bearing for the safety assessment. The eggs case makes explicit that the Zhong 2019 conflict with earlier null findings is unresolved, not merely a dose confusion.',
    strength: 'Strong',
    gap: 'Usefulness depends on what questions a reader brings. The schema is most useful for tracing logical dependencies and failure modes. It does not help readers who need a quick policy verdict.',
  },
  {
    n: '03',
    title: 'Generality',
    question: 'Does the schema transfer to substantively different disputes without modification?',
    description: 'A general schema works on disputes from different domains, with different resolution statuses, and with different failure mode profiles, without requiring new fields, new vocabularies, or structural hacks. The LHC and eggs cases were chosen specifically to stress-test this: one involves theoretical physics, one involves nutrition epidemiology; one is settled, one is not; one has institutional conflict of interest concerns, one has industry funding concerns.',
    howAddressed: 'Both cases use exactly the same schema version (v3) with no case-specific extensions. The relation families, failure mode types, crux structure, and assessment layer are identical. The only differences are the domain fields and the resulting data.',
    evidence: 'The same 5 relation families, 12 failure mode types, and 5 crux status values are used across both cases. Failure modes found in both cases: source_incentive_pressure (CERN in LHC; AHA in eggs), correlated_evidence_treated_as_independent (CERN reports in LHC; Harvard cohort overlaps in eggs).',
    strength: 'Strong',
    gap: 'Tested on two cases only. The schema may require extension for purely normative disputes (ethics, policy), disputes turning on legal interpretation, or disputes where the primary evidence is quantitative models rather than empirical measurements.',
  },
  {
    n: '04',
    title: 'Adversarial robustness',
    question: 'Can the structure resist motivated use: selective flagging, cherry-picked cruxes, biased normalization?',
    description: 'A motivated encoder can abuse any schema. They can flag failure modes only on one side, identify cruxes that favor their conclusion, or write normalized claims that subtly shift meaning. Adversarial robustness means the schema makes such manipulation detectable, not that it prevents it. Detection mechanisms: the needs_source_verification flag, the audit_notes type (asymmetric_flagging), and the rule that failure flags must be applied symmetrically.',
    howAddressed: 'The extraction-normalization split provides a paper trail for normalization choices. The audit_notes object has an explicit asymmetric_flagging type. The adversarial review step (step 9) is designed to check symmetry. The fact that low-credibility sources are retained rather than removed limits selection bias in the source layer.',
    evidence: 'In the LHC case, conflict of interest flags are applied to CERN-affiliated sources (src_001, src_002, src_003). The competing claim NC_002 (ADD model black hole prediction) is retained even though it is ultimately negated. The Wagner-Sancho complaint (EC_025) is included in the extracted claims despite its source having low credibility.',
    strength: 'Partial',
    gap: 'No automated check for asymmetric flagging exists. The schema makes abuse detectable in principle, but detection requires a reviewer who knows to look for it. An encoder who systematically normalizes toward a preferred conclusion will not be caught by the schema alone.',
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
          This page assesses the submission against four evaluation lenses. Each lens has
          a concrete question, a description of what would satisfy it, an account of how
          this prototype addresses it, and an honest gap statement. See also{' '}
          <Link href="/limitations" className="text-accent hover:underline">
            Limitations
          </Link>{' '}
          for structural weaknesses.
        </p>
      </div>

      <div className="space-y-0">
        {lenses.map((lens, i) => (
          <div
            key={lens.n}
            className={`py-12 ${i < lenses.length - 1 ? 'border-b border-page-border' : ''}`}
          >
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-1">
                <span className="text-3xl font-mono font-light text-ink-faint">{lens.n}</span>
              </div>

              <div className="col-span-11">
                <div className="flex items-start gap-4 mb-4 flex-wrap">
                  <h2 className="text-xl font-semibold text-ink">{lens.title}</h2>
                  <span className={`badge shrink-0 mt-1 ${
                    lens.strength === 'Strong' ? 'badge-conf-high' : 'badge-conf-medium'
                  }`}>{lens.strength}</span>
                </div>
                <p className="text-sm text-ink-faint italic mb-5 leading-relaxed">{lens.question}</p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1">
                    <p className="text-xs section-heading mb-2">What satisfies this lens</p>
                    <p className="text-sm text-ink-light leading-relaxed">{lens.description}</p>
                  </div>

                  <div className="lg:col-span-1">
                    <p className="text-xs section-heading mb-2">How addressed</p>
                    <p className="text-sm text-ink-light leading-relaxed mb-4">{lens.howAddressed}</p>
                    <div className="bg-page-off border border-page-border p-3">
                      <p className="text-xs text-ink-faint leading-relaxed">{lens.evidence}</p>
                    </div>
                  </div>

                  <div className="lg:col-span-1">
                    <p className="text-xs section-heading mb-2">Gap</p>
                    <div className="border-l-4 border-l-amber-400 bg-amber-50 p-3">
                      <p className="text-sm text-ink-light leading-relaxed">{lens.gap}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 pt-10 border-t border-page-border">
        <div className="max-w-2xl">
          <h2 className="section-heading mb-4">Overall assessment</h2>
          <div className="prose-atlas text-ink-light">
            <p>
              Faithfulness and adversarial robustness are both marked Partial because the
              prototype relies on human judgment and human review at every quality-sensitive
              step. The schema provides structure and makes manipulation detectable; it does
              not provide guarantees. A submission with fully verified source claims and an
              independent adversarial reviewer would rate higher on both lenses.
            </p>
            <p>
              Usefulness and generality are both Strong. The interactive claim inspector
              surfaces logical dependencies that are invisible in prose. The two case studies
              demonstrate that the same schema handles substantively different domains,
              resolution statuses, and failure mode profiles without structural modification.
              These are the properties that make a schema a reusable tool rather than a
              one-off annotation.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-16 pt-10 border-t border-page-border">
        <h2 className="section-heading mb-2">Adversarial self-audit</h2>
        <p className="text-sm text-ink-faint mb-8 max-w-2xl leading-relaxed">
          Eight specific ways this system can fail to do what it claims, how each is
          mitigated, and where the mitigation is still insufficient. Full analysis in{' '}
          <code className="text-accent">docs/adversarial_audit.md</code>.
        </p>
        <div className="space-y-0 border border-page-border">
          {auditItems.map((item, i) => (
            <div
              key={item.label}
              className={`p-5 grid grid-cols-12 gap-6 ${
                i < auditItems.length - 1 ? 'border-b border-page-border' : ''
              }`}
            >
              <div className="col-span-12 lg:col-span-4">
                <div className="flex items-start gap-3 mb-2">
                  <span className="text-xs font-mono text-ink-faint shrink-0 mt-0.5 w-6">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-sm font-semibold text-ink leading-snug">{item.label}</h3>
                </div>
                <p className="text-xs text-ink-faint leading-relaxed ml-9">{item.risk}</p>
              </div>
              <div className="col-span-12 lg:col-span-4">
                <p className="text-xs section-heading mb-1.5">Mitigation</p>
                <p className="text-xs text-ink-light leading-relaxed">{item.mitigation}</p>
              </div>
              <div className="col-span-12 lg:col-span-4">
                <p className="text-xs section-heading mb-1.5">Still insufficient</p>
                <p className="text-xs text-ink-faint leading-relaxed">{item.gap}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const auditItems = [
  {
    label: 'Extracting a claim not actually in the source',
    risk: 'LLM paraphrase or confabulation enters the pipeline as a source-attributed object. All downstream claims inherit the error.',
    mitigation: 'needs_source_verification flag on every extracted claim. AuditNote type for verification_needed. Step 3 prompt instructs verbatim preservation.',
    gap: 'The flag is a warning, not a correction. A well-formed unverified claim with a DOI still looks authoritative to a casual reader.',
  },
  {
    label: 'Merging two claims that are materially different',
    risk: 'Normalization groups two extracted claims that differ on a condition, population, or threshold. The merged claim appears to have stronger backing than either source provides.',
    mitigation: 'extracted_claim_ids preserves the source claims. Normalization rules forbid merging when meaning changes.',
    gap: 'The paper trail exists but readers must click into the detail panel to see it. Divergence between extracted and normalized text is not surfaced by default.',
  },
  {
    label: 'Treating correlated evidence as independent',
    risk: 'Three citations from three sources looks like triple confirmation. If the sources share authors or data, the independence is illusory.',
    mitigation: 'correlated_evidence_treated_as_independent failure mode type. conflict_of_interest source field. Applied in both case studies.',
    gap: 'The flag is advisory. Claim confidence is not automatically reduced. The flag and the confidence badge can send contradictory signals without reconciliation.',
  },
  {
    label: 'Overweighting institutional authority',
    risk: 'A high-credibility source (CERN, JAMA) may be given more epistemic weight than the specific claim it supports actually warrants.',
    mitigation: 'Credibility is defined as source-type and venue, not content. Claim confidence is assessed independently. source_incentive_pressure type flags institutional bias.',
    gap: 'Credibility is displayed prominently in the source list. Readers may substitute source credibility for claim confidence without comparing the two.',
  },
  {
    label: 'Overweighting vivid contrarian arguments',
    risk: 'A well-stated minority position gets more claim granularity than the consensus, making the atlas look like both sides are equally supported.',
    mitigation: 'Position field classifies every claim. Assessment provides well_supported_claim_ids and contested_claim_ids. Step 9 checks flag asymmetry.',
    gap: 'No automated check for claim count by position. Asymmetry may be deliberate or accidental with no current way to distinguish them.',
  },
  {
    label: 'Producing a clean graph that hides uncertainty',
    risk: 'The structure of a well-formed relation graph implies epistemic clarity. Structure is not evidence of clarity.',
    mitigation: 'data_status badge on case headers. Crux resolution status is visually distinguished. Assessment status separates settled from unsettled.',
    gap: 'The badge is small. A polished interface generates trust that partially verified data does not warrant. The visual design and the data status send conflicting signals.',
  },
  {
    label: 'Turning an open question into a binary verdict',
    risk: 'The assessment settled_direction text may communicate more certainty than the crux-level data supports. Readers anchor on the verdict and miss the qualifications.',
    mitigation: 'Eggs case assessment is unsettled with null settled_direction and an explicit three-way sub-question structure. LHC weak_link_ids and unresolved cruxes are recorded.',
    gap: 'The LHC verdict reads cleanly as settled without surfacing that CX_002 and CX_003 remain underdetermined unless the reader inspects the crux list.',
  },
  {
    label: 'Creating false confidence through visual polish',
    risk: 'A well-designed interface communicates competence. Competence applied to a working draft produces misplaced trust.',
    mitigation: 'data_status: partial is displayed in the header. Limitations page and writeup are explicit about verification status.',
    gap: 'The badge does not dominate. Claim-level UI does not communicate aggregate unverified status unless the reader opens a detail panel. Visual clarity should be earned by verification, not assumed.',
  },
]
