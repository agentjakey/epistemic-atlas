# Prompt 06: Crux Identification

## Purpose

Identify the pivotal questions whose resolution would significantly change the outcome
of the dispute. Cruxes are first-class objects with their own ID space, resolution status,
and dependency links to normalized claims.

---

## System Context

You have normalized claims (from Step 4) and a relation map (from Step 5). Now identify
the cruxes -- the 2 to 7 questions that are genuinely load-bearing for the dispute. Most
disputes have far fewer real cruxes than they appear to; many contested claims reduce to
the same underlying question when examined carefully.

---

## Prompt Template

```
DISPUTE: {dispute_title}

DOMAIN: {domain}

NORMALIZED CLAIMS (from Step 4):
{normalized_claims_json}

RELATIONS (from Step 5):
{relations_json}

Identify the cruxes of this dispute.

DEFINITION: A crux is a specific question or proposition such that:
1. If it resolved one way, one major position would be significantly weakened.
2. If it resolved the other way, the opposing position would be significantly weakened.
3. Its resolution depends on evidence or theoretical work that does not yet clearly
   exist in the atlas -- it is not just a contested claim where the evidence is already
   present but disputed.

WHAT A CRUX IS NOT:
- A crux is not the same as a contested claim. Many claims are contested; cruxes are
  the ones where resolution would cascade through the argument structure.
- A crux is not a general statement of uncertainty. "We do not know enough about X"
  is not a crux. "Would evidence of type Y change the dispute?" can be.
- Do not list more than 7 cruxes. If you find more, you have not identified the
  load-bearing questions; you have listed the contested claims.

For each crux:
- State it as a specific, answerable question or testable proposition.
- Explain why it is a crux: what changes in the overall dispute depending on resolution.
- List the normalized claim IDs whose validity depends on this crux.
- Assess the current resolution status honestly.
- If resolved, explain how and by what evidence (name the source IDs).

STATUS OPTIONS:
- unresolved: no current evidence resolves this; both directions remain open
- resolved_true: evidence supports the proposition as stated
- resolved_false: evidence refutes the proposition as stated
- empirically_underdetermined: would require evidence that does not yet exist
- theoretically_underdetermined: depends on theoretical work that is not yet settled

CRUX SCHEMA:
{
  "id": "CX_NNN",
  "statement": "<clear question or testable proposition>",
  "description": "<why this is a crux and what changes either way>",
  "dependent_normalized_claim_ids": ["<NC_id>", ...],
  "status": "<status value>",
  "resolution_notes": "<how resolved, or why underdetermined, or null>",
  "resolution_source_ids": ["<src_id>", ...]
}

OUTPUT: A JSON array of crux objects. Nothing else.
```

---

## Crux Quality Check

Before finalizing the cruxes, verify each one:

- If this crux resolved tomorrow, would the overall assessment actually change?
  If not, it is not a crux; it is a contested claim.
- Are two of your cruxes actually the same question? State each differently enough
  that they have meaningfully different dependent_normalized_claim_ids lists.
- Is the resolution status honest? "Resolved" requires a named mechanism and source.
  "Expert consensus" without a named mechanism is not a resolution; it is a candidate
  for the expert_consensus_without_dependency_map failure mode flag.
- Are you using "empirically_underdetermined" when you mean "unresolved"? The
  distinction matters: unresolved means the evidence could exist but does not yet;
  empirically_underdetermined means the evidence is structurally unavailable
  (e.g., the relevant events are in the unobservable past, or the study would be
  unethical to run).

---

## Usage Notes

- The crux IDs produced here are referenced by the Assessment step (Step 8).
  Do not change them after Step 6 without updating all references.
- If a crux is identified as resolved, record the resolution now rather than
  noting it as a gap. A resolved crux is still a crux; it just tells you the
  strength of the argument from that direction.
- Cross-reference with the missing_evidence section (Step 8): every empirically_
  underdetermined or unresolved crux should have a corresponding missing evidence
  item explaining what would resolve it.
