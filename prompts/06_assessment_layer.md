# Prompt 06: Assessment Layer

## Purpose

Build the assessment layer of the entry: cruxes, failure mode flags, missing evidence, one or
more assessments, and (only if a real review happened) reviews. Audit notes are also part of
the assessment layer, but they are produced by the adversarial audit step (07).

This layer is more subjective than the core knowledge layer. Extraction, normalization, and
relation mapping aim to record what the sources say and how the claims connect. The assessment
layer is interpretation built on top of that, and reasonable analysts can disagree about it.
That is why it can hold more than one assessment over the same graph.

The output of this prompt is the `assessment_layer` object:

```
assessment_layer: {
  "cruxes": [],
  "failure_mode_flags": [],
  "missing_evidence": [],
  "assessments": [],
  "reviews": [],
  "audit_notes": []
}
```

Leave `reviews` empty unless an actual collaborator, adversarial analyst, or domain expert
performed a review. Do not fabricate reviews. Leave `audit_notes` to step 07.

---

## Workflow triggers

Cruxes, missing-evidence items, and audit notes can carry an optional `triggers` array
recording which workflow pass the item asks to have revisited. The vocabulary is: rescope,
reingest, reextract, renormalize, remap_relations, reassess, re_review. Add a trigger only
where the item clearly implies a next action. Do not attach triggers to every item.

---

## Part A: Cruxes

```
DISPUTE: {dispute_title}

NORMALIZED CLAIMS:
{normalized_claims_json}

RELATIONS:
{relations_json}

Identify the cruxes of this dispute.

DEFINITION: A crux is a specific question or proposition such that:
1. If it resolved one way, one major position would be significantly weakened.
2. If it resolved the other way, the opposing position would be significantly weakened.
3. It is load-bearing, not just contested. Resolving it would cascade through the argument.

Aim for 2 to 5 cruxes. If you have more than 7, you have listed contested claims, not the
load-bearing questions. A general statement of uncertainty ("we do not know enough about X")
is not a crux.

For each crux:
- State it as a specific, answerable question or testable proposition.
- Explain why it is a crux: what changes in the overall dispute depending on its resolution.
- List the normalized claim IDs whose validity depends on it.
- Assess its status honestly: unresolved, resolved_true, resolved_false,
  empirically_underdetermined, or theoretically_underdetermined. "Resolved" requires a named
  mechanism and source; expert consensus without a named mechanism is not a resolution.
- If resolved, name the resolution source IDs.
- Optionally add triggers. An unresolved or underdetermined crux that would move the
  conclusion is a natural candidate for reassess; a crux that reveals the question was scoped
  too broadly is a candidate for rescope.

CRUX SCHEMA:
{
  "id": "CX_NNN",
  "statement": "<clear question or testable proposition>",
  "description": "<why this is a crux and what changes either way>",
  "dependent_normalized_claim_ids": ["NC_NNN", ...],
  "status": "<unresolved|resolved_true|resolved_false|empirically_underdetermined|theoretically_underdetermined>",
  "resolution_notes": "<how resolved, or why underdetermined, or null>",
  "resolution_source_ids": ["<src id>", ...],
  "triggers": ["<optional workflow triggers>"]
}
```

Quality check before finalizing: if a crux resolved tomorrow, would the overall assessment
actually change? If not, it is a contested claim, not a crux. Make sure two cruxes are not the
same question stated twice. Use empirically_underdetermined only when the evidence is
structurally unavailable, not merely absent so far.

---

## Part B: Failure mode flags

Failure mode flags attach to specific normalized claims, sources, or relations, never to the
case as a whole. Use only the twelve-type controlled vocabulary below. Do not invent new types.

