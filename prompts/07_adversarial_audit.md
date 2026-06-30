# Prompt 07: Adversarial Audit

## Purpose

Test the integrity of the completed atlas entry by actively trying to find problems.
This is the final step before marking an entry as ready for review.

---

## System Context

You are reviewing a completed Epistemic Atlas entry. Your goal is not to validate it
but to break it. You are looking for normalization errors, asymmetric failure flagging,
missed cruxes, inconsistent assessments, source selection bias, and hallucinated
references. Every issue you find should result in either a correction or a documented
reason why no correction is needed.

---

## Prompt Template

```
DISPUTE: {dispute_title}

COMPLETE ATLAS ENTRY (all three files):
{full_entry_json}

You are an adversarial reviewer. Your job is to find problems with this entry.
Do not validate what is correct. Find what is wrong.

Check all eight categories below. For each category, report at least one finding
(pass or issue) before moving to the next.

CATEGORY 1: EXTRACTION FAITHFULNESS AND NORMALIZATION ACCURACY
First, for each extracted claim, check that raw_text stays faithful to the source: no
paraphrase that adds, drops, or shifts meaning, and hedges and scope qualifiers preserved.
Then, for each normalized claim, compare normalized_text against its extracted_claim_ids and
the source text. Did normalization change the assertion? Is the normalized form narrower than
the source in a way that suppresses a position, or broader in a way that overstates what the
extracted claims support? Record any discrepancy.

CATEGORY 2: SOURCE COVERAGE
Are significant perspectives, positions, or bodies of evidence missing from the sources
array? Do the sources over-represent one institutional position? Name any missing
perspective specifically; do not use vague language like "more sources would help."

CATEGORY 3: FAILURE FLAG SYMMETRY AND SPECIFICITY
Are failure flags applied consistently across all positions? Are claims from sources
that favor one position scrutinized more carefully than claims from the other?
Count flags by position and report the breakdown. Are the flags specific and useful, each
pointing to something concrete in a particular claim, source, or relation, rather than generic
restatements of the failure-mode definition?

CATEGORY 4: RELATION COMPLETENESS AND GROUNDING
Are there logical relationships between claims that should be recorded but are not?
Are any recorded relations mis-directed? Is any relation strength clearly misrated?
Is each relation in the right family (supports, opposes, depends_on, contextualizes,
equivalent)? Is each relation's basis honest? A relation marked asserted_in_source should
actually be stated by that source. A relation that is really an analyst inference should be
marked analyst_inferred or inferred_across_sources, not dressed up as source-asserted. Flag
any relation whose basis overstates its grounding. Note where an inferred_across_sources
relation could be promoted to asserted_in_source, but only if a specific source supports the
link directly. Also check the reverse problem: are too many relations marked analyst_inferred
or inferred_across_sources without notes that explain the reasoning? An inferred relation
should still carry a note that makes the inference checkable.

CATEGORY 5: CRUX QUALITY
Are the identified cruxes load-bearing? Are there cruxes that were missed? Is any
identified crux actually a contested claim rather than a true pivotal question?

CATEGORY 6: MISSING EVIDENCE FRAMING
Is the missing evidence framed neutrally? Does listing it implicitly favor one side?
Is any item listed as missing evidence actually available but not included? For items that
clearly imply a next action, should they carry a trigger such as reingest (the evidence may be
obtainable from sources not yet consulted), rescope (the gap shows the question was framed too
broadly), or reassess (the conclusion would move if the evidence arrived)?

CATEGORY 7: ASSESSMENT CONSISTENCY
Is the status consistent with the crux resolution data? Are any claims in
well_supported_claim_ids that have strong unaddressed opposing relations? Does the assessment
layer overstate what the core knowledge layer actually supports, for example by leaning on
analyst-inferred or unverified relations as if they were firmly established? Are update
conditions specific enough to be actionable?

CATEGORY 8: LLM ARTIFACTS
If this entry was built with LLM assistance: are there source references, specific
statistics, or claim attributions that may be hallucinated rather than grounded in
the actual source documents? Flag any claim or source field that cannot be verified
from the provided source text.

An audit note may carry an optional triggers array (rescope, reingest, reextract,
renormalize, remap_relations, reassess, re_review) recording which workflow pass its
resolution would require. A source-gap note is a natural candidate for reingest; a
normalization concern for renormalize; a relation grounding concern for remap_relations.
Attach triggers only where the note clearly implies a next action.

FORMAT: For each issue found, produce:
{
  "id": "AN_NNN",
  "type": "<normalization_concern|source_gap|asymmetric_flagging|relation_error|crux_quality|missing_evidence_framing|assessment_inconsistency|verification_needed|llm_artifact|other>",
  "description": "<what the problem is>",
  "applies_to_ids": ["<affected ids>"],
  "severity": "<critical|significant|minor>",
  "status": "open",
  "resolution": null,
  "triggers": ["<optional workflow triggers>"]
}

For categories with no issues, produce a pass record with status: "resolved" and
resolution: "PASS".

OUTPUT: A JSON array of audit note objects. Nothing else.
```

---

## Resolution Protocol

After the audit produces its issue list, for each issue with severity "critical" or
"significant":

1. Return to the appropriate earlier step and make the correction.
2. Re-run the assessment-layer step (06_assessment_layer.md) if changes affect cruxes,
   failure mode flags, missing evidence, or the assessment.
3. Record the resolution in the issue's resolution field and change status to "resolved."

For "minor" issues: use judgment. Correct if straightforward. If not correcting, record
the reason in the resolution field and change status to "dismissed."

---

## Usage Notes

- This prompt produces the audit_notes array, which lives inside assessment_layer in the
  graph.json file. Save the output there, including unresolved issues. A known open issue is
  better than a silent error.
- If you are recording this audit as a standalone reviewer rather than the original builder,
  you may also add a Review object to assessment_layer.reviews (with your role, for example
  adversary or domain_expert, and a summary of what you found). Only add a Review for an
  actual review that was performed. Do not fabricate an external review that did not happen.
- This step works best when run by someone who did not build the entry. If running it
  with the same LLM that built the entry, explicitly instruct the model to take a
  critical position rather than a validating one.
- Do not close an audit note as resolved just because a correction was attempted.
  Verify that the correction actually fixes the identified problem.
- All entries in this submission have at least one open llm_artifact audit note
  because all extracted claims require primary source verification.
