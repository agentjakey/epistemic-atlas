# Adversarial Self-Audit: Epistemic Atlas

This document applies the Epistemic Atlas methodology to itself. Each section describes
a specific way the system could fail to do what it claims to do, how the current schema
and pipeline attempt to mitigate that failure, where the mitigation is still insufficient,
and what would make it stronger.

This audit is part of the submission, not an appendix. A system that does not know how
it can be broken should not be trusted to map how other arguments can be broken.

---

## Failure 1: The system extracts a claim not actually supported by the source.

**The risk.** When claim extraction is LLM-assisted, the model may paraphrase more
aggressively than intended, infer conclusions the source only implies, or confabulate
specific values (effect sizes, dates, confidence intervals) that are plausible but wrong.
The extracted claim enters the pipeline as a source-attributed object. All downstream
normalized claims, relations, and assessments that depend on it inherit the error.

**Current mitigation.** Every extracted claim has a needs_source_verification field.
When set to true, it marks the claim as unverified paraphrase rather than confirmed text.
Both case studies set this flag on all 50 extracted claims. The AuditNote type includes
a verification_needed subtype to surface the most critical unverified claims. The prompt
for step 3 explicitly instructs the LLM to preserve hedges and quantification exactly and
to flag any claim where verbatim extraction was not possible.

**Where it is insufficient.** The flag is a warning, not a correction. A reader who
encounters a well-formed extracted claim with a DOI and a plausible-sounding effect size
will often proceed as though it is correct, even when the needs_source_verification flag
is present. The flag does not prevent the claim from being used in downstream reasoning;
it only records that verification has not occurred. If a key crux depends on an unverified
claim, the assessment may be wrong in a way the reader cannot detect without reading the
primary source.

**Future improvement.** Add a propagation mechanism: any normalized claim whose
extracted_claim_ids include at least one needs_source_verification: true entry should
itself be flagged as unverified, and the assessment should display a warning if any
key_crux_ids or weak_link_ids depend on unverified claims. This makes the epistemic
exposure visible at the point where it matters, not just at the extraction layer.

---

## Failure 2: The system merges two claims that are similar but materially different.

**The risk.** During normalization (step 4), the annotator (or the LLM assisting with
normalization) groups two extracted claims from different sources into a single normalized claim
because they appear to assert the same thing. If the two claims differ on a condition,
a population, a time period, or a quantitative threshold, merging them silently discards
the difference. The atlas then treats the merged claim as having stronger support than
it actually has, because two "independent" sources are now backing a claim that neither
source made exactly.

**Current mitigation.** The extracted_claim_ids field on each normalized claim preserves
the full list of source claims it synthesizes. A reviewer can check each source claim
against the normalized text to detect merging errors. The normalization rules in step 4
explicitly instruct: if normalization would change the meaning, preserve the raw form and
flag the ambiguity rather than merging. The extraction step also instructs: ambiguous
claims become two separate extracted claims rather than one.

**Where it is insufficient.** The reviewer must know to perform this check. Nothing in
the current prototype prompts a reader to compare the normalized text against its extracted
claims unless they click into the claim detail panel. In practice, most readers will
encounter the normalized text, see that it cites two sources, and proceed without checking
whether both sources actually support that specific formulation. The paper trail exists but
is not surfaced by default.

**Future improvement.** In the claim detail panel, show the normalized text and the
extracted texts side by side with explicit visual emphasis on any hedges, quantifiers, or
conditions present in the extracted claims that are absent from the normalized text. This
makes divergence visible rather than requiring the reader to actively look for it.

---

## Failure 3: The system treats correlated evidence as independent.

**The risk.** A normalized claim that cites three extracted claims from three different
sources appears to have three independent lines of support. If those sources share
authors, datasets, or institutional context, the apparent independence is misleading.
The assessed confidence in the normalized claim should reflect the effective degree of
independence, not the head count of citations.

**Current mitigation.** The correlated_evidence_treated_as_independent failure mode type
exists specifically to flag this. In the LHC case it is applied to NC_012 (the LSAG
conclusion, backed by reports sharing five authors) and to NC_003 (the CERN 2003
framework, same authorship). In the eggs case it is applied to NC_107 (meta-analytic
heterogeneity, where several included studies share the Harvard cohort data) and to NC_105
(Hu 1999 and Drouin-Chartier 2020 share cohorts and authorship). The source-level
conflict_of_interest field records shared affiliations.

