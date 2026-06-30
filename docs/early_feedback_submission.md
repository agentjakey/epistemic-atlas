# Early Feedback Submission: Epistemic Atlas

**Submitter:** Jacob Ortiz
**Submission date:** June 21, 2026
**Project title:** Epistemic Atlas: A Human-AI Workflow for Building Trustworthy Claim Graphs from Messy Disputes
**Prototype:** Next.js interactive prototype with two partially verified worked examples
**Schema version:** 2 (JSON Schema Draft 2020-12), at the time of this early feedback

---

> **Note (later revision):** This document is a snapshot of the early-feedback submission as
> sent on June 21, 2026, and is kept as a record of that state. The schema has since been
> revised to v3 in response to reviewer feedback: ten fixed relation types were replaced by
> five broad relation families with optional subtype, tags, and a basis field; the hard split
> between "supports" and "evidence_for" was removed; cruxes, failure mode flags, missing
> evidence, assessments, reviews, and audit notes were grouped into a separate assessment
> layer; assessment became an assessments array with a reviews array for future
> multi-user or adversarial review; and the workflow is framed as a living, nonlinear loop
> with trigger fields. References below to "10 relation types," "Schema v2," or a strict
> "six-stage pipeline" describe the earlier state. See docs/writeup.md and schema/GUIDE.md for
> the current v3 description.

## Overview

Epistemic Atlas is a schema, six-stage human-AI pipeline, and interactive prototype for converting real-world disputes into structured, queryable knowledge bases. The core problem it addresses is structural: when a dispute unfolds in prose (across journal papers, safety reports, news coverage, and regulatory documents) the logical content of that dispute is progressively lost. Claims lose their provenance. Dependencies between claims disappear. Failure modes that were visible to participants become invisible to anyone reading the record later. The same structural errors then recur in the next dispute, in the next domain, because there is no surface to query across cases.

The submission includes two partially verified worked examples: the 2008 LHC black-hole risk dispute (settled, with resolved and unresolved cruxes) and the decades-long dietary eggs and cardiovascular disease debate (unsettled, with all cruxes open). Each case is encoded in a published v2 schema split across three JSON files (sources, claims, and graph) and rendered in an interactive web prototype where any normalized claim can be clicked to inspect its provenance, supporting and opposing relations, failure mode flags, crux dependencies, and update conditions. The full submission includes the schema specification, six prompt templates for pipeline execution, TypeScript types, and a writeup.

---

## Layers addressed

This submission addresses all three layers of what I understand the FLF evaluation framework to be concerned with:

- **Ingestion layer:** Every source is retained with full provenance metadata, credibility assessment, and explicit conflict of interest recording. The extraction step produces verbatim or near-verbatim claim objects traceable to specific sources.
- **Structure layer:** Normalized claims are connected by a typed directed relation graph (10 relation types). Failure mode flags attach at claim and source level (12 types). Cruxes are first-class objects with resolution status.
- **Assessment layer:** Each case produces a structured assessment with status (settled / unsettled / partially_settled), weak link identification, dominant failure modes, and explicit what-would-update scenarios.

---

## Why I think this is prize-relevant

The submission makes a structural contribution, not just a case study contribution. The schema is reusable: the same specification, the same pipeline, and the same failure mode vocabulary applied to two disputes from different domains with different resolution statuses. The cross-case pattern is itself a finding: correlated_evidence_treated_as_independent appears as a key failure mode flag in both the LHC case (CERN shared authorship) and the eggs case (Harvard cohort overlap), for structurally similar reasons despite completely different surface content. That kind of pattern is not visible in prose; it requires a queryable representation to surface.

The submission is also honest about what it is not. It is a prototype with partially verified data, not a complete epistemic infrastructure. The claims in both case studies are marked needs_source_verification: true. The Limitations section and evaluation address this directly.

---

## What is implemented

- Schema v2 (JSON Schema Draft 2020-12), with TypeScript types
- Full v2 data for both cases: 8 sources, 25 extracted claims, 12 normalized claims, 20 relations, 5 cruxes, 8-10 failure mode flags, 1 assessment, missing evidence, and audit notes per case
- Six-stage pipeline with prompt templates (prompts/01 through prompts/09)
- Interactive Next.js prototype: home, workflow, LHC case, eggs case, schema reference, evaluation, and limitations pages
- Interactive claim inspector: click any normalized claim to expand provenance, relations, failure mode flags, cruxes, and update conditions
- Writeup (docs/writeup.md, approximately 9 pages)

---

## What I plan to finish by July 19

- Primary source verification for the highest-priority claims in both cases (targeting data_status: partial to approach verified on key cruxes)
- A third worked example, likely from the FLF official case list, to demonstrate generality more directly
- Companion documents: docs/methodology.md (extended pipeline rationale) and docs/judging_alignment.md (explicit mapping to evaluation criteria)
- Minor prototype improvements: print/export view, relation graph summary visualization

---

## Questions for FLF reviewers

1. Does the combination of workflow, schema, and lightweight prototype seem aligned with what you would consider prize-relevant, or is there a layer or format you would weight more heavily?

2. Is the balance between LHC as a closed technical case and eggs as an open-ended everyday case useful, or does having one settled and one unsettled case make comparison harder?

3. Would you prefer deeper treatment of one case (full primary source verification, extended analysis) or broader treatment across all three official cases at the current depth?

4. Are the failure-mode flags and crux schema (as structured, queryable objects with severity ratings and resolution status) the kind of assessment-layer contribution you are looking for, or is the value primarily in the workflow and provenance chain?

5. Is JSON export sufficient as an interoperability demonstration, or would a more formal mapping to existing argument or knowledge graph formats (e.g., AIF, Wikidata, OWL) be valuable enough to pursue for July 19?
