# Compute-Scaling Experiment (smoke stage)

A live-systems validation of the Epistemic Atlas workflow under two inference conditions,
single-pass and a six-stage multi-pass workflow, on the frozen LHC source packet. This
directory is the public, reproducible record of the **smoke stage** - the infrastructure
and measurement validation that runs before a primary study.

## Judge path (about five minutes)

1. **`SCALING_REPORT.md`** - what was executed, what it establishes mechanically, what it
   does not claim. Start here.
2. **`examples/`** - two smoke exemplars you can open directly: the single-pass final graph
   and the six-stage repaired final graph, plus Condition B's audit findings and repair
   change log.
3. **`metrics/`** - the deterministic results: parse, schema validity, referential
   integrity, grounding, source utilization, audit/repair counts.
4. **`harness/`** - the focused evaluation code. `cd harness && npm install && npm run
   check` re-derives every deterministic result on the exemplars; `npm test` runs the
   regressions.
5. **`PROTOCOL.md`**, **`AMENDMENT_LOG.md`** - the frozen design and the mechanical change
   history.

## Research question

Does spending more inference compute on a structured multi-pass workflow produce more
complete, source-grounded, internally consistent, and auditable claim graphs than one-pass
construction by the same model? The smoke stage validates the harness that would answer it;
it does not answer it.

## The two conditions

- **Condition A (single-pass):** one request, complete graph.
- **Condition B (six-stage):** extract -> normalize -> relations -> epistemic analysis ->
  adversarial audit -> repair, each a separate request receiving the frozen packet plus
  prior-stage artifacts.

## Controls held fixed

Same model (`claude-sonnet-5`), same frozen packet, same schema and validator, same
generation settings on every call (`effort: high`, `thinking: adaptive`, no temperature).
Condition A's single call and Condition B's repair call get the identical final-graph output
allowance (64,000 tokens).

## Source-packet design

16 short verified excerpts from 6 sources on the 2008 LHC micro-black-hole safety dispute,
each with a stable excerpt ID and location metadata, byte-frozen and checksummed. Both
conditions receive the identical packet. Every extracted claim must cite a packet excerpt
ID; grounding is scored against the packet only. Provenance: AI-assisted, owner-directed
verification plus an assistant recheck, with a four-item owner spot-check - not a claim that
all sixteen were independently hand-verified. Full PDFs are not redistributed. See
`source_packet/`.

## What was actually executed

One Condition A run and one Condition B run on the LHC case, plus the failed and re-tried
attempts that preceded them. Total eligible compute: **$4.2830**. Both conditions produced
schema-valid, source-linked, auditable final graphs (Condition A's via an offline replay of
its preserved output under the corrected harness). Full per-call record in
`COST_AND_USAGE.csv`.

## What remains unexecuted

The primary run matrix (12+ runs across two cases and replicates), all human evaluation, the
second case (eggs), and any cross-condition comparison. No primary runs, eggs runs, or
larger-model runs were performed.

## Key mechanical findings

- Both conditions run end to end on the frozen packet with adequate output capacity.
- Both final graphs are schema-valid, referentially clean (0 duplicate IDs, 0 dangling
  references), and source-linked (A: 16/16 claims cite real excerpts; B: 46/46), with all 6
  sources represented.
- Condition B's audit stage produced 10 findings and its repair stage logged 10 changes with
  zero unlogged modifications.
- The smoke stage found and fixed two measurement bugs (a fenced-JSON parser gap and a
  grounding-ID mismatch) that would otherwise have distorted a primary study, and three
  output-capacity ceilings that would have truncated it. All fixes are mechanical and change
  no scientific input.

## Limitations

This is one run per condition on one case: **not** a comparison of the conditions and **not**
evidence for or against any hypothesis. Passage-linked rate of 1.0 means every claim cites an
excerpt that exists in the packet, not that the excerpt supports the claim - that is a human
judgment, not performed here. Single prospective rater; two public, pretraining-saturated
cases; reference material is a verified adjudication standard, not objective truth. See
`SCALING_REPORT.md` and `PROTOCOL.md`.

## Contents

| Path | What it is |
|---|---|
| `SCALING_REPORT.md` | evidence-based narrative of the smoke stage |
| `PROTOCOL.md` | frozen experimental design (v1.4, concise) |
| `AMENDMENT_LOG.md` | mechanical change history (baseline -> v1.5) |
| `HARNESS_V1_5_FIX_NOTE.md` | the integrity-checker correction |
| `COST_AND_USAGE.csv` | sanitized per-call token and cost record |
| `metrics/` | deterministic smoke metrics |
| `examples/` | two final-graph exemplars + B audit/repair artifacts |
| `prompts/` | the seven frozen prompts + checksums |
| `source_packet/` | source metadata, excerpts, checksum, provenance |
| `harness/` | focused deterministic-evaluation code + tests |
