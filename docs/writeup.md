# Epistemic Atlas: A Structured Protocol for Reusable Epistemic Knowledge

**Competition:** FLF Epistemic Case Study Competition
**Submission Type:** Methodology + Prototype

---

## The Problem

Public discourse frequently fails to learn from its own epistemic history. The same structural errors recur: confident claims whose provenance is never examined, cruxes that are never explicitly identified, missing evidence that no one flags as missing, and failure modes that only become visible in retrospect.

This is not primarily a problem of bad reasoning by individuals. It is a problem of infrastructure. Disputes happen in prose. Evidence lives in disconnected documents. Claims get aggregated, decontextualized, and passed on stripped of the provenance that would allow them to be evaluated or updated.

Existing tools address symptoms of this problem. Fact-checkers verify isolated claims. AI summarizers compress debates into neutral overviews. Citation managers track sources. None of these produce a structured artifact that makes the full epistemic content of a dispute queryable, navigable, and reusable over time.

## The Proposal

Epistemic Atlas proposes a schema and six-step pipeline for converting real-world epistemic disputes into structured knowledge bases. Each entry in the atlas encodes not just what the claims are, but:

- Where each claim came from (full provenance)
- How each claim relates to others (support, attack, dependency, qualification)
- What the cruxes are -- the pivotal empirical or theoretical questions on which the dispute turns
- What evidence is missing and what it would resolve
- What epistemic failure modes are present and where
- An overall epistemic assessment including well-supported vs. contested claims

The output is a machine-readable JSON file that conforms to the Epistemic Atlas schema. It is also human-readable in the prototype web interface.

## Why This Design

Several design decisions were made deliberately.

**Atomic claims over summaries.** Each claim in the atlas is a single, testable proposition. This forces disambiguation that summaries avoid. "Scientists disagree about egg safety" is not a claim in the atlas. "Meta-analyses published before 2010 found a statistically significant association between egg consumption and cardiovascular events in populations with diabetes" would be.

**Provenance as a first-class field.** Every claim links to a source object with author, institution, date, publication venue, and credibility assessment. This makes it possible to ask: who said this, when, and under what institutional constraints.

**Explicit failure flags.** Rather than leaving failure modes implicit, the schema has a controlled vocabulary of epistemic failure modes (funding bias, motivated reasoning, cherry-picking, methodological weakness, etc.) that can be attached to individual claims. This makes patterns queryable: which claims in this dispute came from industry-funded sources? Which were flagged for methodological weakness?

**Cruxes as first-class objects.** A crux is a claim whose truth-value, if changed, would significantly shift the overall dispute. Making cruxes explicit is a deliberate epistemic intervention -- it changes how you read the rest of the dispute and where you direct new evidence.

**Missing evidence as a category.** Standard knowledge bases record what exists. This one also records what is absent: what studies have not been done, what data has not been collected, what theoretical questions remain unresolved. Missing evidence is not the same as absence of evidence.

## The Two Case Studies

**LHC Black Holes (2008).** When the Large Hadron Collider was being commissioned, a dispute arose about whether it could produce microscopic black holes capable of causing catastrophic harm. The dispute involved genuine theoretical physics questions (do extra dimensions exist? does Hawking radiation occur at small scales?), institutional risk assessment, and a legal challenge. The case is valuable because it has a relatively clear epistemic resolution while still involving contested theoretical premises.

**Dietary Eggs and Cardiovascular Risk.** The decades-long dispute over whether egg consumption increases cardiovascular disease risk is a paradigm case of a dispute that failed to learn from its own history. It involves funding bias, changing methodological standards, regulatory lag, and public health communication that was not calibrated to genuine uncertainty. The dispute has not fully resolved, making it useful for demonstrating how the schema handles open cases.

## What This Is Not

Epistemic Atlas is not a fact-checking service. It does not produce verdicts on individual claims. It is not a debate summarizer or a neutral overview generator. It does not automate epistemic judgment.

What it produces is an explicit structure for the epistemic content of a dispute. Whether that structure is used to support judgment, education, policy analysis, or further research is left to the user.

## Prototype Status

The schema is stable. The two case studies are structured with partially verified sample data -- primary source verification is incomplete, and claims marked with `"data_status": "sample"` should be treated as illustrative of the schema's expressive range rather than as verified records.

The Next.js prototype demonstrates the schema interactively. It is a research tool interface, not a consumer product.

## Evaluation Dimensions

The design addresses five dimensions we believe any serious epistemic infrastructure should be evaluated on:

1. **Provenance preservation.** Can you trace any claim to its source without ambiguity?
2. **Structural completeness.** Does the representation capture support, attack, dependency, and qualification relations?
3. **Failure mode detection.** Are epistemic failure modes identified at the claim level, not just the case level?
4. **Crux explicitness.** Are the pivotal questions made explicit rather than buried?
5. **Honest incompleteness.** Does the system represent what is not known as well as what is?

The schema and pipeline were designed to satisfy all five.
