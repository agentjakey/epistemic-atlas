# Epistemic Atlas: [LIVE DEMO](https://epistemic-atlas.vercel.app/)

Epistemic Atlas is a human-AI workflow for turning messy disputes into inspectable claim
graphs with provenance, relation mapping, cruxes, missing evidence, and assessment notes.

<img width="1870" height="984" alt="Screenshot 2026-06-05 001331" src="https://github.com/user-attachments/assets/e873bece-3480-41bd-af4d-87abaaca173f" />

## What it is

This is the final Epistemic Atlas submission to the FLF Epistemic Case Study Competition. It
has four parts: a lightweight, ordered workflow for building one structured entry from raw
sources; a JSON schema (v3, JSON Schema Draft 2020-12) for the resulting artifact; a static
Next.js prototype for exploring the artifact; and two partially verified worked examples.

The goal is to preserve the reasoning structure of a dispute rather than compress it into a
prose summary. A summary hides the things a careful reader most needs: who said what, where it
came from, what depends on what, and what would change the conclusion. Epistemic Atlas makes
those pieces explicit and inspectable, and keeps them in a form that a later investigator can
challenge, correct, or extend rather than rewrite from scratch. It is not a truth machine, a
fact-checker, or a final authority on any scientific or medical question.

## Recommended path for judges

1. `docs/writeup.md` for the full argument and worked examples.
2. `docs/methodology.md` for the stage-by-stage workflow.
3. `docs/living_workflow.md` for how an entry is revisited and compounds over time.
4. `docs/prior_art_mapping.md` for how the schema relates to existing formats.
5. `schema/epistemic-atlas.schema.json` and `schema/GUIDE.md` for the schema.
6. `data/lhc/graph.json` and `data/eggs/graph.json` for the worked-example structure.
7. Run the app (below) to explore the cases interactively.

## Worked examples

**LHC black-hole risk (2008):** a relatively closed technical case. Whether the Large Hadron
Collider could produce micro black holes capable of catastrophic harm. 20 relations.

**Dietary eggs and cardiovascular risk:** an open-ended everyday evidence case. Whether egg
consumption raises cardiovascular disease risk, across decades of conflicting observational
studies. 20 relations.

Both are partially verified worked demonstrations, not final authoritative analyses. In both
cases all relations are currently marked `basis: inferred_across_sources` and
`needs_source_verification: true`, and all extracted claims carry `needs_source_verification:
true`. This is deliberate caution. The relations reflect analyst-level analysis of the claims
rather than links a source drew directly, and the graph should be read as a working structure,
not a set of final edges. The LHC case is not physics safety advice. The eggs case is not
medical or dietary advice.

## Schema v3 in brief

Core knowledge layer (reusable, source-grounded):

- `sources`
- `extracted_claims`
- `normalized_claims`
- `relations`

Assessment layer (more interpretive, contestable):

- `cruxes`
- `failure_mode_flags`
- `missing_evidence`
- `assessments`
- `reviews`
- `audit_notes`

Relation families: `supports`, `opposes`, `depends_on`, `contextualizes`, `equivalent`.

Relation basis: `asserted_in_source`, `asserted_by_later_source`, `inferred_across_sources`,
`analyst_inferred`, `unclear`.

The schema avoids a hard support-versus-evidence split because real evidential support often
blends empirical observation, theoretical assumption, source interpretation, and analyst
judgment. Nuance goes into `subtype`, `tags`, `basis`, and free-text notes instead.

## Workflow

Seven prompt templates in `prompts/`, one per stage:

1. `01_scope.md`
2. `02_source_ingestion.md`
3. `03_claim_extraction.md`
4. `04_claim_normalization.md`
5. `05_relation_mapping.md`
6. `06_assessment_layer.md`
7. `07_adversarial_audit.md`

The order is the default starting path. It is not a one-way pipeline: a new crux, a
missing-evidence item, an audit note, or a newly found source can send the work back to an
earlier stage through the schema's trigger fields. The orchestration around those triggers is
still early; treat them as hand-set pointers, not an automated engine. See
`docs/living_workflow.md`.

## How to run

No external API or database is required. All data is static JSON.

```bash
npm install
npm run dev         # http://localhost:3000
npm run check:data  # zero-dependency structural check of the data files
npm run build       # static build
```

## Limitations

- The worked examples are partially verified. They demonstrate the workflow and schema, not
  authoritative analyses.
- Not medical advice. Not physics advice.
- Relation `basis` still needs domain review. The conservative default in the active data is
  `inferred_across_sources`, and promoting an edge to `asserted_in_source` is a human judgment.
- Multi-user and adversarial review are supported by the schema (`assessments[]`, `reviews[]`)
  but only minimally exercised: both cases carry a single assessment and an empty reviews array.
- Formal exporters to PROV, AIF, or nanopublication formats are future work. The prior-art
  mapping is conceptual, not an implementation.

## Documentation

- [docs/writeup.md](docs/writeup.md) - full submission writeup
- [docs/methodology.md](docs/methodology.md) - the stage-by-stage workflow
- [docs/living_workflow.md](docs/living_workflow.md) - iterative, non-linear use
- [docs/prior_art_mapping.md](docs/prior_art_mapping.md) - PROV, AIF, nanopublication notes
- [docs/judging_alignment.md](docs/judging_alignment.md) - how the submission maps to evaluation criteria
- [docs/limitations.md](docs/limitations.md) - honest limitations
- [docs/adversarial_audit.md](docs/adversarial_audit.md) - adversarial self-audit
- [schema/GUIDE.md](schema/GUIDE.md) - plain-English schema guide

## License

MIT
