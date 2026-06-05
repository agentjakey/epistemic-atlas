# Epistemic Atlas

A methodology and prototype schema for converting real-world epistemic disputes into structured, queryable knowledge bases.

## What This Is

Epistemic Atlas is a submission to the FLF Epistemic Case Study Competition. It proposes a protocol for taking messy, contested, multi-source disputes and encoding them as structured knowledge graphs that preserve provenance, track epistemic failure modes, surface cruxes, and flag missing evidence.

The goal is not to summarize debates. It is to make their epistemic content explicit and reusable.

## Why It Exists

Public epistemic failures tend to share common structural features: claims that outlived their evidence, missing provenance chains, unacknowledged cruxes, and failure modes that went unidentified because no one was tracking them. Standard summary tools compress this structure away. A structured knowledge base preserves it.

## What Is Inside

```
docs/               Contest writeup, methodology, limitations, judging alignment
schema/             JSON Schema specification and worked examples
prompts/            Six-step prompt pipeline for building an Epistemic Atlas entry
data/               Two fully structured case studies (LHC black holes, dietary eggs)
app/                Next.js prototype for exploring case studies
```

## Case Studies

**LHC Black Holes (2008)** -- The dispute over whether the Large Hadron Collider could produce micro black holes capable of destroying Earth. Involves theoretical physics, risk assessment, and public communication failures.

**Dietary Eggs and Cardiovascular Risk** -- The decades-long dispute over whether egg consumption increases cardiovascular disease risk. Involves funding bias, changing methodological standards, and regulatory lag.

Both case studies are marked with `"data_status": "sample"` where specific claim text, source metadata, or relation weights are illustrative rather than directly verified from primary sources.

## Running the Prototype

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Schema

The `schema/epistemic-atlas.schema.json` file defines the canonical structure. Each entry in the atlas contains:

- **Sources** with full provenance
- **Claims** as atomic, normalized propositions
- **Relations** (supports, attacks, depends on, qualifies)
- **Cruxes** -- pivotal claims whose resolution would significantly change the dispute
- **Missing evidence** -- what would need to exist to resolve open questions
- **Failure flags** -- detected epistemic failure modes at the claim level
- **Assessment** -- overall epistemic status and a summary of well-supported vs. contested claims

## Six-Step Pipeline

The `prompts/` directory contains the full prompt pipeline used to build an atlas entry from raw sources:

1. Source ingestion and provenance capture
2. Atomic claim extraction
3. Claim normalization
4. Relation mapping
5. Crux and missing evidence assessment
6. Adversarial review

See `docs/methodology.md` for full pipeline description.

## Status

Prototype. The schema is stable. The case study data is partially verified sample data. The Next.js app demonstrates the schema visually. This project is designed to be extended with real verified data.

## License

MIT
