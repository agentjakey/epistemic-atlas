# Prompt 09: Adversarial Audit

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

CATEGORY 1: NORMALIZATION ACCURACY
For each normalized claim, compare the normalized_text against its extracted claims
and source text. Did normalization change the assertion? Is the normalized form
narrower than the source in a way that suppresses a position? Is it broader in a way
that over-claims? Record any discrepancy.

CATEGORY 2: SOURCE COVERAGE
Are significant perspectives, positions, or bodies of evidence missing from the sources
array? Do the sources over-represent one institutional position? Name any missing
perspective specifically; do not use vague language like "more sources would help."

CATEGORY 3: FAILURE FLAG SYMMETRY
Are failure flags applied consistently across all positions? Are claims from sources
that favor one position scrutinized more carefully than claims from the other?
Count flags by position and report the breakdown.

CATEGORY 4: RELATION COMPLETENESS
Are there logical relationships between claims that should be recorded but are not?
Are any recorded relations mis-directed? Is any relation strength clearly misrated?

CATEGORY 5: CRUX QUALITY
Are the identified cruxes load-bearing? Are there cruxes that were missed? Is any
identified crux actually a contested claim rather than a true pivotal question?

CATEGORY 6: MISSING EVIDENCE FRAMING
Is the missing evidence framed neutrally? Does listing it implicitly favor one side?
Is any item listed as missing evidence actually available but not included?

CATEGORY 7: ASSESSMENT CONSISTENCY
Is the status consistent with the crux resolution data? Are any claims in
well_supported_claim_ids that have strong unaddressed attacks? Are update conditions
specific enough to be actionable?

CATEGORY 8: LLM ARTIFACTS
If this entry was built with LLM assistance: are there source references, specific
statistics, or claim attributions that may be hallucinated rather than grounded in
the actual source documents? Flag any claim or source field that cannot be verified
from the provided source text.

FORMAT: For each issue found, produce:
{
  "issue_id": "AN_NNN",
  "type": "<normalization_concern|source_gap|asymmetric_flagging|relation_error|crux_quality|missing_evidence_framing|assessment_inconsistency|llm_artifact|other>",
  "description": "<what the problem is>",
  "applies_to_ids": ["<affected ids>"],
  "severity": "<critical|significant|minor>",
  "status": "open",
  "resolution": null
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
2. Re-run Step 8 if changes affect cruxes or the assessment.
3. Record the resolution in the issue's resolution field and change status to "resolved."

For "minor" issues: use judgment. Correct if straightforward. If not correcting, record
the reason in the resolution field and change status to "dismissed."

---

## Usage Notes

- This prompt produces the audit_notes array in the graph.json file. Save the output
  there, including unresolved issues. A known open issue is better than a silent error.
- This step works best when run by someone who did not build the entry. If running it
  with the same LLM that built the entry, explicitly instruct the model to take a
  critical position rather than a validating one.
- Do not close an audit note as resolved just because a correction was attempted.
  Verify that the correction actually fixes the identified problem.
- All entries in this submission have at least one open llm_artifact audit note
  because all extracted claims require primary source verification.
