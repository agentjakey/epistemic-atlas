# Epistemic Atlas Schema v3: Plain English Guide

This guide explains what the schema does and why, in the order you would encounter the objects when building an atlas entry.

The schema is built around four design choices. First, relations use five broad families, with nuance carried by `subtype`, `tags`, `basis`, and `notes`. Second, there is no hard distinction between logical `supports` and empirical `evidence`. Third, the case is split into two layers: a reusable knowledge structure and a more subjective `assessment_layer`. Fourth, the schema supports multiple assessments and reviews over the same structure, plus nonlinear workflow triggers.

---

## The Object Hierarchy

```
Case
  -- core knowledge layer (reusable, comparatively objective) --
  sources[]                 -- where the evidence comes from
  extracted_claims[]        -- what the sources actually say
  normalized_claims[]       -- standardized versions of those claims
  relations[]               -- how the normalized claims relate to each other

  -- assessment_layer (more subjective, can be revised or contested) --
  assessment_layer
    cruxes[]                -- the pivotal questions
    failure_mode_flags[]    -- where the reasoning breaks down
    missing_evidence[]      -- what we need but don't have
    assessments[]           -- one or more overall verdicts
    reviews[]               -- adversarial / multi-user scrutiny
    audit_notes[]           -- adversarial review record
```

The split is deliberate. The core layer is the part most worth reusing across tools and people: who said what, how the claims connect, what is grounded in a source versus inferred. The `assessment_layer` is where judgment enters, and judgment can legitimately differ, so the schema lets more than one assessment or review sit over the same core structure without overwriting each other.

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

The raw claim as it appears in the source: verbatim or minimal paraphrase. Nothing is changed at this stage.

**Rule**: preserve all hedges (`may`, `suggests`, `is consistent with`) and all quantification (`some studies`, `in populations with X`). A claim with a hedge is not the same claim without it.

Why separate from NormalizedClaim? Because multiple sources can say essentially the same thing. By keeping extraction separate from normalization, multiple ExtractedClaims from different sources can be aggregated into one NormalizedClaim, and the full provenance of each extracted form is preserved.

---

## NormalizedClaim

The standardized, unambiguous version. This is where the real interpretive work happens.

Normalization resolves:
- Ambiguous referents ("it", "this study")
- Undefined scope ("eggs are bad": for whom? under what conditions?)
- Implicit quantification
- Hedges that need to be made explicit in the statement text

The `extracted_claim_ids` field links to all the ExtractedClaims this normalization is based on. When multiple sources make the same claim, this field has multiple IDs, and that is itself epistemically significant (independent corroboration).

The `hedges` field preserves the original epistemic hedging as metadata, even when it is also embedded in the normalized text.

---

## Relation

A directed edge in the claim graph. Direction always matters.

The schema uses **five broad families**. They are deliberately broad; finer distinctions go into `subtype` (free text), `tags`, and `notes` rather than into a large fixed vocabulary.

- **supports** -- A raises the credibility of B, whether by logical justification or by empirical evidence.
- **opposes** -- A lowers the credibility of B or stands in tension with it. This covers direct contradiction, empirical evidence against, and mutual tension.
- **depends_on** -- A is only meaningful or true if B is true.
- **contextualizes** -- A changes the scope or interpretation of B without simply supporting or opposing it. This covers narrowing, generalizing, and reframing.
- **equivalent** -- A and B assert the same proposition, usually from different sources.

**No hard supports-vs-evidence distinction.** Logical justification and empirical evidence both live in the `supports` family, because that line is often not crisp: a single relation can be both, or its character can be contested. If the distinction matters in a given case, record it in `subtype` (for example `"logical"` or `"empirical"`) or in `tags`, where it is an annotation rather than a forced choice. Tension that is not a clean contradiction goes in the `opposes` family with a `subtype` such as `"mutual_tension"`.

**How the relation is grounded: the `basis` field.** Every relation records where it comes from:
- `asserted_in_source` -- a single source states the relation directly.
- `asserted_by_later_source` -- a later source explicitly draws the connection between earlier claims.
- `inferred_across_sources` -- the relation is synthesized by comparing several sources, none of which states it outright.
- `analyst_inferred` -- the relation is the annotator's own logical inference, not stated by any source.
- `unclear` -- the grounding has not been determined.

This matters because a reader needs to know whether an edge reflects what a source actually said or what an annotator concluded. The two carry very different epistemic weight. When the basis is `asserted_in_source` or `asserted_by_later_source`, `basis_source_ids` names the source(s). Relations whose basis is `analyst_inferred`, `inferred_across_sources`, or `unclear` are good candidates for `needs_source_verification: true`.

---

## Crux

A pivotal question. Not just any contested claim; specifically a load-bearing one.

Test: if you resolve the crux one way, does one major position in the dispute become significantly harder to hold? If yes for both directions, it is a crux.

The `status` field distinguishes between `unresolved` (work to be done), `empirically_underdetermined` (the evidence needed to resolve it does not yet exist), and `theoretically_underdetermined` (the theoretical framework needed to evaluate it is not established). These are importantly different.

