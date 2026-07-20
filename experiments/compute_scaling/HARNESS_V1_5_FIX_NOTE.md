# Harness / Evaluator v1.5 Fix Note

Date: 2026-07-17. Change class: deterministic measurement correction. This corrects an
**over-reporting** bug in the referential-integrity checker discovered during smoke
validation. It does not change any scientific input or output.

## What was wrong

The referential-integrity checker (`harness/src/validate.mjs`, `integrityCheck`) builds a
universe of valid IDs and flags any reference that points outside it. Before v1.5 that
universe was assembled from only six of the graph's object families: sources, extracted
claims, normalized claims, relations, cruxes, and failure-mode flags. It omitted the
missing-evidence, assessment, review, and audit-note families.

Audit notes may legitimately reference an assessment or a missing-evidence item. Because
those ID sets were absent from the checker's universe, such a valid reference was reported
as a dangling reference. In the B-R4 smoke exemplar this produced two false positives:
audit note `AN_001` pointing at assessment `AS_001`, and `AN_002` pointing at
missing-evidence item `ME_005`. Both targets exist in the graph, and the graph is
schema-valid.

This is the mirror image of the earlier v1.3 grounding bug: that one silently
under-reported (it reported zero grounded claims where the true rate was 1.0); this one
over-reports (it flags dangling references that are not dangling). Neither changes the
model output; both are measurement-side defects.

## The fix (v1.5)

The valid-ID universe is now derived from **every** object family present in the graph:

- sources
- extracted claims
- normalized claims
- relations
- cruxes
- failure-mode flags
- missing-evidence objects
- assessments
- reviews
- audit notes

The families are collected into a list of ID sets, and a reference resolves if it is an
exact member of any of them. No specific ID is special-cased; the sets are read from the
graph's own structure, so any future object family or ID convention is covered without a
code change.

## Regression tests

Added in `harness/tests/integrity.test.mjs` (public package) and mirrored in the local
harness `tests/validate.test.mjs`:

- an audit note referencing an assessment resolves (no false dangling on `AS_001`);
- an audit note referencing a missing-evidence item resolves (no false dangling on
  `ME_005`);
- an audit note referencing a review resolves;
- a genuinely missing ID is still flagged as dangling;
- duplicate IDs remain detected;
- the published B-R4 exemplar shows zero dangling references and zero duplicates.

The local harness suite is green at 100/100 tests after this change; the public package
suite is green at 17/17.

## Effect on the smoke result

Re-running the deterministic integrity check on the preserved B-R4 final graph reports
**zero dangling references** under v1.5 (previously two false positives). The graph was
already schema-valid; the count is now accurate. The GO classification of the v1.4 smoke
is unaffected — it did not depend on the false positives, which were disclosed as
non-critical at the time.

## What did not change

No source packet, excerpt, prompt, schema, rubric, hypothesis, model setting, or graph
output changed. This is a harness-code accuracy fix only. Frozen scientific hashes remain
byte-identical.
