# Prior-Art Mapping and Interoperability Notes

This document explains how Epistemic Atlas relates to existing provenance, argument-mapping,
and knowledge-graph formats. It keeps JSON as the canonical format for this prototype. The
mappings below are conceptual. Epistemic Atlas does not implement W3C PROV, the Argument
Interchange Format (AIF), RDF, or nanopublications, and nothing here should be read as a claim
of compliance with those standards. The point is to show that the schema sits in a recognizable
neighborhood of prior work, and that more formal exporters could be built later if they proved
useful.

## 1. Why JSON remains the primary format

JSON is inspectable, easy to validate against the published JSON Schema, easy to diff in version
control, and easy to use directly in the prototype. A reader can open a case file and follow the
structure without special tooling.

This submission is primarily about a workflow, a schema, and reusable epistemic artifacts, not
about a particular serialization. More formal export formats (PROV, RDF, AIF, nanopublications)
could be built on top of the same data later. They are not built now.

Treat this document as a conceptual mapping, not an implemented exporter. The analogues below are
approximate. They are meant to help a reader who already knows one of these standards orient
quickly, not to assert equivalence.

## 2. W3C PROV conceptual mapping

PROV-style provenance is relevant because Epistemic Atlas tracks where claims come from, what
activity produced them, and who was responsible. The atlas records sources, extraction and
normalization steps, the actors that performed them, and derivation links between artifacts.

This is a loose analogy, not full PROV compliance. PROV has a precise model of entities,
activities, and agents with formal relations; the atlas only echoes that shape informally.

| Epistemic Atlas object | Rough PROV analogue | Notes |
|------------------------|---------------------|-------|
| Source | Entity | A document, article, report, dataset, or other source artifact. |
| ExtractedClaim | Entity | A claim artifact generated from a source by extraction. |
| NormalizedClaim | Entity | A derived claim artifact based on one or more extracted claims. |
| Relation | Entity or qualified relation | Atlas keeps relations as inspectable JSON objects rather than native RDF or PROV edges. |
| Human analyst, model run, or reviewer | Agent | The actor responsible for extraction, normalization, assessment, or review. |
| Ingestion, extraction, normalization, or audit step | Activity | A process that generated or modified artifacts. |
| needs_source_verification and basis | Provenance annotation | Makes uncertainty about grounding explicit. |

## 3. Argument Interchange Format conceptual mapping

AIF is relevant because Epistemic Atlas includes claims and support, challenge, and
dependency-like structures between them. AIF formalizes information nodes and scheme nodes for
inference, conflict, and preference.

This is an approximate mapping, not exact AIF support. The atlas deliberately uses a small set of
broad relation families plus subtype and tags, rather than a strict argumentation ontology, so it
does not line up cleanly with AIF node types.

| Epistemic Atlas object | Rough AIF analogue | Notes |
|------------------------|--------------------|-------|
| NormalizedClaim | Information node-like object | A clear proposition that can participate in relations. |
| Relation.family = supports | Support or inference-like relation | Atlas uses a broad family plus subtype and tags instead of a strict argument ontology. |
| Relation.family = opposes | Conflict or attack-like relation | Used for challenges, objections, or tensions. |
| Relation.family = depends_on | Dependency or premise relation | Marks load-bearing assumptions or prerequisites. |
| Relation.family = contextualizes | Context or reframing relation | Captures narrowing, broadening, framing, or scope changes. |
| Crux | Assessment-layer load-bearing dependency | Not just an argument edge, but an analyst judgment about sensitivity. |
| Assessment and Review | Commentary or evaluation layer | Kept separate from the core graph. |

## 4. Nanopublication-style conceptual mapping

Nanopublications are relevant because an Epistemic Atlas claim could in principle be packaged into
a small unit of assertion plus provenance plus publication info. A nanopublication bundles a single
assertion with where it came from and who published it.

This is a conceptual parallel only. Epistemic Atlas does not currently emit nanopublications, and
the atlas keeps many claims and relations together in one case file rather than as separate
minimal units.

| Epistemic Atlas object | Rough nanopublication component | Notes |
|------------------------|---------------------------------|-------|
| NormalizedClaim or ExtractedClaim | Assertion | The claim being represented. |
| Source metadata and extracted_claim_ids | Provenance | Where the assertion came from and how it was derived. |
| Case metadata, author, and schema version | Publication info | Who produced the artifact and under what version and status. |
| AssessmentLayer | Annotation or opinion layer | More subjective and not part of the raw assertion. |
| needs_source_verification | Caution or qualification | Marks claims that should not be treated as verified. |

## 5. What Epistemic Atlas adds

Epistemic Atlas combines provenance, claim normalization, relation mapping, cruxes, missing
evidence, failure-mode flags, and assessment notes in one lightweight artifact. Each of the
standards above covers part of this. The atlas tries to cover the practical whole for a single
contested investigation.

The main contribution is not a new formal logic. It is a practical workflow for making messy
investigations easier to inspect, challenge, update, and reuse. The v3 layer split, separating the
core knowledge layer (sources, extracted claims, normalized claims, relations) from the assessment
layer (cruxes, failure-mode flags, missing evidence, assessments, reviews, audit notes), is meant
to let future investigators share the core graph while disagreeing about the assessments built on
top of it.

## 6. What remains future work

- Formal exporters to PROV/RDF, AIF, or nanopublication formats.
- Stable identity and authorship for multi-user review.
- Better conflict resolution between competing assessments.
- Automated validation of relation basis against the cited sources.
- More complete primary-source verification of claims and relations.
