# Epistemic Atlas Schema v2 -- Plain English Guide

This guide explains what the schema does and why, in the order you would encounter the objects when building an atlas entry.

---

## The Object Hierarchy

```
Case
  sources[]               -- where the evidence comes from
  extracted_claims[]      -- what the sources actually say
  normalized_claims[]     -- standardized versions of those claims
  relations[]             -- how the normalized claims relate to each other
  cruxes[]                -- the pivotal questions
  failure_mode_flags[]    -- where the reasoning breaks down
  assessment              -- the overall verdict
  missing_evidence[]      -- what we need but don't have
  audit_notes[]           -- adversarial review record
```

---

## Case

The root container. One Case = one atlas entry = one JSON file.

The `data_status` field is critical: `verified` means every claim was checked against the primary source; `partial` means some were; `sample` means the data is illustrative only and should not be treated as a verified record.

---

## Source

A document, paper, statement, or other artifact. Every extracted claim must trace back to a source.

Key design decision: **low-credibility sources are included, not discarded**. Their presence is informative. A `credibility: "low"` source is recorded alongside the reasons for that assessment.

The `conflict_of_interest` field is populated even when there is no conflict (`null`). This makes the absence of a conflict an explicit recorded fact rather than an omission.

---

## ExtractedClaim

The raw claim as it appears in the source -- verbatim or minimal paraphrase. Nothing is changed at this stage.

**Rule**: preserve all hedges (`may`, `suggests`, `is consistent with`) and all quantification (`some studies`, `in populations with X`). A claim with a hedge is not the same claim without it.

Why separate from NormalizedClaim? Because multiple sources can say essentially the same thing. By keeping extraction separate from normalization, multiple ExtractedClaims from different sources can be aggregated into one NormalizedClaim -- and the full provenance of each extracted form is preserved.

---

## NormalizedClaim

The standardized, unambiguous version. This is where the real interpretive work happens.

Normalization resolves:
- Ambiguous referents ("it", "this study")
- Undefined scope ("eggs are bad" -- for whom? under what conditions?)
- Implicit quantification
- Hedges that need to be made explicit in the statement text

The `extracted_claim_ids` field links to all the ExtractedClaims this normalization is based on. When multiple sources make the same claim, this field has multiple IDs -- and that is itself epistemically significant (independent corroboration).

The `hedges` field preserves the original epistemic hedging as metadata, even when it is also embedded in the normalized text.

---

## Relation

A directed edge in the claim graph. Direction always matters.

The vocabulary distinguishes:
- **Argumentative** (`supports`, `attacks`): logical justification or contradiction
- **Empirical** (`evidence_for`, `evidence_against`): observational data that raises or lowers probability
- **Structural** (`depends_on`, `narrows`, `generalizes`, `reframes`): how claims constrain or contextualize each other
- **Epistemic status** (`duplicates`, `conflicts_with`): how claims relate without necessarily being in logical opposition

The difference between `attacks` and `conflicts_with`: attacks implies direct logical contradiction. `conflicts_with` says the claims cannot both be fully right but neither strictly entails the other's falsity -- they are in tension without clean logical resolution. This distinction matters for accurately representing the state of a dispute.

The difference between `supports` and `evidence_for`: `supports` covers both logical justification and empirical support. `evidence_for` specifically means observational data that increases the probability of B -- it is more precise and carries stronger epistemic weight.

---

## Crux

A pivotal question. Not just any contested claim -- specifically a load-bearing one.

Test: if you resolve the crux one way, does one major position in the dispute become significantly harder to hold? If yes for both directions, it is a crux.

The `status` field distinguishes between `unresolved` (work to be done), `empirically_underdetermined` (the evidence needed to resolve it does not yet exist), and `theoretically_underdetermined` (the theoretical framework needed to evaluate it is not established). These are importantly different.

---

## FailureModeFlag