**Where it is insufficient.** Flagging this failure mode is advisory. The confidence level
on the affected normalized claims is not automatically reduced. A reader who sees
confidence: high on NC_012 and trusts that rating without reading the failure mode flag
will overweight the evidence. The flag and the confidence level carry contradictory
implicit messages without explicit reconciliation.

**Future improvement.** When a normalized claim has an active
correlated_evidence_treated_as_independent flag, automatically display an inline caveat
next to the confidence badge in the claim list: something like "confidence may be
overstated: correlated sources." This reconciles the flag with the confidence display
rather than leaving them in silent tension.

---

## Failure 4: The system overweights institutional authority.

**The risk.** A source with high credibility (a peer-reviewed JAMA paper, a CERN safety
report) may be given more epistemic weight than its evidence actually warrants. The
credibility field reflects source type and venue, not the specific evidential quality of
the claims being extracted. An institutional source can be high-credibility on average
while making a specific claim that is poorly supported, speculative, or motivated.

**Current mitigation.** The credibility field is defined as an assessment of source type
and venue, explicitly not content. Claim-level confidence is assessed separately from
source-level credibility. A high-credibility source can back a low-confidence normalized
claim, and the schema supports this combination. The source_incentive_pressure failure
mode type flags institutional relationships that may introduce bias regardless of venue.

**Where it is insufficient.** The prototype displays source credibility prominently in the
source list and in the provenance panel of the claim inspector. A reader who sees
"credibility: high" next to a source will likely read the extracted claim from that source
with more trust than the claim-level confidence warrants. The schema preserves the
distinction but the visual design does not enforce it. In the LHC case, the LSAG report
is credibility: high and backs NC_012 (confidence: high), which is technically accurate,
but the failure mode flags on NC_012 mean the true epistemic situation is more uncertain
than either badge suggests independently.

**Future improvement.** In the provenance section of the claim detail panel, show the
normalized claim's confidence and failure mode flags alongside the source's credibility,
with explicit text: "This claim's confidence is assessed independently of the source's
institutional credibility." Forcing these two assessments into the same visual frame
reduces the risk that one is substituted for the other.

---

## Failure 5: The system overweights contrarian arguments because they are rhetorically vivid.

**The risk.** A well-stated minority position (one that is clearly phrased, structurally
interesting, or emotionally engaging) may be encoded with more attention and nuance than
the boring consensus position. The consensus view gets a single normalized claim with
high confidence; the contrarian view gets three normalized claims tracing its logical
structure. The atlas then looks like the consensus and the contrarian view are comparably
supported, when the structural complexity of the encoding reflects rhetorical vividness
rather than epistemic weight.

**Current mitigation.** The position field classifies claims as pro, con, neutral,
conditional, or methodological relative to the main dispute. The assessment's
well_supported_claim_ids and contested_claim_ids fields provide explicit top-level
guidance about which claims have the strongest support, independently of how many claims
encode each position. The adversarial review step (step 9) specifically checks for
asymmetric flagging and asymmetric claim granularity.

**Where it is insufficient.** There is no automated check for claim count by position.
In both case studies, the "con" position (safety / null CVD finding) has more claims
encoded than the "pro" position (risk), partly because the safety arguments in both cases
are more structurally complex. This may be an accurate reflection of the epistemic
situation, or it may be an artifact of spending more analysis time on the dominant
narrative. There is currently no way to distinguish these.

**Future improvement.** Add a section to the adversarial audit step that explicitly counts
normalized claims by position and flags large imbalances for review. The goal is not
forced balance (the epistemic situation may genuinely be asymmetric) but to ensure
that asymmetry is deliberate and documented rather than accidental.

---

## Failure 6: The system produces a clean graph that hides uncertainty.

**The risk.** The atlas produces a structured, navigable representation of a dispute.
Structure implies clarity. A reader who encounters a well-formed relation graph with typed
edges and resolved cruxes may conclude that the dispute is better understood than it
actually is. The visual coherence of the encoding is not evidence of epistemic coherence
in the underlying dispute.

