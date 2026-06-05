# Prompt 07: Failure Mode Flagging

## Purpose

Identify and attach epistemic failure modes to specific normalized claims and sources.
Flags must be applied symmetrically across all positions in the dispute.

---

## System Context

You have normalized claims, relations, cruxes, and sources. Now apply failure mode flags
to the specific claims and sources where epistemic failures are present. This step is
the most sensitive to bias: it is easy to scrutinize claims from one side more carefully
than the other. The symmetry check at the end of this prompt is mandatory.

---

## Failure Mode Vocabulary

The following twelve types are the controlled vocabulary for this schema. Do not invent
new types. If a failure mode is present but does not fit any of the twelve, note it in
the flag's description field and use the closest match.

| Type | When to apply |
|------|---------------|
| correlated_evidence_treated_as_independent | Multiple sources presented as independent when they share authors, data, institutional context, or were funded by the same party |
| rhetorical_weight_exceeds_evidence | The claim is stated with more confidence than the underlying evidence supports; the language implies certainty that the data does not provide |
| hidden_assumption | The claim is only valid conditional on an unstated assumption that a reasonable reader would not recognize as contested |
| source_incentive_pressure | The source has a documented financial or institutional incentive that creates plausible directional bias for this specific claim |
| proxy_measure_problem | The claim uses a proxy measure (e.g., LDL as proxy for CVD risk) where the proxy-to-outcome relationship is itself contested |
| population_heterogeneity | The claim aggregates across subpopulations with meaningfully different outcomes, masking variation that changes the epistemic status |
| temporal_drift | The claim was accurate in a prior period but conditions have changed enough that its current validity is uncertain |
| closed_case_overconfidence | The dispute is treated as settled when at least one significant crux remains unresolved or underdetermined |
| vague_question | The claim responds to an imprecisely scoped question, making it true under some interpretations and false under others |
| analogy_dependency | The argument depends on an analogy (astrophysical body / LHC, animal model / human outcome) where the analogy's validity is contested |
| direct_evidence_absent | No direct empirical evidence for this claim exists; it rests on inference, extrapolation, or theoretical argument only |
| expert_consensus_without_dependency_map | Expert agreement is cited without identifying the underlying claims the consensus depends on |

---

## Prompt Template

```
DISPUTE: {dispute_title}

NORMALIZED CLAIMS (from Step 4):
{normalized_claims_json}

SOURCES (from Step 2):
{sources_json}

CRUXES (from Step 6):
{cruxes_json}

Apply failure mode flags to specific normalized claims and sources.

RULES:
1. Flags attach to specific claims or sources, not to the case as a whole.
   Do not write a flag without naming which claim or source it applies to.
2. A flag is only valid if you can point to something specific in the source material
   or in the structure of the claim. Do not flag based on prior beliefs about a source.
3. Apply flags to claims from ALL positions. If you flag a claim from one side for
   rhetorical_weight_exceeds_evidence, check every claim on the other side for the
   same pattern before concluding it is not present.
4. If the same failure mode applies to multiple claims, create one flag per claim.
5. Severity ratings:
   - critical: the failure mode changes the claim's conclusion if corrected
   - significant: the failure mode should be disclosed but the claim may still hold
   - minor: worth noting but unlikely to change any conclusion

FLAG SCHEMA:
{
  "id": "FF_NNN",
  "type": "<one of the twelve types>",
  "description": "<specific description of how this failure mode manifests in this claim>",
  "applies_to_id": "<NC_id or src_id>",
  "applies_to_type": "<normalized_claim|source>",
  "severity": "<critical|significant|minor>",
  "affects_conclusion": <true|false>,
  "notes": "<any additional context, or null>"
}

OUTPUT: A JSON array of failure mode flag objects. Nothing else.
```

---

## Symmetry Check

Before finalizing this step, perform the following audit:

1. Count flags by position (pro / con / neutral / methodological). If one position has
   significantly more flags, examine whether you looked equally carefully at both sides.
2. For each type that appears more than once, verify that it is present for the same
   substantive reason -- not because you looked harder at one side.
3. For source_incentive_pressure: have you checked all sources for industry funding,
   institutional affiliation conflicts, and grant dependencies -- not just the sources
   that support the position you are more skeptical of?
4. For correlated_evidence_treated_as_independent: have you checked for shared authorship
   and shared data across all sources, not just sources from one institution?

If the symmetry check reveals you missed flags, add them now. If it reveals that one side
genuinely has more flags for substantiated reasons, note this in the assessment notes.

---

## Usage Notes

- The flag IDs produced here are referenced by the normalized claims via their
  failure_mode_flag_ids field. After creating flags, update the affected normalized
  claim objects to include the flag IDs in their failure_mode_flag_ids lists.
- The Assessment step (Step 8) uses flags to populate dominant_failure_modes.
  Make sure the flag types you apply here map directly to what the assessment will report.
- A claim with multiple flags may still be well-supported. Flags document risks;
  they do not automatically disqualify the claim.