| Type | When to apply |
|------|---------------|
| correlated_evidence_treated_as_independent | Multiple sources presented as independent when they share authors, data, institutional context, or funder |
| rhetorical_weight_exceeds_evidence | The claim is stated with more confidence than the underlying evidence supports |
| hidden_assumption | The claim is only valid conditional on an unstated assumption a reasonable reader would not recognize as contested |
| source_incentive_pressure | The source has a documented financial or institutional incentive creating plausible directional bias for this claim |
| proxy_measure_problem | The claim uses a proxy measure where the proxy-to-outcome relationship is itself contested |
| population_heterogeneity | The claim aggregates across subpopulations with meaningfully different outcomes |
| temporal_drift | The claim was accurate in a prior period but conditions have changed enough that current validity is uncertain |
| closed_case_overconfidence | The dispute is treated as settled when at least one significant crux remains unresolved or underdetermined |
| vague_question | The claim responds to an imprecisely scoped question, true under some readings and false under others |
| analogy_dependency | The argument depends on an analogy whose validity is contested |
| direct_evidence_absent | No direct empirical evidence exists; the claim rests on inference, extrapolation, or theory only |
| expert_consensus_without_dependency_map | Expert agreement is cited without identifying what the consensus depends on |

```
Apply failure mode flags to specific normalized claims, sources, or relations.

RULES:
1. Name exactly what each flag applies to. Do not write a flag without an applies_to_id.
2. A flag is only valid if you can point to something specific in the source material or the
   structure of the claim. Do not flag based on prior beliefs about a source.
3. Apply flags to claims from ALL positions. If you flag one side for a pattern, check every
   claim on the other side for the same pattern before concluding it is absent.
4. One flag per claim per failure mode.
5. Severity: critical (changes the claim's conclusion if corrected), significant (should be
   disclosed but the claim may still hold), minor (worth noting, unlikely to change a conclusion).

FLAG SCHEMA:
{
  "id": "FF_NNN",
  "type": "<one of the twelve types>",
  "description": "<how this failure mode manifests in this specific claim, source, or relation>",
  "applies_to_id": "<NC_id, src_id, or R_id>",
  "applies_to_type": "<normalized_claim|source|relation>",
  "severity": "<critical|significant|minor>",
  "affects_conclusion": <true|false>,
  "notes": "<additional context, or null>"
}
```

Symmetry check before finalizing: count flags by position (pro, con, neutral, methodological).
If one position has far more flags, confirm you looked equally hard at both sides. After
flagging, update each affected normalized claim's failure_mode_flag_ids list with the new IDs.

---

## Part C: Missing evidence

```
Identify evidence that does not currently exist in accessible form but whose existence would
change the epistemic status of at least one crux or significantly contested claim.

Missing evidence is evidence that:
1. Does not exist in any publicly accessible form, OR
2. Cannot be produced with current technology or methods, OR
3. Has never been collected despite being collectable.

Do not list evidence that exists but was not included, or evidence one party declined to share.

For each item: describe it specifically, explain why it is absent, list the crux or claim IDs
it would affect, assign priority and feasibility, and optionally add triggers (an item whose
arrival would change the conclusion is a candidate for reassess; one obtainable by consulting
sources not yet ingested is a candidate for reingest).

MISSING EVIDENCE SCHEMA:
{
  "id": "ME_NNN",
  "description": "<what the evidence is and why it is absent>",
  "type": "<empirical|theoretical|historical|legal_institutional>",
  "would_affect_ids": ["<CX_id or NC_id>", ...],
  "priority": "<critical|important|helpful>",
  "reason_absent": "<specific reason this evidence does not exist>",
  "feasibility": "<feasible|infeasible|unknown>",
  "triggers": ["<optional workflow triggers>"]
}
```

---

## Part D: Assessments

The assessment is the most subjective part of the entry. It is an interpretation built on the
core knowledge layer and belongs in `assessment_layer.assessments` as one element of that
array. Use the array even when there is only one assessment.

