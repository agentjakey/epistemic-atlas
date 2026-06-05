# Prompt 08: Missing Evidence and Overall Assessment

## Purpose

Catalog evidence that does not exist but would resolve open cruxes. Produce the overall
epistemic assessment: status, weak links, dominant failure modes, and explicit
what-would-update conditions.

This step depends on the output of Steps 4 (normalized claims), 5 (relations), 6 (cruxes),
and 7 (failure mode flags).

---

## System Context

You have normalized claims, relations, cruxes, and failure mode flags. Now identify what
evidence is structurally missing and synthesize an honest overall assessment. The assessment
must be internally consistent with the claim- and crux-level data: a claim called
"well-supported" must not have unaddressed strong attacks in the relation map.

---

## Part A: Missing Evidence

```
DISPUTE: {dispute_title}

CRUXES (from Step 6):
{cruxes_json}

NORMALIZED CLAIMS (from Step 4):
{normalized_claims_json}

Identify evidence that does not currently exist in accessible form but whose existence
would change the epistemic status of at least one crux or significantly contested claim.

DEFINITION: Missing evidence is not simply evidence one side has not provided. It is
evidence that:
1. Does not exist in any publicly accessible form, OR
2. Cannot be produced with current technology or methods, OR
3. Has never been collected despite being collectable.

Do not list evidence that exists but was not included in the atlas, or evidence that one
party in the dispute has declined to share.

For each item:
- Describe what the evidence would be specifically.
- Explain why it is absent (not yet studied, technically infeasible, requires access
  not currently available, study design not yet run, etc.).
- List the crux or normalized claim IDs it would affect.
- Assign priority: critical (its absence directly prevents resolution), important
  (would significantly clarify), helpful (would add precision but not blocking).
- Assign feasibility: feasible (could be obtained with current methods), infeasible
  (cannot be obtained with current methods or in principle), unknown.

MISSING EVIDENCE SCHEMA:
{
  "id": "ME_NNN",
  "description": "<what the evidence is and why it is absent>",
  "type": "<empirical|theoretical|historical|legal_institutional>",
  "would_affect_ids": ["<CX_id or NC_id>", ...],
  "priority": "<critical|important|helpful>",
  "reason_absent": "<specific reason this evidence does not exist>",
  "feasibility": "<feasible|infeasible|unknown>"
}

OUTPUT: A JSON array of missing evidence objects. Nothing else.
```

---

## Part B: Overall Assessment

```
DISPUTE: {dispute_title}

NORMALIZED CLAIMS (from Step 4):
{normalized_claims_json}

RELATIONS (from Step 5):
{relations_json}

CRUXES (from Step 6):
{cruxes_json}

FAILURE MODE FLAGS (from Step 7):
{flags_json}

Produce an overall epistemic assessment of the dispute.

RULES:
1. The status must match the crux-level data. If any key crux is unresolved or
   underdetermined, the status cannot be "settled" without explanation.
2. Do not flatten genuine uncertainty into false consensus.
3. Do not inflate genuine consensus into manufactured controversy.
4. The settled_direction, if present, must be specific enough that a reader could
   verify it against the claim data. "The evidence is mixed" is not a settled direction.
5. what_would_update must contain concrete scenarios, not vague conditions.
   "A well-powered Mendelian randomization study replicating across populations" is
   concrete. "More research" is not.
6. weak_link_ids are claims that the overall conclusion depends on but where confidence
   is lowest or failure mode flags are present.

ASSESSMENT SCHEMA:
{
  "status": "<settled|unsettled|partially_settled>",
  "settled_direction": "<specific direction if settled, or null>",
  "epistemic_status_summary": "<2-3 sentence plain-language summary for a non-specialist>",
  "key_crux_ids": ["<CX_id>", ...],
  "weak_link_ids": ["<NC_id>", ...],
  "well_supported_claim_ids": ["<NC_id>", ...],
  "contested_claim_ids": ["<NC_id>", ...],
  "dominant_failure_modes": ["<failure mode type>", ...],
  "what_would_update": [
    {
      "scenario": "<specific scenario>",
      "would_affect_ids": ["<NC_id or CX_id>", ...],
      "direction": "<strengthen|weaken|resolve>",
      "magnitude": "<decisive|significant|minor>"
    }
  ],
  "notes": "<any additional observations about the assessment>"
}

OUTPUT: A single assessment object. Nothing else.
```

---

## Usage Notes

- If the assessment calls a claim "well-supported" but the relation map contains three
  strong attacks on that claim with no counterarguments, revise the assessment or revisit
  the relation map. Internal consistency is required.
- The dominant_failure_modes list should be a subset of the failure mode types found
  in the flags from Step 7. Do not list failure modes that were not flagged.
- This step often reveals that normalization was imprecise or that relations are missing.
  It is acceptable to revise earlier steps before finalizing the assessment.
- The assessment is not a verdict or a recommendation. It is an honest epistemic
  characterization of where the evidence stands at the time of encoding.
