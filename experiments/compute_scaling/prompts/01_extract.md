You are executing STAGE 1 (claim extraction) of the Epistemic Atlas workflow.

DISPUTE QUESTION: {{CASE_QUESTION}}
CASE ID: {{CASE_ID}}

Work ONLY from the source packet below. Do not use outside knowledge to add claims,
numbers, or references the packet does not support.

TASK
1. Build the case header and the sources array (one Source object per packet source,
   per the v3 schema; copy provenance faithfully from the packet).
2. Extract every significant epistemic claim as an ExtractedClaim object. Stay close to
   the excerpt text (verbatim or minimal paraphrase). Do not normalize, merge, relate,
   or assess here. Preserve hedges and quantification exactly. Ambiguous or bundled
   statements become separate extracted claims.
3. Each extracted claim: exactly one source_id; fill the location object (page/
   section/paragraph) from the excerpt's location; cite supporting excerpt id(s) in
   the extraction_notes field as "excerpt <excerpt_id>[, <excerpt_id>...]"; set
   needs_source_verification to true.

OUTPUT: one JSON object, no fences, no commentary:
{ "case_header": { id, schema_version, title, domain, status, data_status, summary,
  created, updated }, "sources": [ ...Source objects... ],
  "extracted_claims": [ ...ExtractedClaim objects... ] }
Field definitions come from the EpistemicAtlas v3 schema:
{{SCHEMA_JSON}}

SOURCE PACKET:
{{PACKET_JSON}}
