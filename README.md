# Epistemic Atlas

A methodology, schema, and static prototype for converting real-world epistemic disputes
into structured, queryable knowledge bases.

<img width="1870" height="984" alt="Screenshot 2026-06-05 001331" src="https://github.com/user-attachments/assets/e873bece-3480-41bd-af4d-87abaaca173f" />

## What This Is

Epistemic Atlas is a submission to the FLF Epistemic Case Study Competition. It proposes
a human-AI workflow for taking messy, contested, multi-source disputes and encoding them
as structured knowledge graphs that preserve provenance, track epistemic failure modes,
surface cruxes, and flag missing evidence. The workflow has a default order but is meant
to be revisited rather than run once start to finish.

The goal is not to summarize debates. It is to make their epistemic content explicit
and reusable: who said what, what depends on what, where the pivotal questions are,
and what would change the conclusion.

## What This Is Not

Epistemic Atlas is not a truth machine, a fact-checker, or a final authority on any
scientific or medical question. The two case studies in this submission are partially
verified worked examples that demonstrate the workflow and schema. They should not be
treated as authoritative analyses.

## What Is Inside

```
docs/               Contest writeup, methodology, limitations, judging alignment
schema/             JSON Schema specification and worked examples
prompts/            Prompt templates for the workflow stages
data/               Two partially verified worked examples (LHC black holes, dietary eggs)
app/                Next.js static prototype for exploring case studies
lib/                TypeScript types for schema v3
```

## Case Studies

**LHC Black Holes (2008):** The dispute over whether the Large Hadron Collider could
produce micro black holes capable of destroying Earth. Involves theoretical physics,
institutional risk assessment, and public communication.

**Dietary Eggs and Cardiovascular Risk:** The decades-long dispute over whether egg
consumption increases cardiovascular disease risk. Involves funding patterns, changing
methodological standards, and dietary guidance that changed under ongoing scientific
uncertainty.

Both case studies are marked as partial data where specific claim text, source metadata,
or relation values are based on paraphrase rather than direct primary-source verification.
All extracted claims carry the `needs_source_verification: true` flag.

## Running the Prototype

No external API or database required. All data is static JSON.

```bash
npm install
npm run dev
```

Open http://localhost:3000

The prototype reads all data from the `data/` directory at build time. No server is
required after build.

## Schema

The `schema/epistemic-atlas.schema.json` file defines the canonical structure (schema v3,
JSON Schema Draft 2020-12). An atlas entry is organized into two layers.

The core knowledge layer is the reusable, source-grounded structure:

- **Sources:** full provenance, credibility, and conflict of interest
- **Extracted claims:** verbatim or near-verbatim text from each source
- **Normalized claims:** unambiguous, scope-explicit propositions with position and confidence
- **Relations:** directed edges grouped into five families (supports, opposes, depends_on,
  contextualizes, equivalent), with optional `subtype` and `tags` for nuance and a `basis`
  field recording how each link is grounded (asserted in a source, asserted by a later
  source, inferred across sources, analyst inferred, or unclear)

The assessment layer (`assessment_layer`) holds the more interpretive material, which a
later analyst can revise or contest without changing the core structure:

- **Cruxes:** pivotal questions with resolution status and dependency links
- **Failure mode flags:** claim-level and source-level epistemic failure modes
- **Missing evidence:** what evidence would change the assessment and why it does not exist
- **Assessments:** one or more overall assessments, each with status, weak links, sensitivity,
  and explicit update conditions
- **Reviews:** a place for future collaborator, adversarial, or domain-expert review (currently empty)
- **Audit notes:** open issues from the adversarial review step

The earlier v2 schema used ten fixed relation types and split logical "supports" from
empirical "evidence_for." v3 drops that split: real evidential support usually blends
empirical observation, theoretical assumption, source interpretation, and later analyst
judgment, so the schema records the broad family and pushes nuance into `subtype`, `tags`,
`basis`, and free-text notes instead of forcing a hard choice.

For how the schema relates to existing provenance and argument formats (W3C PROV, the Argument
Interchange Format, and nanopublications), see `docs/prior_art_mapping.md`. Those mappings are
conceptual; the atlas keeps JSON as its canonical format and does not implement those standards.

## Workflow

The `prompts/` directory contains one prompt template per stage for building an atlas entry
from raw sources. The default order is:

1. Scope the question (`01_scope.md`)
2. Source ingestion and provenance capture (`02_source_ingestion.md`)
3. Claim extraction, kept close to the source (`03_claim_extraction.md`)
4. Claim normalization (`04_claim_normalization.md`)
5. Relation mapping, five families with a recorded basis (`05_relation_mapping.md`)
6. Assessment layer: cruxes, failure mode flags, missing evidence, assessments (`06_assessment_layer.md`)
7. Adversarial audit (`07_adversarial_audit.md`)

Stages 2 through 5 build the core knowledge layer; stage 6 builds the assessment layer.

This order is a starting path, not a one-way pipeline. A new crux, a missing-evidence item,
an audit note, or a newly found source can send you back to rescope, reingest, re-extract,
renormalize, remap relations, or reassess. The schema records these triggers on cruxes,
missing-evidence items, and audit notes, though the orchestration around them is still early.

See `docs/methodology.md` for the full description, and `docs/living_workflow.md` for how the
workflow loops and compounds over time.

## Prototype Status

Prototype. The schema is usable for this submission, but still open to revision after
reviewer feedback. The two worked examples demonstrate the schema's expressive range
and the workflow on structurally different disputes. Neither case study should be treated
as a completed source-verified analysis.

## License

MIT
