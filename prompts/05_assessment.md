# Prompt 05: Crux, Missing Evidence, and Overall Assessment

## Purpose

Identify cruxes, catalog missing evidence, and produce the overall epistemic assessment.

---

## System Context

You are building a structured epistemic knowledge base. You have normalized claims and a relation map from Steps 3 and 4. Now identify the pivotal questions (cruxes), what evidence is absent (missing evidence), and produce an honest overall assessment.

---

## Part A: Crux Identification

```
DISPUTE: {dispute_title}

DOMAIN: {domain}

NORMALIZED CLAIMS (from Step 3):
{claims_json}

RELATIONS (from Step 4):
{relations_json}

Identify the cruxes of this dispute.

DEFINITION: A crux is a specific claim or question such that:
1. If it were resolved one way, one major position in the dispute would be significantly weakened.
2. If it were resolved another way, the opposing position would be significantly weakened.
3. It is not already clearly resolved by the evidence in the atlas.

A crux is not the same as a contested claim. Many claims are contested; cruxes are the ones that are load-bearing for the dispute. Aim for 2-5 cruxes. If you identify more than 5, consider whether some are actually the same crux stated differently.

For each crux:
- State it as a clear yes/no question or a testable proposition.
- Explain why it is a crux: what changes depending on its resolution.
- List the claim IDs that depend on it.
- Assess its current status: unresolved, resolved_true, resolved_false, empirically_underdetermined, or theoretically_underdetermined.
- If resolved, explain how and by what evidence.

CRUX SCHEMA:
{
  "id": "CX_NNN",
  "statement": "<clear question or proposition>",
  "description": "<why this is a crux and what changes either way>",
  "dependent_claim_ids": ["<claim id>", ...],
  "status": "<unresolved|resolved_true|resolved_false|empirically_underdetermined|theoretically_underdetermined>",
  "resolution_notes": "<how resolved, if applicable>"
}

OUTPUT: A JSON array of crux objects. Nothing else.
```

---

## Part B: Missing Evidence

```
DISPUTE: {dispute_title}

CRUXES (from Part A):
{cruxes_json}

NORMALIZED CLAIMS (from Step 3):
{claims_json}

Identify evidence that does not currently exist in accessible form but whose existence would change the epistemic status of at least one crux or significantly contested claim.

DEFINITION: Missing evidence is not simply evidence that one side has not provided. It is evidence that:
1. Does not exist in any publicly accessible form, OR
2. Cannot be produced with current technology or methods, OR  
3. Has never been collected despite being collectable.

Do not list as missing evidence: evidence that exists but was not included in the atlas, or evidence that one party in the dispute has declined to share.

For each item:
- Describe what the evidence would be.
- Explain why it is absent (not yet studied, technically impossible, requires access not currently available, etc.).
- List the crux or claim IDs it would affect.
- Assign priority: critical (its absence directly prevents resolution), important (would significantly clarify), helpful (would add precision but is not blocking).

MISSING EVIDENCE SCHEMA:
{
  "id": "ME_NNN",
  "description": "<what the evidence is and why it is absent>",
  "type": "<empirical|theoretical|historical|legal_institutional>",
  "would_affect_ids": ["<crux or claim id>", ...],
  "priority": "<critical|important|helpful>"
}

OUTPUT: A JSON array of missing evidence objects. Nothing else.
```

---

## Part C: Overall Assessment

```
DISPUTE: {dispute_title}

CLAIMS (from Step 3):
{claims_json}

RELATIONS (from Step 4):
{relations_json}

CRUXES (from Part A):
{cruxes_json}

Produce an overall epistemic assessment of the dispute.

RULES:
1. Be honest about what the evidence supports and does not support.
2. Do not flatten genuine uncertainty into a false consensus.
3. Do not inflate genuine consensus into manufactured controversy.
4. Well-supported claims are those with high or medium confidence and no significant unaddressed attacks.
5. Contested claims are those where significant pro and con claims exist and no crux has resolved them.
6. The epistemic_status field should be a plain-language summary that a non-specialist could understand.

ASSESSMENT SCHEMA:
{
  "epistemic_status": "<plain-language summary of the current state of the dispute>",
  "resolved": <true|false>,
  "resolution_summary": "<if resolved, what the resolution is and what resolved it>",
  "well_supported_claim_ids": ["<claim id>", ...],
  "contested_claim_ids": ["<claim id>", ...],
  "failure_modes_observed": ["<failure mode>", ...],
  "notes": "<any additional observations>"
}

OUTPUT: A single assessment object. Nothing else.
```

---

## Usage Notes

- The overall assessment should be consistent with the claim and relation level data. If the assessment calls a claim "well-supported" but the claim has three strong attacks in the relation map, there is an inconsistency that needs to be resolved.
- Failure modes observed in the assessment should be a superset of all failure flags attached to individual claims.
- This step often reveals that normalization was imprecise or that relations were missed. It is acceptable to revise earlier steps based on what emerges here.
