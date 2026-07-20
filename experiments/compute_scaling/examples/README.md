# Smoke exemplars

Every file here is a **smoke exemplar**, not a primary-study observation. Each is one output
from one live run on the frozen LHC packet during infrastructure and measurement validation.
They demonstrate that the pipeline produces schema-valid, source-linked, auditable graphs.
They are not replicated, not human-evaluated, and not a comparison of the two conditions.

| File | Source run | What it is |
|---|---|---|
| `A-R2_single-pass_final_graph.smoke-exemplar.json` | SMK-LHC-A-R2 (Condition A) | The single-pass final graph. This is the protocol-designated final attempt of the run (the last call in the retry chain), parsed under the corrected harness and accepted via offline replay. |
| `B-R4_multipass_final_graph.smoke-exemplar.json` | SMK-LHC-B-R4 (Condition B) | The six-stage workflow's repaired final graph (stage 6 output). |
| `B-R4_adversarial_audit.smoke-exemplar.json` | SMK-LHC-B-R4 stage 5 | The adversarial-audit findings (10 findings) that the repair stage acted on. |
| `B-R4_repair_change_log.smoke-exemplar.json` | SMK-LHC-B-R4 stage 6 | The machine-readable repair change log (10 entries). |

Only parsed final artifacts are published. Raw provider envelopes, request snapshots, and
duplicate retry outputs are not included.

Reproduce the deterministic checks on these files with `cd ../harness && npm install && npm
run check`.