A crux can carry an optional `triggers` array (see Workflow Triggers below). For example, a crux marked `empirically_underdetermined` might trigger `reassess` once the relevant evidence appears.

---

## FailureModeFlag

A first-class annotation for specific epistemic failure modes. Flags attach to individual NormalizedClaims, Sources, or Relations, not to the case as a whole. This precision matters for cross-case analysis.

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

- `direct_evidence_absent`: the conclusion goes beyond what direct evidence supports. This is stronger than `hidden_assumption`; it means the entire evidentiary basis is indirect.

- `expert_consensus_without_dependency_map`: citing expert consensus is common and sometimes legitimate, but it is epistemically shallow unless you can also show what that consensus depends on. If the dependencies are not mapped, you cannot assess whether new evidence should update the consensus.

---

## Assessment

The overall verdict. In v3 the case holds `assessment_layer.assessments`, an array, so more than one verdict can sit over the same core structure (see Multiple Assessments and Reviews below). A single-assessor entry simply has one assessment. Each assessment has an `id` and may record its `author`, `perspective` (for example `"primary builder"` or `"adversarial reviewer"`), and `assessment_scope` if it covers only part of the case.

Four things distinguish an Atlas assessment from a generic summary:

**Settled vs. unsettled**: The assessment must take a position on whether the dispute has a clear resolution. Not "there is ongoing debate"; that is always true of any documented dispute. The question is whether the evidence supports a clear conclusion.

**Weak links**: The assessment identifies which NormalizedClaims are the weakest links in the dominant argument. If the argument depends on a claim with `closed_case_overconfidence` and `low` confidence, that is a weak link that should be named.

**Sensitivity**: The optional `sensitivity` array records how robust the conclusion is to specific claims or cruxes being overturned. Each entry names a `target_id`, a `robustness` rating (`robust`, `fragile`, or `unknown`), and the `effect_if_overturned`. This is a light qualitative analysis, not a formal one: it answers "if this one piece turned out to be wrong, would the conclusion change?"

**What would update**: The forward-looking question. This forces the assessment to be falsifiable. If no evidence could ever change the conclusion, the assessment is not epistemically serious. Each scenario specifies what the evidence is, what it would affect, which direction, and how decisively.

When assessments disagree, an assessment can name the ones it diverges from in `disagrees_with` and explain why in `disagreement_notes`.

---

## Multiple Assessments and Reviews

v3 separates the reusable knowledge structure from judgment, which means the same sources, claims, and relations can carry more than one interpretation. Two mechanisms support this:

- **assessments[]** -- multiple full verdicts, each from a stated `perspective`, possibly disagreeing via `disagrees_with`.
- **reviews[]** -- lighter-weight scrutiny. A `Review` records an `assessor`, a `role` (`builder`, `collaborator`, `adversary`, `domain_expert`, or `other`), a `summary` of what they found, and optionally the IDs they `dissents_from_ids`. An `adversary` review is one explicitly trying to break the entry.

Both arrays may be empty. The point is that adversarial and multi-user scrutiny have a defined home in the schema rather than overwriting the original work.

---

## Workflow Triggers

Building an atlas entry is not strictly linear. A new crux, a piece of missing evidence, or an audit note can send you back to an earlier stage. v3 records this directly: `Crux`, `MissingEvidence`, and `AuditNote` each accept an optional `triggers` array drawn from `rescope`, `reingest`, `reextract`, `renormalize`, `remap_relations`, `reassess`, and `re_review`. A `source_gap` audit note might trigger `reingest`; an `empirically_underdetermined` crux might trigger `reassess` once evidence arrives. The triggers are advisory pointers for a living workflow, not an execution engine.

---

## MissingEvidence

Evidence that does not exist in any accessible form. Distinguishable from:
- Evidence that exists but was not cited (a source gap, recorded in AuditNotes)
- Evidence that exists but was withheld (a legal_institutional type)
- Evidence that one party has simply not provided

The `reason_absent` and `feasibility` fields make explicit why the evidence does not exist. Some evidence is absent because no one has collected it yet (feasible). Some because it is technically impossible. Some because the required trial would be unethical. These have different implications for when resolution might come.

A MissingEvidence item can carry an optional `triggers` array: if the evidence becomes available, what workflow pass should follow (commonly `reassess`).

---

## AuditNote

The adversarial review record. AuditNotes are created during Step 6 (adversarial review) and may also be added by readers.

The `status` field (`open`, `resolved`, `dismissed`) keeps the audit log live. A `dismissed` note with a `resolution` explanation is better than a deleted note; it shows the issue was considered.

The `llm_artifact` type is specifically for atlas entries built with LLM assistance, where a claim, source reference, or relation may have been generated without grounding in actual source text.

Like cruxes and missing evidence, an AuditNote can carry an optional `triggers` array pointing at the workflow pass its resolution would require (for example a `source_gap` note triggering `reingest`).
