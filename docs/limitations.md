# Limitations

This document is an honest account of what Epistemic Atlas does not do well, where its design choices involve real tradeoffs, and what failure modes the system itself is susceptible to.

---

## Schema Limitations

**Atomicity is hard.** The requirement that each claim be atomic is an ideal, not always achievable in practice. Many real-world claims bundle multiple propositions, and deciding where to split them involves judgment that is not fully systematized. Different annotators will produce different claim decompositions for the same source text.

**Normalization introduces interpretation.** The gap between the raw claim and the normalized claim is where a lot of interpretive work happens. The schema preserves both, but there is no automated check that the normalized form accurately captures the raw form. Normalization bias is a real failure mode.

**Relation strength is subjective.** The strong/moderate/weak scale for relation strength is not formally defined. Two annotators working from the same source material will often assign different strengths to the same relation. The schema records their judgment but does not calibrate it.

**The failure mode vocabulary is incomplete.** The current list of failure flags (motivated reasoning, cherry-picking, funding bias, etc.) does not exhaust the space of epistemic failure modes. Adding new ones without disciplined definition risks making the taxonomy useless. The current vocabulary reflects pragmatic coverage, not theoretical completeness.

---

## Coverage Limitations

**The atlas only knows what its sources know.** If the sources consulted do not include a significant position, that position is absent from the atlas. Source selection is a major determinant of what the atlas represents, and there is no automated way to ensure completeness.

**Translation across technical domains is hard.** The pipeline works best on disputes where the primary claims are stated in ordinary language or in language that can be accurately paraphrased. Disputes that turn on highly technical mathematical or empirical claims require domain expertise that cannot be fully offloaded to the pipeline.

**Dynamic disputes.** The atlas represents a dispute at a point in time. Disputes evolve: new evidence emerges, positions shift, cruxes get resolved. The schema does not have a native versioning mechanism, though it records created/updated dates at the entry level.

---

## Process Limitations

**LLM hallucination.** When the pipeline is executed with LLM assistance, the LLM may generate claims, sources, or relations that are not supported by the actual source material. The adversarial review step is designed to catch this, but it is not a guarantee. Any atlas entry built with LLM assistance should be treated as requiring human verification of every source reference and claim attribution.

**Adversarial review quality.** The adversarial review in Step 6 is only as good as the reviewer. An adversarial reviewer who shares the same biases as the original annotator will not catch those biases. Ideally, adversarial review is done by someone with no prior involvement in building the entry.

**Crux identification requires judgment.** Identifying cruxes is the step most dependent on epistemic sophistication. The pipeline prompt guides the process, but a reviewer unfamiliar with the structure of arguments in the domain may miss load-bearing claims or misidentify pivotal questions.

---

## Structural Limitations

**The schema is a graph, not a formal logic.** The relation types (supports, attacks, etc.) are not formally defined in terms of a logic. This makes the atlas more accessible but means that consistency checks are informal. There is no automated way to detect, for example, that Claim A supports Claim B while Claim C attacks Claim A in a way that transitively weakens B.

**Missing evidence is underconstrained.** The "missing evidence" category is useful but hard to scope. Everything is technically missing evidence for something. The schema leaves it to the annotator to decide what missing evidence is significant enough to record, which introduces variability.

**No uncertainty quantification.** The confidence levels (high/medium/low/speculative) are ordinal categories, not probability estimates. They capture the rough epistemic status of a claim but do not support formal uncertainty propagation across the graph.

---

## What This System Should Not Be Used For

- Producing authoritative verdicts on active scientific disputes
- Replacing domain expert review in high-stakes policy contexts
- Any use case that requires the atlas entry to be fully verified against primary sources (see data_status fields)
- Generating legally or medically actionable conclusions

The atlas is an epistemic infrastructure tool, not a decision-making oracle.
