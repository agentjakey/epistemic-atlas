# Focused deterministic-evaluation harness

The subset of the compute-scaling harness needed to reproduce the deterministic smoke
checks. It contains no provider client, no credentials, no run orchestration, and no
interlock - only the code that reads model output and measures it.

## Run

```
npm install      # ajv + ajv-formats only
npm run check    # re-derive every deterministic result on the published exemplars
npm test         # parser, grounding, and integrity regressions
```

`check.mjs` validates the two published final-graph exemplars against the repository schema
(`../../../schema/epistemic-atlas.schema.json`) and the frozen packet
(`../source_packet/packet.json`), and re-derives the audit/repair mechanics. It exits non-zero
if any check fails.

## Modules (`src/`)

| File | Exports | Purpose |
|---|---|---|
| `validate.mjs` | `tryParseJson`, `makeValidator`, `validateGraph`, `integrityCheck` | fenced-JSON parsing (v1.3), AJV schema validation, referential integrity (v1.5) |
| `grounding.mjs` | `groundingMetrics`, `packetExcerptIdSet`, `sourceUtilization`, ... | packet-driven grounding: citation validity by exact excerpt-ID membership |
| `audit.mjs` | `auditRepairMetrics`, `diffGraphs` | Condition B audit/repair diff and change-log completeness |
| `cost.mjs` | `priceCall`, `projectCallCost`, ... | token-based cost accounting (projections; actuals reconcile to the console export) |
| `hashing.mjs` | `sha256Text`, `sha256Json`, `canonicalJson` | CRLF-normalized checksums |

These files are the same code that ran during the smoke stage. `validate.mjs`, `hashing.mjs`,
and `cost.mjs` are byte-identical to the operational harness; `grounding.mjs` and `audit.mjs`
differ only in a relative import path (their hashing import). The operational harness
additionally contains a provider client, run recorder, and paid-call interlock, which are not
part of the deterministic-evaluation surface and are not published here.

## Parse modes

`tryParseJson` records how each response was parsed:

- `strict_json` - the raw response parsed directly as JSON.
- `single_json_fence_fallback` - the response was exactly one Markdown-fenced block whose
  contents parsed as JSON.

The fallback is deliberately narrow: it never extracts an object from surrounding prose,
never repairs malformed or truncated JSON, never concatenates multiple fences, and never
mutates the raw response. A truncated response fails to parse under both modes.

## Referential integrity (v1.5)

`integrityCheck` derives its valid-ID universe from every object family in the graph
(sources, extracted claims, normalized claims, relations, cruxes, failure-mode flags,
missing-evidence, assessments, reviews, audit notes). See `../HARNESS_V1_5_FIX_NOTE.md`.
