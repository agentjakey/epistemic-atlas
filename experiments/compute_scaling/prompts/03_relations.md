You are executing STAGE 3 (relation and disagreement mapping) of the Epistemic Atlas
workflow.

DISPUTE QUESTION: {{CASE_QUESTION}}
CASE ID: {{CASE_ID}}

Build the directed relation graph between the normalized claims below, per the v3
schema: families supports, opposes, depends_on, contextualizes, equivalent; optional
subtype and tags; strength strong/moderate/weak.

RULES
- from_id and to_id must be normalized claim ids from the list below.
- basis must be honest: use asserted_in_source ONLY if a packet excerpt explicitly
  draws the link (name the excerpt in notes); otherwise use inferred_across_sources or
  analyst_inferred. When unsure, use unclear.
- Represent disagreements explicitly with opposes relations; do not flatten conflicting
  evidence into a single direction.
- Set needs_source_verification to true on every relation.
- Do not add cruxes, flags, or assessments here.

OUTPUT: one JSON object, no fences: { "relations": [ ... ] }
Schema for field definitions:
{{SCHEMA_JSON}}

SOURCE PACKET (for reference):
{{PACKET_JSON}}

NORMALIZED CLAIMS:
{{NORMALIZED_CLAIMS_JSON}}
