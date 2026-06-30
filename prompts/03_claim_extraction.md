# Prompt 03: Claim Extraction

## Purpose

Extract claims from each source as ExtractedClaim objects. This step produces the
`extracted_claims` array, which is part of the core knowledge layer. Extracted claims stay
close to the source. Normalization, merging, relation mapping, and assessment all happen
later.

---

## System Context

You are building a structured epistemic knowledge base. You have a sources array from the
ingestion step. For each source, extract every significant epistemic claim as an
ExtractedClaim. Each extracted claim belongs to exactly one source and records the source
text as faithfully as possible. Do not normalize, do not merge, do not relate, and do not
assess truth here.

---

## Prompt Template

```
DISPUTE: {dispute_title}

DOMAIN: {domain}

SOURCES (from the ingestion step):
{sources_json}

SOURCE TEXT TO PROCESS:
Source ID: {source_id}
Source Title: {source_title}

--- BEGIN SOURCE TEXT ---
{source_text_or_summary}
--- END SOURCE TEXT ---

Extract every significant epistemic claim from this source. A claim is a single declarative
assertion that could, in principle, be true or false.

RULES:
1. Each claim must be atomic: expressible as one declarative sentence.
2. Do not split a compound claim that requires both parts to be meaningful.
3. Preserve all hedges exactly as stated: "may", "suggests", "is consistent with",
   "preliminary evidence indicates" are part of the claim, not qualifications to discard.
4. Preserve all quantification and scope qualifiers exactly: "some studies", "most experts",
   "under conditions X", "in populations with Y".
5. Do not correct, improve, normalize, or merge claims. Capture each as stated.
6. Record the verbatim text, or a minimal paraphrase that preserves meaning exactly, in
   raw_text.
7. Each extracted claim belongs to exactly one source. Set source_id to that source.
8. Do not invent claims that are not stated or strongly implied by the source text. Do not
   invent metadata you do not have; use null for unknown location fields.
9. If a claim is ambiguous, extract both readings as separate claims and note the ambiguity
   in extraction_notes.
10. Set needs_source_verification to true whenever raw_text is a paraphrase or has not been
    checked against the primary source document.
11. Assign IDs in the format EC_001, EC_002, etc.

EXTRACTED CLAIM SCHEMA (v3):
{
  "id": "EC_NNN",
  "source_id": "<src id>",
  "raw_text": "<verbatim text or a minimal meaning-preserving paraphrase>",
  "location": {
    "page": "<page or null>",
    "section": "<section or null>",
    "paragraph": "<paragraph or null>"
  },
  "speaker": "<named speaker or author if distinct from the source author, or null>",
  "extraction_notes": "<why this was extracted, or any ambiguity, or null>",
  "needs_source_verification": <true|false>
}

INCLUDE:
- Empirical assertions about measured outcomes
- Theoretical claims about mechanisms or models
- Claims about the state of evidence ("no peer-reviewed study has shown X")
- Methodological claims ("the study controlled for X but not Y")
- Claims about expert consensus or institutional positions
- Normative claims about acceptable risk levels

EXCLUDE:
- Pure definitions, unless the definition is itself contested
- Purely rhetorical statements with no propositional content
- Statements of uncertainty that make no claim ("we don't know")

OUTPUT: A JSON array of ExtractedClaim objects for this source. Nothing else.
```

---

## Usage Notes

- Run this step separately for each source, then concatenate the arrays into the case's
  `extracted_claims`.
- Claims from different sources that make the same proposition are kept separate here.
  Provenance is part of the record. Combining them happens in the normalization step, which
  links several extracted claims to one normalized claim by ID.
- Do not assign failure mode flags, positions, or confidence here. Those belong to later
  steps. Extraction only captures what the source says.
- The whole point of the extracted layer is faithfulness. If you are tempted to make a claim
  clearer or stronger than the source did, stop. That belongs in normalization, and even
  there the meaning must be preserved.
