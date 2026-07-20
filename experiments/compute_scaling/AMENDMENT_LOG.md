# Amendment Log

Every change to the compute-scaling experiment, in order. All were adopted **before any
primary run** and before any complete cross-condition comparison existed. None changed the
scientific inputs (source packet, prompts, schema, rubric, hypotheses, model, effort,
thinking). Each is a mechanical capacity or measurement correction.

The distinction that matters for a judge: the source packet, the seven prompts, the schema,
the rubric, and the hypotheses have **identical checksums** from the first freeze through
v1.5. What changed is output-token capacity (how much room the model was given) and
harness measurement code (whether the harness could read what the model produced).

---

## Baseline: initial 32,000-token final ceiling

- **Trigger:** initial harness implementation, before any live call.
- **Change:** Condition A's single call and Condition B's repair call each allowed 32,000
  output tokens; Condition B intermediate stages allowed 12,000-16,000.
- **Mechanical?** Yes - a capacity setting, never validated against a real response.
- **Scientific inputs changed?** No.
- **Before primary execution?** Yes.

## v1.2: symmetric 64,000-token final ceiling

- **Trigger:** the first live Condition A calls (SMK-LHC-A-R1) truncated at exactly 32,000
  output tokens on both attempts (`stop_reason: max_tokens`), producing coherent JSON cut
  off mid-object. Adaptive thinking plus the graph did not fit in 32,000.
- **Change:** Condition A `final_max_tokens` and Condition B `stage_max_tokens.repair`
  raised together, 32,000 -> 64,000. Intermediate B stages left unchanged at this step.
- **Mechanical?** Yes - output capacity only. 64,000 is a ceiling, not a target.
- **Scientific inputs changed?** No. Packet, prompts, schema, rubric, hypotheses, model,
  effort, thinking all byte-identical. The equal-final-output control (A final == B repair)
  is preserved by raising both together.
- **Before primary execution?** Yes.

## v1.3: fenced-JSON parser and packet-driven grounding fixes

- **Trigger:** under v1.2, Condition A (SMK-LHC-A-R2) completed normally (`end_turn`) and
  produced complete, schema-valid graphs, but the harness rejected them: (1) the model
  wrapped its JSON in a Markdown code fence and the parser did strict `JSON.parse` on the
  raw text; (2) the grounding evaluator matched citations against a hardcoded ID shape
  (`src_NNN_eN`) that matched none of the frozen packet's 16 real IDs (`lhc_cNNN`).
- **Change (parser):** try strict `JSON.parse` first; only on failure, fall back if the
  entire trimmed response is exactly one Markdown-fenced block. No partial extraction, no
  repair, no multi-fence handling; the raw response is never mutated; parse mode is
  recorded.
- **Change (grounding):** validity is exact membership in the frozen packet's excerpt-ID
  set, derived from the packet. No ID shape is assumed. Valid, invalid, and absent
  citations are counted separately.
- **Mechanical?** Yes - measurement code only. The second bug would otherwise have reported
  a grounding rate of zero for every run in both conditions, silently invalidating the
  lead hypothesis.
- **Scientific inputs changed?** No. Harness code, fixtures, and tests only.
- **Before primary execution?** Yes.
- **Confirmation:** an offline replay of the preserved A-R2 output under v1.3 passed all
  13 mechanical checks; grounding rose from a structurally impossible 0 to 1.0 (16/16
  claims citing real packet excerpts).

## v1.4: 64,000-token intermediate ceilings

- **Trigger:** the first live Condition B run (SMK-LHC-B-R3) reached the model successfully
  but its stage 1 (extract) truncated at exactly 16,000 output tokens on both attempts
  (`stop_reason: max_tokens`); adaptive thinking consumed 70-97% of that budget. Stages
  2-6 never ran. The four remaining intermediate ceilings were all smaller than the one
  that failed and equally unvalidated.
- **Change:** all five Condition B intermediate stages (extract, normalize, relations,
  epistemic-analysis, adversarial-audit) raised to 64,000, matching repair and Condition A.
  Resizing all five together avoided rediscovering the same truncation stage by stage.
- **Mechanical?** Yes - output capacity only; ceilings, not targets. Effort and thinking
  were **not** lowered (doing so would confound the A/B comparison).
- **Scientific inputs changed?** No.
- **Before primary execution?** Yes.
- **Confirmation:** SMK-LHC-B-R4 completed all six stages normally (`end_turn`, 21-79%
  headroom), producing a schema-valid, source-linked, auditable final graph. Smoke
  classification: GO.

## v1.5: integrity-checker correction

- **Trigger:** the B-R4 deterministic evaluation flagged two dangling references
  (`AN_001 -> AS_001`, `AN_002 -> ME_005`) that were false positives - both targets exist
  and the graph is schema-valid. The integrity checker's valid-ID universe omitted the
  assessment, missing-evidence, review, and audit-note families.
- **Change:** the valid-ID universe is derived from every object family in the graph. No
  ID is special-cased.
- **Mechanical?** Yes - measurement code only; corrects over-reporting.
- **Scientific inputs changed?** No.
- **Before primary execution?** Yes.
- **Confirmation:** B-R4 now reports zero dangling references; genuine missing IDs and
  duplicates are still detected. See `HARNESS_V1_5_FIX_NOTE.md`.

---

## Summary

| Version | Kind | Inputs changed | Before primary |
|---|---|---|---|
| baseline | capacity (32k final) | no | yes |
| v1.2 | capacity (64k final, symmetric) | no | yes |
| v1.3 | measurement (parser + grounding) | no | yes |
| v1.4 | capacity (64k all B stages) | no | yes |
| v1.5 | measurement (integrity checker) | no | yes |

The source packet, prompts, schema, rubric, and hypotheses carry the same checksums across
every version.
