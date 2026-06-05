# Prompt 03: Claim Normalization

## Purpose

Normalize raw claims into standardized, unambiguous propositions and assign position and confidence level.

---

## System Context

You are building a structured epistemic knowledge base. You have a raw claims array from Step 2. For each claim, produce a normalized form that resolves ambiguity, makes scope explicit, and assigns a position and confidence level. The raw form is preserved and never discarded.

---

## Prompt Template

```
DISPUTE: {dispute_title}

DOMAIN: {domain}

SOURCES (from Step 1):
{sources_json}

RAW CLAIMS (from Step 2):
{claims_json}

For each claim, fill in the normalized, position, and confidence fields. Do not modify the id, raw, source_id, or domain_type fields.

NORMALIZATION RULES:
1. Resolve all ambiguous referents. Replace "it", "this study", "they" with the explicit referent.
2. Make scope explicit. "Experts agree" should become "The [specific body or set of authors] [agreed/concluded] [what specifically] in [time period]."
3. Make quantification explicit where possible. If the raw claim says "some studies", and you can identify which studies from the source, do so. If not, preserve "some studies" and note the ambiguity.
4. Do not change the meaning of the claim. If normalization would change what is being asserted, do not normalize -- instead flag the ambiguity in the confidence notes.
5. Hedges must be preserved. A claim that "may" cause harm is not the same as a claim that "causes" harm.
6. If two normalized forms are equally valid, pick the more specific one and note the alternatives.

POSITION RULES:
- pro: This claim supports the primary concern or risk position in the dispute.
- con: This claim contradicts or significantly undermines the primary concern or risk position.
- neutral: This claim is relevant background that does not directly support or contradict the primary position.
- conditional: This claim's position depends on the resolution of an unresolved crux.
- methodological: This claim is about how to evaluate evidence rather than about the dispute directly.

CONFIDENCE RULES:
- high: Claim is directly supported by primary source data or established scientific consensus.
- medium: Claim is supported by secondary evidence or expert opinion without direct primary data cited.
- low: Claim is contested, based on outdated evidence, or comes from a source with known methodological weaknesses.
- speculative: Claim is theoretical, extrapolated beyond available evidence, or comes from a low-credibility source.

FAILURE FLAG RULES -- apply only when clearly present in the source material:
- motivated_reasoning: The source reaches a conclusion inconsistent with its stated evidence, in a direction that serves the source's interests.
- cherry_picking: The source selects only evidence supporting one position while omitting contrary evidence the source had access to.
- funding_bias: The claim comes from a source with direct financial interest in the conclusion, and this interest is not disclosed.
- methodological_weakness: The study or analysis has a specific, named methodological problem that weakens this claim.
- false_precision: Numerical precision exceeds what the underlying measurement or model supports.
- suppressed_evidence: Evidence contradicting this claim was available at the time of publication and not acknowledged.

OUTPUT: The same claims array with normalized, position, confidence.level, confidence.notes, and failure_flags filled in. Return the complete array. Nothing else.
```

---

## Usage Notes

- Do not rush normalization. It is the step where the most interpretive work happens, and errors here propagate through the entire entry.
- When in doubt about a normalization, preserve the raw form and add a note explaining the ambiguity.
- After normalization, re-read each pair of (raw, normalized) claims and verify the normalized form has not changed the meaning.
