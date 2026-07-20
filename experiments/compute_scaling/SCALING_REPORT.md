# Compute-Scaling Smoke Report

A live-systems validation of the Epistemic Atlas workflow under two inference conditions on
a single frozen case. This report describes what was actually executed, what it establishes
mechanically, and what it deliberately does not claim.

**One-line summary:** the single-pass workflow completed live and passed deterministic
offline replay under the corrected harness, while the six-stage workflow completed live end
to end. Both produced schema-valid, source-linked, auditable claim graphs on the frozen LHC
packet. This is smoke-stage evidence that the measurement pipeline works. It is not a
comparison of the two conditions and makes no claim about which produces better graphs.

---

## Why compute support was requested

Epistemic Atlas turns a dispute into an inspectable claim graph with provenance, relations,
cruxes, missing evidence, and assessment notes. The compute request asked a specific,
falsifiable question: does spending more inference compute on a structured multi-pass
workflow produce more complete, source-grounded, internally consistent, and auditable
graphs than asking the same model to build the graph in one pass? Answering it requires a
harness that can run both conditions against a controlled source packet and measure the
outputs deterministically. This smoke stage validates that harness on real model calls
before any primary study is run.

## Frozen experiment design

- **Conditions.** A: single-pass - one request, complete graph. B: six-stage workflow -
  extract, normalize, relations, epistemic analysis, adversarial audit, repair, each a
  separate request that receives the frozen packet plus prior-stage artifacts.
- **Controls held fixed across both conditions.** Same model (`claude-sonnet-5`), same
  frozen source packet, same schema and validator, same generation settings on every call:
  `effort: high`, `thinking: adaptive`, no temperature. The equal-final-output control:
  Condition A's single call and Condition B's repair call get the identical final-graph
  output allowance.
- **Source grounding.** Every extracted claim must cite a packet excerpt ID. Grounding is
  scored against the packet only, so a factually true claim with no valid excerpt ID counts
  as ungrounded. This measures source-linking discipline, not world knowledge.

See `PROTOCOL.md` for the full frozen design and `AMENDMENT_LOG.md` for the change history.

## Source verification

The LHC packet holds 16 short verified excerpts from 6 sources (arXiv preprints and
published papers on the 2008 LHC micro-black-hole safety dispute), each with a stable
excerpt ID and location metadata. Provenance is stated plainly and is **not** overclaimed:
verification was AI-assisted (owner-directed) plus an assistant local recheck, with a
four-item owner spot-check of the highest-leverage excerpts. It is not a claim that all
sixteen were independently hand-verified by the owner. Full excerpt PDFs are not
redistributed; only short quotations, metadata, checksums, and a bibliography are published.
The packet is checksummed (`2572241c...`) and byte-frozen; both conditions receive the
identical packet.

## Live smoke chronology

The smoke stage found and fixed five issues in sequence. Each required a real model call to
surface, because each was invisible to the mock harness. Presented here as transparent
measurement and infrastructure validation, which is what a smoke stage is for.

1. **Credential failure (pre-network).** The first attempt failed before any request left
   the machine: the API key held a control character the local HTTP stack rejected. No
   request reached the provider; no tokens were billed. Fixed by the owner re-setting the
   key.

2. **32k truncation discovery.** With the credential fixed, both Condition A calls reached
   the provider and were cut off at exactly 32,000 output tokens (`stop_reason:
   max_tokens`), producing coherent JSON severed mid-object. The graph plus adaptive
   thinking did not fit in 32,000.

3. **64k final-cap amendment (v1.2).** Condition A's final allowance and Condition B's
   repair allowance were raised together to 64,000 - output capacity only, applied
   symmetrically to preserve the equal-final-output control. Condition A then completed
   normally (`end_turn`) with about a quarter of the allowance unused.

4. **Fenced-JSON parser defect (v1.3).** The completed Condition A output was rejected by
   the harness, not the model: the model returned its JSON inside a Markdown code fence and
   the parser did a strict parse of the raw text. Fixed with a narrow fence-aware fallback
   that never rescues truncated or multi-block output.

5. **Packet-ID grounding defect (v1.3).** The grounding evaluator matched citations against
   a hardcoded ID shape that matched none of the packet's real IDs. Left unfixed it would
   have reported a grounding rate of zero for every run in both conditions - a silent,
   symmetric null. Fixed to score citations by exact membership in the packet's excerpt-ID
   set. An offline replay of the preserved Condition A output under the corrected harness
   passed all mechanical checks and grounding rose from a structurally impossible 0 to 1.0.

6. **B intermediate-stage ceiling discovery + v1.4 amendment.** The first Condition B run
   reached the model but truncated at stage 1 (extract) against its 16,000 ceiling; adaptive
   thinking consumed most of that budget. Rather than raise one stage and rediscover the
   same wall stage by stage, all five intermediate ceilings were raised to 64,000 together.
   Effort and thinking were not touched.

