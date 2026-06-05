# Prompt 02: Claim Extraction

## Purpose

Extract atomic claims from each source. This step produces the raw claims array before normalization.

---

## System Context

You are building a structured epistemic knowledge base. You have a sources array from Step 1. For each source, extract every significant epistemic claim as an atomic proposition. Do not normalize, evaluate, or relate claims yet. Only extract.

---

## Prompt Template

```
DISPUTE: {dispute_title}

DOMAIN: {domain}

SOURCES (from Step 1):
{sources_json}

SOURCE TEXT TO PROCESS:
Source ID: {source_id}
Source Title: {source_title}

--- BEGIN SOURCE TEXT ---
{source_text_or_summary}
--- END SOURCE TEXT ---

Extract every significant epistemic claim from this source. A claim is a single declarative assertion that could, in principle, be true or false.

RULES:
1. Each claim must be atomic -- expressible as one declarative sentence.
2. Do not split a compound claim that requires both parts to be meaningful.
3. Preserve all hedges exactly as stated: "may", "suggests", "is consistent with", "preliminary evidence indicates" are part of the claim, not qualifications to discard.
4. Preserve all quantification exactly: "some studies", "most experts", "under conditions X", "in populations with Y".
5. Do not correct or improve the claim. Capture it as stated.
6. Record the verbatim text or a minimal paraphrase that preserves meaning exactly.
7. Assign IDs in the format: C{NNN} (e.g., C001, C002).
8. Do not invent claims that are not stated or strongly implied by the source text.
9. If a claim is ambiguous, extract both possible interpretations as separate claims and note the ambiguity.

INCLUDE:
- Empirical assertions about measured outcomes
- Theoretical claims about mechanisms or models
- Claims about the state of evidence ("no peer-reviewed study has shown X")
- Methodological claims ("the study controlled for X but not Y")
- Claims about expert consensus or institutional positions
- Normative claims about acceptable risk levels

EXCLUDE:
- Pure definitions (unless the definition is itself contested)
- Purely rhetorical statements with no propositional content
- Statements of uncertainty that do not make a claim ("we don't know")

CLAIM SCHEMA:
{
  "id": "C_NNN",
  "raw": "<verbatim or minimal paraphrase>",
  "normalized": null,
  "source_id": "{source_id}",
  "position": null,
  "domain_type": "<empirical|theoretical|methodological|normative|historical>",
  "confidence": { "level": null, "notes": null },
  "tags": [],
  "failure_flags": []
}

Note: normalized, position, and confidence.level are left null -- they are filled in Step 3.

OUTPUT: A JSON array of claim objects for this source. Nothing else.
```

---

## Usage Notes

- Run this step separately for each source.
- After extracting from all sources, merge the arrays. Check for duplicate claims (same proposition from multiple sources) -- keep both but note the duplication in the notes field and link them.
- Claims from different sources making the same proposition should be kept separate, because provenance is part of the record.
