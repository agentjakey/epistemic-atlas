# Compute-Scaling Protocol (v1.4, concise)

The frozen experimental design for the Epistemic Atlas workflow-compute study. This is the
public, concise form; capacity and measurement amendments through v1.5 are in
`AMENDMENT_LOG.md`. The packet, prompts, schema, rubric, and hypotheses are unchanged from
the first freeze. Operational token ceilings and deterministic harness behavior were amended
before primary execution, as documented in `AMENDMENT_LOG.md`.

## Research question

Does spending more inference compute on a structured multi-pass workflow produce more
complete, source-grounded, internally consistent, and auditable Epistemic Atlas claim graphs
than asking the same model to construct the graph in one pass?

## Hypotheses (pre-registered)

- **H1 (grounding).** Condition B yields a higher proportion of extracted claims traceable
  to an exact packet excerpt, and a lower unsupported-claim rate, than Condition A.
- **H2 (coverage).** Condition B covers more of the manually verified reference checklist
  (claims, qualifications, disagreements, missing evidence, cruxes) than Condition A.
- **H3 (mechanical + relational quality).** After its repair pass, Condition B has equal or
  better schema validity and referential integrity, and higher supported-relation precision,
  than Condition A.
- **H4 (audit value).** Condition B's adversarial audit detects genuine defects
  (human-adjudicated precision > 0.5) and its repair fixes more defects than it introduces.
- **H5 (residual human judgment).** Some defect classes persist in both conditions;
  identifying where human judgment remains necessary is a required output, not a failure.

An informative null is a valid outcome: if B does not beat A on grounding/coverage, that is
reported as a finding, not hidden.

## Conditions

- **A - single-pass baseline.** One request: packet + condensed schema instructions + task
  -> full claim graph in one JSON output. One retry allowed only for unparseable JSON.
- **B - six-stage workflow (6 calls).** Extract (source-by-source, excerpt IDs required) ->
  normalize (traceability to extracted claims) -> relations and disagreements -> crux,
  missing-evidence, failure-mode analysis -> independent adversarial audit -> targeted repair
  emitting a schema-valid final graph plus a machine-readable change log. Each stage receives
  the frozen packet plus prior-stage artifacts; never Condition A output, never the reference
  set.

## Controls held fixed

Same model (`claude-sonnet-5`), frozen source packet, schema and validator, and final
evaluation pipeline. Identical generation settings on every call in both conditions:
`effort: high`, `thinking: adaptive`, no temperature. Logged per call: model, effort,
max_tokens, stop reason, full usage, request ID.

## Final stage limits (v1.4)

Output-token ceilings (maximum allowances, not targets). claude-sonnet-5 supports 128,000
max synchronous output; all ceilings are within that.

| Call | max_tokens |
|---|---|
| A final (single call) | 64,000 |
| B extract | 64,000 |
| B normalize | 64,000 |
| B relations | 64,000 |
| B epistemic-analysis | 64,000 |
| B adversarial-audit | 64,000 |
| B repair (final) | 64,000 |

Equal-final-output control: A final == B repair == 64,000.

## Intended primary replication plan

Not executed. Documented so the design is legible:

- Smoke: 1 A + 1 B on the LHC case (this stage). **Done.**
- Minimum primary study: 2 cases x 2 conditions x 3 replicates = 12 final graphs.
- Pre-registered symmetric expansion gate: replicates 4-5 added to every cell only if
  time-based, condition-blind criteria hold; the decision must not inspect condition-level
  results.
- Optional qualitative robustness: a small same-design check on a stronger model; never
  described as statistical model-tier evidence.

Statistics would be descriptive only (per-replicate values, ranges, paired differences); no
significance claims at this scale.

## Deterministic metrics (automatic, all runs)

JSON parse (with recorded parse mode), AJV schema validity, referential integrity
(duplicate/dangling IDs across every object family), required-field completeness,
passage-linked claim rate (exact packet excerpt-ID membership), provenance completeness,
source utilization, relation-basis distribution, token/cost/call/retry accounting; for
Condition B, audit-finding count, repair change-log completeness, and defects introduced by
repair (unlogged stage-4-to-stage-6 changes).

## Human-review metrics (blinded rater)

Citation-support adjudication on sampled claims, checklist coverage, relation defensibility,
normalization quality, crux quality, audit-finding adjudication, and a restrained
epistemic-usefulness rubric. Single-rater status disclosed; no inter-annotator reliability
claimed. A model is never the final authority on these.

## Blinding plan

Outputs get random review IDs; condition and replicate are stored in a sealed mapping the
rater does not open until scores are recorded; review proceeds fragment-by-fragment where
feasible; the reference set is never shown to any generation or repair prompt; raw outputs
are preserved verbatim; every run (including failures and retries) is reported.

## Stopping rules

Smoke go/no-go: all outputs parse with at most one retry per call; at least 80% of stage
outputs schema-valid or mechanically repairable; measured tokens within a factor of the
estimate. A mechanical failure means stop, fix mechanically, re-smoke - which is exactly the
recorded history. Staged budgets with a hard cap well under the approved ceiling;
underspending is intended and reported.

## Known limitations

Single human rater (the author); two cases, both public and pretraining-saturated; reference
sets are a verified adjudication standard, not objective truth; relation and crux quality have
no external ground truth; Condition B's staged prompts descend from the repository's prompts
(disclosed); results may not transfer to other models or disputes.

## Amendment history

Baseline (32k final) -> v1.2 (64k final, symmetric) -> v1.3 (fenced-JSON parser + packet-
driven grounding) -> v1.4 (64k all B stages) -> v1.5 (integrity-checker correction). Every
amendment was mechanical (capacity or measurement), changed no scientific input, and was
adopted before any primary run. Full detail: `AMENDMENT_LOG.md`.
