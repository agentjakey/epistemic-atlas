# Epistemic Atlas

A methodology, schema, and static prototype for converting real-world epistemic disputes
into structured, queryable knowledge bases.

## What This Is

Epistemic Atlas is a submission to the FLF Epistemic Case Study Competition. It proposes
a six-stage human-AI workflow for taking messy, contested, multi-source disputes and
encoding them as structured knowledge graphs that preserve provenance, track epistemic
failure modes, surface cruxes, and flag missing evidence.

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
prompts/            Six-stage prompt pipeline for building an atlas entry
data/               Two partially verified worked examples (LHC black holes, dietary eggs)
app/                Next.js static prototype for exploring case studies
lib/                TypeScript types for schema v2
```

## Case Studies

**LHC Black Holes (2008):** The dispute over whether the Large Hadron Collider could
produce micro black holes capable of destroying Earth. Involves theoretical physics,
institutional risk assessment, and public communication.

**Dietary Eggs and Cardiovascular Risk:** The decades-long dispute over whether egg
consumption increases cardiovascular disease risk. Involves funding patterns, changing
methodological standards, and regulatory guidance that shifted without a clear
scientific resolution.

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

The `schema/epistemic-atlas.schema.json` file defines the canonical structure (JSON Schema
Draft 2020-12). Each atlas entry encodes:

- **Sources:** full provenance, credibility, and conflict of interest
- **Extracted claims:** verbatim or near-verbatim text from each source
- **Normalized claims:** unambiguous, scope-explicit propositions with position and confidence
- **Relations:** typed directed edges (supports, attacks, depends_on, reframes, narrows,
  generalizes, duplicates, conflicts_with, evidence_for, evidence_against)
- **Cruxes:** pivotal questions with resolution status and dependency links
- **Failure mode flags:** claim-level and source-level epistemic failure modes
- **Assessment:** overall status, weak links, and explicit update conditions
- **Missing evidence:** what evidence would change the assessment and why it does not exist
- **Audit notes:** open issues from the adversarial review step

## Six-Stage Pipeline

The `prompts/` directory contains the full prompt pipeline for building an atlas entry
from raw sources:

1. Scope the question
2. Source ingestion and provenance capture
3. Atomic claim extraction
4. Claim normalization
5. Relation mapping, crux identification, failure mode flagging, and assessment
6. Adversarial review and audit

See `docs/methodology.md` for the full pipeline description.

## Prototype Status

Prototype. The schema is usable for this submission, but still open to revision after
reviewer feedback. The two worked examples demonstrate the schema's expressive range
and the workflow on structurally different disputes. Neither case study should be treated
as a completed source-verified analysis.

## License

MIT