```
Produce an overall epistemic assessment of the dispute.

RULES:
1. The status must match the crux-level data. If a key crux is unresolved or underdetermined,
   the status cannot be "settled" without explanation.
2. Do not flatten genuine uncertainty into false consensus, or inflate consensus into
   manufactured controversy.
3. settled_direction, if present, must be specific enough to verify against the claim data.
4. what_would_update must contain concrete scenarios, not "more research."
5. weak_link_ids are claims the conclusion depends on but where confidence is lowest or flags
   are present.
6. A claim called well_supported must not have unaddressed strong opposing relations.
7. sensitivity records how robust the conclusion is to specific claims or cruxes being
   overturned: name the target, rate robustness (robust, fragile, unknown), and say what
   would happen if it were overturned.
8. Record your standpoint in author and perspective. If you record a second, competing
   assessment over the same graph, use disagrees_with and disagreement_notes. Never fabricate
   another assessor's view.

ASSESSMENT SCHEMA (one element of assessment_layer.assessments):
{
  "id": "AS_NNN",
  "author": "<who produced this assessment, or null>",
  "assessor": "<optional distinct assessor identity, or null>",
  "perspective": "<the standpoint, e.g. 'primary builder' or 'adversarial reviewer', or null>",
  "assessment_scope": "<what this assessment covers if not the whole case, or null>",
  "summary": "<short plain-language summary of this assessment, or null>",
  "status": "<settled|unsettled|partially_settled>",
  "settled_direction": "<specific direction if settled, or null>",
  "epistemic_status_summary": "<2-3 sentence plain-language summary for a non-specialist>",
  "confidence": "<optional plain-language overall confidence, or null>",
  "crux_ids": ["CX_NNN", ...],
  "key_crux_ids": ["CX_NNN", ...],
  "failure_mode_flag_ids": ["FF_NNN", ...],
  "missing_evidence_ids": ["ME_NNN", ...],
  "weak_link_ids": ["NC_NNN", ...],
  "sensitivity": [
    {
      "target_id": "<NC_id or CX_id>",
      "robustness": "<robust|fragile|unknown>",
      "effect_if_overturned": "<what happens to the conclusion if this is overturned, or null>"
    }
  ],
  "what_would_update": [
    {
      "scenario": "<specific scenario>",
      "would_affect_ids": ["<NC_id or CX_id>", ...],
      "direction": "<strengthen|weaken|resolve>",
      "magnitude": "<decisive|significant|minor>"
    }
  ],
  "well_supported_claim_ids": ["NC_NNN", ...],
  "contested_claim_ids": ["NC_NNN", ...],
  "dominant_failure_modes": ["<failure mode type>", ...],
  "disagrees_with": ["<AS_id or RV_id>", ...],
  "disagreement_notes": "<where and why this assessment diverges, or null>",
  "notes": "<any additional observations>"
}
```

---

## Part E: Reviews

A Review records that an actual person scrutinized the entry. It is optional and should be
omitted unless a real review took place.

```
REVIEW SCHEMA (only for a review that actually happened):
{
  "id": "RV_NNN",
  "assessor": "<who performed the review>",
  "role": "<builder|collaborator|adversary|domain_expert|other>",
  "stance": "<optional one-line stance, or null>",
  "summary": "<what the review found>",
  "dissents_from_ids": ["<AS_id, NC_id, R_id, or CX_id>", ...],
  "date": "<ISO date, or null>",
  "notes": "<additional commentary, or null>"
}
```

Do not invent a reviewer or an external review that did not occur. An empty reviews array is
the honest state when no separate review has been performed.

---

## Usage Notes

- The whole assessment layer must stay consistent with the core knowledge layer. If the
  assessment leans on a relation that is only analyst_inferred or unverified, do not present
  the conclusion as more settled than that grounding supports.
- dominant_failure_modes should be a subset of the failure mode types actually flagged in
  Part B. Do not list failure modes that were not flagged.
- Building the assessment layer often reveals that normalization was imprecise or a relation
  was missed. It is fine to go back and revise earlier steps. That is the living workflow, and
  the triggers on cruxes and missing-evidence items are how you record what still needs a pass.
- This is not a verdict or a recommendation. It is an honest characterization of where the
  evidence stands at the time of encoding.
