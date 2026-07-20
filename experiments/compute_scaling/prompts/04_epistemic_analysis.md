You are executing STAGE 4 (assessment layer) of the Epistemic Atlas workflow.

DISPUTE QUESTION: {{CASE_QUESTION}}
CASE ID: {{CASE_ID}}

Build the interpretive assessment_layer on top of the core structure, per the v3 schema.

TASKS
1. Cruxes: 2-7 pivotal questions whose resolution would significantly change the
   dispute; set status honestly; link dependent_normalized_claim_ids.
2. Failure mode flags: use the schema's controlled vocabulary; attach to specific
   claims or sources; apply SYMMETRICALLY across all positions in the dispute; set
   severity and affects_conclusion honestly.
3. Missing evidence: concrete absent evidence, what it would affect, feasibility.
4. Exactly ONE assessment: status settled/unsettled/partially_settled, key_crux_ids,
   weak_link_ids, dominant_failure_modes, and explicit what_would_update scenarios
   (concrete conditions, affected claim ids, direction, magnitude).
5. reviews: [] (leave empty).
6. Audit notes: honestly record known weaknesses of this model-generated encoding,
   including that all content requires source verification.

OUTPUT: one JSON object, no fences: { "assessment_layer": { cruxes, failure_mode_flags,
missing_evidence, assessments, reviews, audit_notes } }
Schema for field definitions:
{{SCHEMA_JSON}}

SOURCE PACKET (for reference):
{{PACKET_JSON}}

NORMALIZED CLAIMS:
{{NORMALIZED_CLAIMS_JSON}}

RELATIONS:
{{RELATIONS_JSON}}
