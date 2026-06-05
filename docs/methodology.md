# Methodology: The Six-Step Pipeline

## Overview

Building an Epistemic Atlas entry from raw sources follows a six-step pipeline. Steps 1-5 are constructive: they produce the structured artifact. Step 6 is adversarial: it tries to break what the earlier steps built.

Each step has a corresponding prompt in the `prompts/` directory. The pipeline is designed to be executed with human oversight at each stage, though it can be partially automated with LLM assistance.

---

## Step 1: Source Ingestion

**Goal:** Identify and record all relevant sources with full provenance metadata.

For each source, capture:
- Title
- Author(s) with institutional affiliation
- Publication date
- Publication venue (journal, institution, media outlet)
- URL and/or DOI
- Source type (peer-reviewed paper, institutional report, news article, legal filing, statement, etc.)
- Initial credibility assessment (high/medium/low/unknown)
- Notes on any known conflicts of interest, retractions, or revisions

**Credibility assessment guidelines:**
- High: peer-reviewed publication in a major venue, major institutional report with named methodology
- Medium: working paper, commentary, news article citing primary sources
- Low: opinion piece, anonymous source, industry-funded with undisclosed conflict
- Unknown: source exists but cannot be evaluated

**Key principle:** Sources are not evaluated yet. This step is purely about capture and provenance. A source flagged as low credibility stays in the atlas; it is not discarded.

---

## Step 2: Atomic Claim Extraction

**Goal:** Extract individual, testable claims from each source.

A claim is atomic if it cannot be split into two independent claims without losing meaning. "The LHC is safe and scientists agree" is not atomic -- it bundles an empirical claim with a social claim. "The LSAG report concluded that LHC operations do not present risk of catastrophic harm" is atomic.

**Extraction rules:**
1. Each claim should be expressible as a single declarative sentence.
2. Quantified claims must preserve their quantification ("some", "most", "all", "under condition X").
3. Hedged claims must preserve their hedges ("may", "suggests", "is consistent with").
4. Do not correct or disambiguate at this stage -- capture the claim as it is made.
5. Record the raw text (or close paraphrase) and the source ID.

**What counts as a claim:**
- Empirical assertions ("Micro black holes produced at LHC energies would have lifetimes of less than 10^-26 seconds")
- Theoretical claims ("The ADD model of extra dimensions predicts black hole production at TeV-scale energies")
- Methodological claims ("The study controlled for confounders X, Y, and Z")
- Normative claims ("The risk level is acceptable")
- Claims about the state of evidence ("No peer-reviewed study has directly observed Hawking radiation")

---

## Step 3: Claim Normalization

**Goal:** Convert raw claims into standardized, unambiguous propositions.

Normalization resolves:
- Ambiguous referents ("it", "this", "the study")
- Undefined technical terms (expand or note the definition used)
- Implicit scope ("eggs are bad for you" -- for whom? under what conditions?)
- Hedges that need to be made explicit
- Conflated claims that should be separated

The normalized form is what appears in the `normalized` field of each claim object. The raw form is preserved in the `raw` field. Neither is discarded.

**Normalization examples:**

Raw: "Experts say the collider is safe."
Normalized: "The CERN Large Hadron Collider Safety Assessment Group concluded in 2008 that LHC operations present no risk of catastrophic harm."

Raw: "Eggs raise your cholesterol."
Normalized: "Consumption of eggs raises serum LDL-cholesterol in normocholesterolemic adults." (Note: this would then be flagged as needing verification -- the empirical record on this is contested.)

---

## Step 4: Relation Mapping

**Goal:** Identify and record logical and evidential relationships between claims.

Relation types:
- **supports:** Claim A provides evidence or logical justification for Claim B.
- **attacks:** Claim A provides evidence against or logical contradiction with Claim B.
- **depends_on:** Claim A is only meaningful or true if Claim B is true.
- **qualifies:** Claim A narrows or restricts the scope of Claim B without directly contradicting it.
- **implies:** Claim A logically entails Claim B.
- **is_crux_of:** Claim A's truth-value is a crux for Claim B (see Step 5).

Each relation has a strength: strong / moderate / weak.

**Mapping rules:**
1. Only record relations between claims in the atlas, not between claims and external facts.
2. A relation is "strong" if the logical or evidential connection is direct and well-established. "Moderate" if plausible but not certain. "Weak" if speculative or indirect.
3. Do not infer relations that are not present in the source material or analytically obvious.

---

## Step 5: Crux and Missing Evidence Assessment

**Goal:** Identify the pivotal questions and the absent evidence that would resolve them.

**Crux identification:**
A crux is a claim (or question) such that: if it were resolved one way, one major position in the dispute would be significantly weakened; if resolved another way, the opposing position would be significantly weakened. Not every contested claim is a crux. A crux is specifically a load-bearing claim.

For each crux, record:
- A clear statement of the crux
- Which claims depend on it
- Its current resolution status (unresolved / resolved_true / resolved_false / empirically_underdetermined)

**Missing evidence identification:**
Missing evidence is not "evidence that the other side has not provided." It is evidence that does not currently exist in any accessible form and whose existence would change the epistemic status of at least one crux.

Types of missing evidence:
- Empirical: a study that has not been done
- Theoretical: a derivation or proof that has not been established
- Historical: a record that may have existed but is not available
- Legal/institutional: documentation not publicly released

For each missing evidence item, note what it would affect.

---

## Step 6: Adversarial Review

**Goal:** Identify weaknesses in the atlas entry itself.

The adversarial review asks:
1. Are any normalized claims meaningfully different from their raw forms in ways that introduce bias?
2. Are there significant sources that were excluded? Why?
3. Are any relations over-stated or under-stated?
4. Are identified failure flags consistent with the evidence, or are they applied asymmetrically?
5. Is the overall assessment consistent with the claim-level and relation-level data?
6. Are there cruxes that were missed?
7. Is missing evidence framed neutrally, or does it implicitly favor one position?

The adversarial review produces a list of issues, each of which either results in a correction to the atlas entry or a note explaining why no correction was made.

---

## Implementation Notes

The pipeline is designed to be LLM-assisted with human oversight. Steps 1, 2, and 4 can be largely automated with a well-designed prompt and a human review pass. Steps 3, 5, and 6 require more judgment and benefit from a human expert in the domain.

For cases where LLM assistance is used, the prompt files in `prompts/` are parameterized to take the case context and prior step output as input. They are written to minimize hallucination by anchoring each step to the output of the previous step rather than to the LLM's background knowledge.
