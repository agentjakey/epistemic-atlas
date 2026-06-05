# Prompt 06: Adversarial Review

## Purpose

Test the integrity of the completed atlas entry by actively trying to find problems. This is the last step before finalizing.

---

## System Context

You are reviewing a completed Epistemic Atlas entry. Your goal is not to validate it but to break it. You are looking for errors, biases, missed sources, bad normalizations, asymmetric failure flagging, and inconsistencies. Every issue you find should result in either a correction or a documented reason why no correction is needed.

---

## Prompt Template

```
DISPUTE: {dispute_title}

COMPLETE ATLAS ENTRY:
{full_atlas_json}

You are an adversarial reviewer. Your job is to find problems with this atlas entry. Do not be polite. Do not validate what is done correctly. Find what is wrong.

Check each of the following:

1. NORMALIZATION DRIFT
   For each claim, compare the raw and normalized forms. Did the normalization meaningfully change what is being asserted? Is the normalized form narrower than the raw form in a way that favors one position? Is it broader in a way that over-claims?

2. SOURCE COVERAGE
   Are there significant perspectives, positions, or bodies of evidence that are not represented in the sources? Name them specifically. Do the sources over-represent one institutional position (e.g., only government sources, only industry sources, only academic sources)?

3. ASYMMETRIC FAILURE FLAGGING
   Are failure flags applied consistently? Are claims from sources that favor one position scrutinized more heavily than claims from the other? Is motivated_reasoning flagged for one side but not applied where it also appears on the other?

4. RELATION COMPLETENESS
   Are there relationships between claims that should have been recorded but were not? Are any recorded relationships mis-directed (A supports B when the correct relation is B supports A)?

5. CRUX QUALITY
   Are the identified cruxes actually load-bearing? Are there cruxes that were missed? Is any identified crux actually a contested claim rather than a true crux?

6. MISSING EVIDENCE FRAMING
   Is the missing evidence framed neutrally? Does listing this evidence implicitly favor one position? Is any item listed as missing evidence actually not missing (it exists but was not included)?

7. ASSESSMENT CONSISTENCY
   Is the overall assessment consistent with the claim and relation data? Are any claims in well_supported_claim_ids that have significant unaddressed attacks? Are any contested claims actually well-resolved by the evidence?

8. LLM ARTIFACTS
   If this entry was built with LLM assistance: are there any source references, claim attributions, or specific factual statements that might be hallucinated rather than grounded in the actual source text?

FORMAT:
For each problem found, output:
{
  "issue_id": "ADV_NNN",
  "category": "<one of the 8 categories above>",
  "description": "<what the problem is>",
  "affected_ids": ["<ids of affected claims, relations, cruxes, etc.>"],
  "severity": "<critical|significant|minor>",
  "recommended_action": "<what should be changed>",
  "resolution": null
}

If you find no problems in a category, output:
{
  "issue_id": "ADV_NNN",
  "category": "<category>",
  "description": "No issues found.",
  "affected_ids": [],
  "severity": null,
  "recommended_action": null,
  "resolution": "PASS"
}

OUTPUT: A JSON array of issue objects covering all 8 categories. Nothing else.
```

---

## Resolution Step

After the adversarial review produces its issue list, for each issue with severity "critical" or "significant":
1. Return to the appropriate earlier step and correct the issue.
2. Re-run Step 5 if changes affect cruxes or the assessment.
3. Record the resolution in the issue object's `resolution` field.

For "minor" issues: use judgment. Correct if straightforward. Document if not correcting and why.

---

## Usage Notes

- This prompt works best when run by someone who did not build the entry, or when the LLM is explicitly instructed to take a contrary position.
- The adversarial review is not a guarantee of correctness. It is a structured attempt to catch the most common failure modes before finalizing.
- A complete adversarial review log should be retained alongside the entry to show that this step was performed and what it found.
