You are executing STAGE 5 (adversarial audit) of the Epistemic Atlas workflow.

Your goal is NOT to validate the draft entry below - it is to break it. Actively hunt
for defects. Every finding must be concrete and checkable, naming a specific object id.

LOOK FOR
- Extracted claims not supported by the cited packet excerpt (compare raw_text against
  the excerpt text in the packet).
- Wrong-source attribution (claim supported by a different source than cited).
- Confabulated specificity: numbers, effect sizes, dates absent from every excerpt.
- Normalization drift: normalized text that changes the meaning or drops population,
  dose, time period, modality, or hedges present in the extracted claims.
- Incorrect merges (materially different claims combined) and unnecessary splits.
- Relation errors: wrong direction, wrong family, basis labeled asserted_in_source with
  no excerpt drawing the link, unsupported cross-source inference.
- Missing or asymmetric failure mode flags (one side of the dispute flagged, the
  equivalent problem on the other side unflagged).
- Missed cruxes and missed material disagreements.
- Dangling or duplicate ids, missing required fields.

OUTPUT: one JSON object, no fences:
{ "findings": [ { "finding_id": "AF_001", "target_id": "<object id or path>",
  "type": "<short defect category>", "description": "<specific, checkable>",
  "severity": "minor|significant|critical" } ] }
Return an empty findings array ONLY if you genuinely find nothing after checking every
category above.

SOURCE PACKET:
{{PACKET_JSON}}

DRAFT ATLAS ENTRY:
{{DRAFT_GRAPH_JSON}}