7. **Successful A replay and B-R4 execution.** Under the corrected harness (v1.3/v1.5) and
   the amended capacity (v1.4), Condition A's replay is the accepted mechanical result, and
   Condition B ran all six stages to completion.

## Actual token usage by stage (SMK-LHC-B-R4)

Every stage finished naturally (`stop_reason: end_turn`); none reached its 64,000 ceiling.

| Stage | input tokens | output tokens | ceiling | headroom |
|---|---|---|---|---|
| extract | 27,461 | 18,778 | 64,000 | 71% |
| normalize | 35,833 | 22,929 | 64,000 | 64% |
| relations | 36,833 | 13,484 | 64,000 | 79% |
| epistemic-analysis | 42,910 | 21,120 | 64,000 | 67% |
| adversarial-audit | 53,853 | 25,931 | 64,000 | 59% |
| repair | 68,247 | 50,454 | 64,000 | 21% |

Input tokens rise stage to stage because each stage receives the packet plus accumulated
prior-stage artifacts, by design. Condition A (SMK-LHC-A-R2) used 27,747 input / 47,448
output in a single call. See `COST_AND_USAGE.csv` for the full per-call record.

## Actual costs

| Run | What it was | Cost |
|---|---|---|
| SMK-LHC-A-0 | pre-network credential failure (no inference) | $0.0000 |
| SMK-LHC-A-R1 | Condition A, truncated at 32k | $0.7510 |
| SMK-LHC-A-R2 | Condition A, complete output (accepted via replay) | $1.0450 |
| SMK-LHC-B-R3 | Condition B, extract truncated at 16k | $0.4298 |
| SMK-LHC-B-R4 | Condition B, complete six-stage run | $2.0572 |
| **Total** | | **$4.2830** |

All figures are at claude-sonnet-5 introductory pricing ($2/MTok input, $10/MTok output),
verified against official documentation on each execution date. Every per-call cost
reconciles to the token arithmetic. Total eligible compute is $4.2830 of an approved $200.

## Audit and repair mechanics (Condition B)

Condition B's stage 5 (adversarial audit) produced 10 findings. Stage 6 (repair) emitted a
schema-valid final graph plus a change log with 10 entries. Diffing the pre-repair draft
against the final graph shows every change is accounted for in the log - zero unlogged
changes, i.e. the repair introduced no undocumented modifications. Whether each audit
finding is a genuine defect, and whether each repair is correct, are human adjudications per
the rubric and are not decided here.

## What improved mechanically

- Both conditions now run end to end on the frozen packet without truncation.
- Both final graphs are schema-valid (AJV 2020-12 against the repository schema).
- Both are source-linked: every extracted claim cites a real packet excerpt ID (A: 16/16;
  B: 46/46), with zero invalid and zero absent citations, and all six sources represented.
- Both are referentially clean: zero duplicate IDs, zero dangling references (under the
  corrected v1.5 checker).
- The review layer was exercised for the first time: Condition B's audit and repair stages
  ran and produced attributable, logged artifacts.
- The measurement pipeline itself is validated: parsing, schema validation, referential
  integrity, packet-driven grounding, and cost accounting all produce correct results on
  real output, and the two measurement bugs that would have distorted a primary study were
  found and fixed before it began.

## What remains unmeasured

- **No cross-condition comparison.** This is one run per condition on one case. There is no
  primary matrix, no replicates, no paired differences. This report does not claim
  Condition B outperformed Condition A, or vice versa; that question is unanswered.
- **No human evaluation.** Passage-linked rate of 1.0 means every claim cites an excerpt ID
  that exists in the packet. Whether the cited excerpt genuinely supports the claim, whether
  relations are defensible, whether cruxes are well chosen, and whether the audit findings
  are real defects are all blinded human judgments and were not performed.
- **The second case (eggs) was not run.** Its packet is not frozen and is correctly blocked.
- **No statistical claim of any kind** is made or would be supportable at this scale.

## Where human judgment remains necessary

The deterministic layer can confirm that a graph parses, validates, links every claim to an
existing excerpt, and repairs itself without unlogged changes. It cannot confirm that a
citation actually supports its claim, that a normalization preserved the right
qualifications, that a relation is defensible, or that an audit finding is a real defect
rather than a restatement. Those remain the rater's job, single-rater status disclosed, and
the workflow is designed to make them inspectable rather than to decide them automatically.

## How to reproduce the free checks

From `harness/` in this directory: `npm install` then `npm run check` re-validates the two
published exemplars against the repository schema and the frozen packet and re-derives the
audit/repair mechanics; `npm test` runs the parser, grounding, and integrity regressions.
See `harness/README.md`.
