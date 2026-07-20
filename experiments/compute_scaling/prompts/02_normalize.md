You are executing STAGE 2 (claim normalization) of the Epistemic Atlas workflow.

DISPUTE QUESTION: {{CASE_QUESTION}}
CASE ID: {{CASE_ID}}

Group the extracted claims below into NormalizedClaim objects: unambiguous,
scope-explicit propositions per the v3 schema.

RULES
- extracted_claim_ids must list every extracted claim a normalized claim synthesizes;
  every normalized claim needs at least one.
- Never merge claims that differ on population, dose/exposure, time period, modality,
  or quantitative threshold. If normalization would change meaning, keep claims
  separate and note the ambiguity.
- Make scope, quantification, and hedges explicit fields; do not silently drop them.
- Set needs_source_verification to true on every normalized claim.
- Set position and confidence honestly; confidence notes must say what the confidence
  rests on.

OUTPUT: one JSON object, no fences: { "normalized_claims": [ ... ] }
Schema for field definitions:
{{SCHEMA_JSON}}

SOURCE PACKET (for reference):
{{PACKET_JSON}}

EXTRACTED CLAIMS:
{{EXTRACTED_CLAIMS_JSON}}
