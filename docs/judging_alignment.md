# Judging Alignment

This document maps Epistemic Atlas against the evaluation criteria we expect FLF judges to apply. It is written candidly -- including where the submission falls short.

---

## Does the submission identify genuine epistemic failure modes?

Yes, and at two levels.

At the **case level**, the two selected disputes are paradigm cases of epistemic failure. The LHC controversy illustrates failures of scientific communication and risk framing -- technical consensus existed but was not transmitted effectively, and a legal challenge was mounted on grounds that misunderstood the underlying physics. The dietary eggs dispute illustrates a decades-long failure to calibrate public health guidance to actual evidence quality, compounded by funding bias and regulatory inertia.

At the **claim level**, the schema captures failure modes as structured data. Every claim in the atlas can carry failure flags (motivated_reasoning, cherry_picking, funding_bias, methodological_weakness, etc.) attached to the specific claim where the failure occurs. This is more precise than labeling an entire source as biased.

---

## Does the submission produce a reusable artifact, not just an analysis?

Yes. The schema is a reusable specification, not a case-specific artifact. A new dispute can be encoded using the same schema, the same pipeline, and the same failure mode vocabulary. The prototype demonstrates this with two cases that are structurally similar but substantively different.

The prompts in `prompts/` are parameterized and documented to support reuse. They are not bespoke prompts written for one case.

---

## Does the submission handle provenance rigorously?

This is an area of genuine strength. Provenance is a first-class field in the schema: every claim links to a source object, and every source object captures author, institution, date, venue, and credibility assessment. Missing provenance is represented explicitly (not silently omitted) via the `credibility: "unknown"` field and notes.

The schema examples in `schema/examples/` demonstrate provenance capture for real sources.

---

## Does the submission surface cruxes?

Yes. Cruxes are first-class objects in the schema with their own ID space, dependency links to claims, and resolution status tracking. The two case studies demonstrate crux identification on disputes with different crux structures: the LHC case has cruxes that were effectively resolved by the safety assessment; the eggs case has cruxes that remain empirically underdetermined.

---

## Does the submission represent uncertainty honestly?

Structurally, yes. The confidence field on claims has a controlled vocabulary (high/medium/low/speculative) with notes. The overall assessment object includes both well-supported and contested claim lists. Missing evidence is a first-class category.

In the sample data, claims are marked with their confidence levels, and the `data_status: "sample"` flag on illustrative data is applied consistently.

The limitations document (`docs/limitations.md`) is an honest account of where the uncertainty representation is underconstrained.

---

## Where the submission is weakest

**Primary source verification.** The case study data is partially verified. A number of claims are marked as sample data and have not been checked directly against primary sources. A stronger submission would have every claim and every source reference verified. This was a scope tradeoff given prototype timelines.

**Graph visualization.** The current prototype displays relations as a structured list rather than as a visual graph. A force-directed or DAG visualization would make the relation structure more legible. This is a prototype limitation.

**Quantified uncertainty.** The confidence levels are ordinal, not probabilistic. A stronger epistemic infrastructure would allow for uncertainty propagation -- if a claim with 60% confidence supports another claim, how does that affect the confidence of the second? The current schema does not support this.

**Cross-dispute comparison.** The schema supports it in principle, but the prototype does not demonstrate it. Showing that funding bias appears in a similar structural position in multiple disputes would be a meaningful epistemic finding.

---

## Summary Assessment

Epistemic Atlas makes a genuine contribution to the problem of epistemic infrastructure -- not by solving it, but by specifying what a solution looks like at the schema and process level. The two case studies are worked examples with enough structure to be credible and enough honest incompleteness to be realistic.

The strongest claims this submission can make are:

1. The schema captures more of the epistemic content of a dispute than any existing summary format.
2. The pipeline is reproducible and transferable to new disputes.
3. The prototype demonstrates the schema's expressive range on two substantively different cases.
4. The failure mode vocabulary, crux structure, and missing evidence category are genuine additions to how these disputes are typically represented.
