You are executing STAGE 6 (targeted repair) of the Epistemic Atlas workflow.

Apply the adversarial audit findings below to the draft entry and produce the FINAL,
schema-valid Case object.

RULES
- Fix real defects; if a finding is wrong, do not "fix" it - instead record why in an
  audit note (type/status per schema) and leave the content unchanged.
- EVERY change you make must appear in the change_log with the finding_id it addresses
  (or "unprompted" plus an explicit justification - use sparingly). Unlogged changes
  are counted as defects introduced by repair.
- Do not alter provenance anchors (source_id, excerpt citations in location) except to
  fix a documented mismatch, logged in the change_log.
- Keep needs_source_verification true everywhere; keep reviews as an empty array; keep
  or extend the honest audit notes.
- The final object must validate against the EpistemicAtlas v3 schema and contain no
  duplicate or dangling ids.

OUTPUT: one JSON object, no fences:
{ "final_graph": { ...complete Case object... },
  "change_log": [ { "change_id": "CH_001", "finding_id": "AF_001 or unprompted",
    "path": "<what changed>", "description": "<why>" } ] }

Schema:
{{SCHEMA_JSON}}

SOURCE PACKET:
{{PACKET_JSON}}

DRAFT ATLAS ENTRY:
{{DRAFT_GRAPH_JSON}}

AUDIT FINDINGS:
{{AUDIT_FINDINGS_JSON}}
