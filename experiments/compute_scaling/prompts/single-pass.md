You are building a structured epistemic knowledge base entry (an "Epistemic Atlas case")
for a real-world dispute, in ONE pass.

DISPUTE QUESTION: {{CASE_QUESTION}}
CASE ID: {{CASE_ID}}

You are given a SOURCE PACKET: verified excerpts from the primary and secondary sources
of this dispute, each with a stable excerpt_id. You must work ONLY from the packet.
Do not use outside knowledge to add claims, numbers, or references that the packet does
not support. Every extracted claim must be traceable to packet excerpts.

OUTPUT REQUIREMENTS
- Produce ONE JSON object that is a complete, valid instance of the EpistemicAtlas v3
  schema below (the root Case object). Output ONLY the JSON object, no markdown fences,
  no commentary.
- Use case id "{{CASE_ID}}" and schema_version "3".
- Every extracted claim: set source_id to the packet source it came from, keep raw_text
  verbatim or near-verbatim from an excerpt, fill the location object (page/section/
  paragraph) from the excerpt's location, and cite the supporting excerpt id(s) in the
  extraction_notes field using the form: "excerpt <excerpt_id>[, <excerpt_id>...]".
- Set needs_source_verification to true on every extracted claim, normalized claim, and
  relation (this encoding has not been independently verified).
- Normalized claims must list the extracted_claim_ids they synthesize. Preserve scope,
  population, time period, quantification, hedges, and uncertainty; do not merge claims
  that differ on any of these.
- Relations connect normalized claims; choose family (supports, opposes, depends_on,
  contextualizes, equivalent), strength, and an honest basis value (use
  inferred_across_sources or analyst_inferred unless a source explicitly draws the link).
- The assessment_layer must include cruxes (2-7 pivotal questions), failure mode flags
  applied symmetrically across positions, missing evidence, exactly one assessment with
  explicit what_would_update conditions, an empty reviews array, and audit notes that
  honestly record known weaknesses of this encoding (it is model-generated).

EPISTEMIC ATLAS v3 JSON SCHEMA:
{{SCHEMA_JSON}}

SOURCE PACKET:
{{PACKET_JSON}}

Produce the complete Case JSON object now.