**Current mitigation.** The data_status field (partial in both case studies) is displayed
prominently in the case header. Crux resolution status is displayed for each crux, and
unresolved and empirically_underdetermined are visually distinct from resolved. The
assessment status makes explicit when a dispute is unsettled. The what_would_update
scenarios make explicit that the conclusion is conditional, not final.

**Where it is insufficient.** The interactive prototype is polished. A polished interface
generates trust that the underlying data may not warrant. The needs_source_verification
flags on 50 extracted claims tell a careful reader that the data is provisional; the
clean visual design tells a casual reader that the work is done. These signals conflict.
The current design does not adequately resolve this conflict.

**Future improvement.** Add a persistent visual indicator at the top of each case page
that makes the partial data status hard to miss: a clearly styled banner that says
"Working draft: 0 of 50 extracted claims verified against primary sources" with the
number updating as verification progresses. The banner should not be dismissible. The
goal is to make data status as salient as claim content, not a badge that fades into the
header.

---

## Failure 7: The system turns an open-ended question into an overly binary verdict.

**The risk.** The assessment object has a status field (settled, unsettled, partially_
settled) and a settled_direction field. Even with multiple cruxes marked unresolved and
a weak_link_ids list, the settled_direction text may communicate more certainty than the
crux-level data supports. A reader who reads the assessment first and the cruxes second
will anchor on the verdict.

**Current mitigation.** The eggs case was specifically designed to resist this. Its
assessment status is unsettled and settled_direction is null. The assessment notes field
and the epistemic_status_summary text explicitly describe three distinct sub-questions with
different evidential situations rather than a single claim. The key_crux_ids and
weak_link_ids fields point readers toward the most uncertain parts of the argument.

**Where it is insufficient.** The LHC case assessment is settled with a stated direction.
This is the most honest available characterization, but it buries the residual uncertainty
in CX_002 (Hawking radiation theoretically underdetermined) and CX_003 (ADD model
empirically underdetermined) that the body of the entry makes clear. A reader who reads
the assessment heading ("settled") and the settled_direction text will come away with
a cleaner picture than the crux data supports.

**Future improvement.** In the assessment display, show the crux resolution statuses
inline with the assessment status: "Status: settled (2 of 5 cruxes are unresolved
or theoretically underdetermined)." This prevents the assessment verdict from being read
without the qualification the crux data provides. The verdict is still accurate; it is
now accompanied by the conditions under which it is accurate.

---

## Failure 8: The system creates false confidence through visual polish.

**The risk.** This is related to failure 6 but distinct. A well-designed interface
communicates competence. Competence creates trust. Trust applied to a partially verified
working draft is misplaced trust. The design choices that make the prototype useful (clear typography, color-coded badges, expandable detail panels) may inadvertently
communicate a level of rigor that the underlying data does not yet have.

**Current mitigation.** The data_status: partial metadata is displayed as a badge on
each case page header. The needs_source_verification flag is displayed in the claim
detail panel. The limitations page and the writeup are explicit about the verification
status of the case study data.

**Where it is insufficient.** The badge is present but does not dominate. A reader
looking at the case page sees a polished interface and a small "data: partial" badge
in the header. The badge is factually correct; the overall impression is still one
of completeness rather than incompleteness. None of the claim-level UI elements
communicate the aggregate unverified status of the entry unless the reader opens a
claim detail panel.

**Future improvement.** Tie the visual style of the case interface to the data_status.
A partial entry should have a visually distinct presentation from a verified entry --
perhaps a muted color scheme, a watermark-style overlay, or a prominent annotation on
every claim badge. This is a deliberate design inversion: instead of making partial data
look clean, make clean-looking data signal its verified status. An entry earns visual
clarity by completing verification, not by existing.

---

## Summary

The eight failure modes above are not hypothetical. Several are present in the current
prototype in mild form: the partial verification status is visually underemphasized,
the confidence and failure mode flag signals are in tension without explicit
reconciliation, and the clean interface creates an impression of completeness that the
data does not fully support.

The mitigation mechanisms (needs_source_verification flags, the extraction-normalization
paper trail, the adversarial audit step, the honest limitations page) are genuine. They make the failures detectable and documentable. They do not eliminate
the failures. The practical standard the current prototype can honestly claim is:
"If you look carefully at everything this system shows you, including the flags and audit
notes, you will not be misled." That is a meaningful standard. It is not the same as
"this system will not mislead you."

That gap is what future work is for.