A first-class annotation for specific epistemic failure modes. Flags attach to individual NormalizedClaims, Sources, or Relations -- not to the case as a whole. This precision matters for cross-case analysis.

The vocabulary was chosen to cover failures that are hard to notice but common:

- `correlated_evidence_treated_as_independent`: when multiple studies draw on the same underlying data, methods, or theoretical framework, they are not independent corroboration. Treating them as such inflates apparent evidential weight.

- `rhetorical_weight_exceeds_evidence`: a claim is asserted frequently, confidently, or by high-status sources, and this rhetorical force carries more argumentative weight than the evidence actually justifies.

- `hidden_assumption`: the argument requires an unstated premise. Making it explicit often reveals it requires its own justification.

- `source_incentive_pressure`: the source benefits from the conclusion it reaches. This does not mean the conclusion is wrong, but it means the source's analysis requires more independent corroboration than it would otherwise.

- `proxy_measure_problem`: studies often cannot measure the true quantity of interest and instead measure a proxy. LDL cholesterol is a proxy for cardiovascular disease risk. If the proxy-target relationship is not established, conclusions about the target are unsupported.

- `population_heterogeneity`: averages over heterogeneous populations can hide the fact that the effect goes in opposite directions for different subgroups.

- `temporal_drift`: evidence from a different time period may not apply to the present if the relevant conditions have changed.

- `closed_case_overconfidence`: the most common failure mode in retrospect. Treating something as settled when it is not. The history of science is full of these.

- `vague_question`: "Is X safe?" is not a well-defined question. Safe for whom? Under what conditions? At what dose? A vague question cannot be clearly answered, and apparent answers to it often answer different specific questions.

- `analogy_dependency`: the cosmic ray argument in the LHC case is an analogy. Analogies are valid as far as they hold. The flag marks places where the analogy's limits are not acknowledged.

- `direct_evidence_absent`: the conclusion goes beyond what direct evidence supports. This is stronger than `hidden_assumption` -- it means the entire evidentiary basis is indirect.

- `expert_consensus_without_dependency_map`: citing expert consensus is common and sometimes legitimate, but it is epistemically shallow unless you can also show what that consensus depends on. If the dependencies are not mapped, you cannot assess whether new evidence should update the consensus.

---

## Assessment

The overall verdict. Three things distinguish the v2 assessment from a generic summary:

**Settled vs. unsettled**: The assessment must take a position on whether the dispute has a clear resolution. Not "there is ongoing debate" -- that is always true of any documented dispute. The question is whether the evidence supports a clear conclusion.

**Weak links**: The assessment identifies which NormalizedClaims are the weakest links in the dominant argument. If the argument depends on a claim with `closed_case_overconfidence` and `low` confidence, that is a weak link that should be named.

**What would update**: The forward-looking question. This forces the assessment to be falsifiable. If no evidence could ever change the conclusion, the assessment is not epistemically serious. Each scenario specifies what the evidence is, what it would affect, which direction, and how decisively.

---

## MissingEvidence

Evidence that does not exist in any accessible form. Distinguishable from:
- Evidence that exists but was not cited (a source gap, recorded in AuditNotes)
- Evidence that exists but was withheld (a legal_institutional type)
- Evidence that one party has simply not provided

The `reason_absent` and `feasibility` fields make explicit why the evidence does not exist. Some evidence is absent because no one has collected it yet (feasible). Some because it is technically impossible. Some because the required trial would be unethical. These have different implications for when resolution might come.

---

## AuditNote

The adversarial review record. AuditNotes are created during Step 6 (adversarial review) and may also be added by readers.

The `status` field (`open`, `resolved`, `dismissed`) keeps the audit log live. A `dismissed` note with a `resolution` explanation is better than a deleted note -- it shows the issue was considered.

The `llm_artifact` type is specifically for atlas entries built with LLM assistance, where a claim, source reference, or relation may have been generated without grounding in actual source text.
