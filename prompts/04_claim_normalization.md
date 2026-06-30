# Prompt 04: Claim Normalization

## Purpose

Turn extracted claims into NormalizedClaim objects: standardized, unambiguous propositions
that link back to the extracted claims they came from. This step produces the
`normalized_claims` array, part of the core knowledge layer. Extraction must be done first.

---

## System Context

You are building a structured epistemic knowledge base. You have an `extracted_claims` array
(EC_NNN objects) from the extraction step. Produce normalized claims (NC_NNN objects) that
resolve ambiguity, make scope and quantification explicit, and assign a position and a
confidence level. Every normalized claim links back to one or more extracted claims by ID.
The extracted claims are never discarded or rewritten.

---

## Prompt Template

```
DISPUTE: {dispute_title}

DOMAIN: {domain}

SOURCES (from the ingestion step):
{sources_json}

EXTRACTED CLAIMS (from the extraction step):
{extracted_claims_json}

Produce a normalized_claims array. Each normalized claim is a clearer, scope-explicit
proposition built from one or more extracted claims.

NORMALIZATION RULES:
1. Resolve ambiguous referents. Replace "it", "this study", "they" with the explicit referent.
2. Make scope explicit. "Experts agree" becomes "[the specific body or authors]
   [agreed or concluded] [what specifically] in [time period]." Put scope in the normalized
   text, and use the scope field for any scope statement the text does not fully carry.
3. Make quantification explicit where the source supports it. If you cannot, preserve the
   original quantification and note the ambiguity.
4. Preserve hedges. A claim that "may" cause harm is not the same as one that "causes" harm.
   Keep hedges in the normalized text, and list them in the hedges field.
5. Do not make the normalized claim stronger, broader, or more certain than the extracted
   claims support. If normalizing would change the meaning, do not normalize: keep the
   claims separate and record the difficulty in confidence.notes.
6. Link every normalized claim back to its extracted claims with extracted_claim_ids.

MERGING RULES:
1. Merge several extracted claims into one normalized claim only when they make genuinely the
   same proposition, or are close enough that treating them as one serves the case without
   distorting either.
2. When several sources independently make the same claim, that is epistemically meaningful.
   Record all of their extracted_claim_ids on the one normalized claim.
3. Preserve meaningful disagreements, scope differences, and population or context limits. If
   two claims differ on a condition, a population, a time period, or a threshold, keep them as
   separate normalized claims rather than averaging them away.

POSITION (relative to the primary concern or risk framing of the dispute):
- pro: supports the concern
- con: undermines the concern
- neutral: relevant background
- conditional: position depends on an unresolved crux
- methodological: about how evidence should be evaluated

CONFIDENCE LEVEL:
- high: directly supported by primary source data or established consensus
- medium: supported by secondary evidence or expert opinion without direct primary data
- low: contested, outdated, or from a methodologically weak source
- speculative: theoretical extrapolation or a very low credibility source

DOMAIN TYPE: empirical, theoretical, methodological, normative, or historical.

NORMALIZED CLAIM SCHEMA (v3):
{
  "id": "NC_NNN",
  "extracted_claim_ids": ["EC_NNN", ...],
  "normalized_text": "<the standardized claim, with scope, quantification, and hedges explicit>",
  "domain_type": "<empirical|theoretical|methodological|normative|historical>",
  "scope": "<plain-language scope if the text does not fully carry it, or null>",
  "quantification": "<plain-language quantification if not fully in the text, or null>",
  "hedges": ["<hedge preserved from the source>", ...],
  "position": "<pro|con|neutral|conditional|methodological>",
  "confidence": {
    "level": "<high|medium|low|speculative>",
    "notes": "<why this level, or any ambiguity, or null>"
  },
  "tags": ["<optional thematic tags>"],
  "needs_source_verification": <true|false>
}

Set needs_source_verification to true whenever the underlying extracted claims are unverified
paraphrases or the normalization has not been checked against the source text.

Do not add relations, cruxes, failure mode flags, missing evidence, or an assessment here.
Those belong to later steps and to the assessment layer.

OUTPUT: A JSON array of NormalizedClaim objects. Nothing else.
```

---

## Usage Notes

- Do not rush normalization. This is where the most interpretive work happens, and errors
  here propagate through relations, cruxes, and the assessment.
- After normalization, re-read each normalized claim against its extracted_claim_ids and
  verify the normalized form has not changed the meaning or added strength the sources do not
  support. The adversarial audit step checks for exactly this drift.
- Failure mode flagging is a separate step (06_assessment_layer.md) using a fixed twelve-type
  vocabulary. If you notice a likely failure mode while normalizing, record the observation in
  confidence.notes so the flagging step can pick it up. Do not invent flag types here.
