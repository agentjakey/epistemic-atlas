# Living Workflow and Iterative Orchestration

## 1. Purpose

Epistemic Atlas can be run as a default ordered workflow, and for a first pass that is the simplest way to build an entry. But the more useful and more scalable way to think about an entry is iterative. The artifact is not meant to be a one-time answer. It is a partial knowledge base that can be extended as new sources appear, challenged by other readers, and reassessed as cruxes resolve or fail to resolve.

This matters because the value of the work compounds. A prose summary is read once and goes stale. A structured entry can be revisited: someone can add a source without rebuilding the whole thing, record a competing assessment without overwriting the first, or flag a weak relation for a domain expert to check later. The schema is built to make those revisits cheap. This document describes how.

A caveat up front: the iterative machinery described here is supported by the data model, not by automated tooling. The triggers and review structures exist in the schema, but acting on them is still done by a person. Read this as a description of an affordance, not a running system.

## 2. Default workflow

The default order for building an entry from scratch is:

1. scope
2. ingest
3. extract
4. normalize
5. map relations
6. assess
7. audit

Stages 1 through 5 build the structure, stage 6 forms a judgment about it, and stage 7 tries to break what the earlier stages produced. The corresponding prompt templates live in the `prompts/` directory.

This order is a starting path, not a fixed pipeline. In real disputes the work loops back: an audit finding sends you to renormalize a claim, a new source sends you back through extraction, a newly identified crux changes what you should have scoped. The rest of this document describes how the schema records those loops.

## 3. Core knowledge layer vs assessment layer

A v3 entry is organized into two layers.

The core knowledge layer holds the parts that are meant to be relatively reusable and source-grounded:

- sources
- extracted_claims
- normalized_claims
- relations

The assessment layer (`assessment_layer`) holds the parts that are more interpretive and more contestable:

- cruxes
- failure_mode_flags
- missing_evidence
- assessments
- reviews
- audit_notes

The point of the split is that two people can share the same core structure while disagreeing about the assessment built on top of it. A later analyst can reuse the sources, claims, and relations and still record a different read of which cruxes matter, which claims are weak links, or whether the dispute is settled. Keeping the layers separate means critique does not have to overwrite the underlying record.

The core layer is not beyond question. Relations in particular carry a `basis` field recording how each link is grounded, and in the current worked examples every relation is marked as inferred across sources and still needs source verification. But the core layer changes less often and for more objective reasons than the assessment layer does.

## 4. Trigger vocabulary

Cruxes, missing-evidence items, and audit notes can carry an optional `triggers` array. A trigger records which workflow pass the item is asking to have revisited. The vocabulary is:

- **rescope.** Use when the scoped question turns out to be vague, conflated, or answering more than one thing at once. Queues a return to the scope stage. Example: an audit note observes that "are eggs healthy?" bundles several different questions, so the entry should be rescoped before the assessment is trusted.
- **reingest.** Use when a needed source is missing or a placeholder source needs to be replaced with a real one. Queues a return to source ingestion. Example: a source-gap audit note points out that a relevant body of evidence was never consulted.
- **reextract.** Use when extracted claims may not faithfully reflect the source, for example because they are unverified paraphrases. Queues a return to extraction. Example: an audit note that all extracted claims are LLM-assisted paraphrases and need checking against the primary documents.
- **renormalize.** Use when a normalized claim may have drifted from what the source said, or two claims were merged that should be separate. Queues a return to normalization. Example: an audit note that a normalized claim quietly broadened the original.
- **remap_relations.** Use when the relation graph looks incomplete, mis-directed, or too confident about a link's grounding. Queues a return to relation mapping. Example: a relation marked inferred_across_sources that a reviewer thinks should be checked against a source before it is trusted.
- **reassess.** Use when the assessment may no longer match the underlying data, for example after a crux resolves or new evidence arrives. Queues a return to the assessment. Example: an unresolved crux that would change the conclusion if it were settled.
- **re_review.** Use when the entry should be put back through adversarial review, for example after substantial changes or because the first review was shallow. Queues another audit pass. Example: an audit note that flags work needing a second, independent look.

Triggers are not mandatory and should not be attached to every item. Use them only where the item clearly implies a next action.

## 5. Event-driven loops

Some recurring patterns, written as event then likely trigger:

- A new crux is identified that the original scope did not anticipate. Likely trigger: rescope, or reassess if the scope still holds.
- A missing-evidence item is logged. Likely trigger: reingest, if the evidence may exist somewhere not yet consulted, or simply a note that the gap is structural.
- An audit note reports a source gap. Likely trigger: reingest.
- An audit note reports unclear or drifted claim wording. Likely trigger: renormalize.
- A relation's grounding is uncertain or contested. Likely trigger: remap_relations.
- A new source is added. Likely chain: reextract, renormalize, remap_relations, then reassess, since a new source can ripple through every later stage.
- An adversarial review produces findings. Likely trigger: re_review for the follow-up pass, or reassess if the findings change the conclusion.

These are tendencies, not rules. The person maintaining the entry decides what a given event actually warrants.

## 6. User modes

The same structure supports several kinds of contributor.

- **Same investigator extending their own case.** The most common mode. You add sources and claims over time, remap relations, and update your own assessment as the picture fills in. The trigger fields are notes to your future self about what still needs doing.
- **Collaborator adding sources or structure.** A second person can extend the core knowledge layer (sources, claims, relations) without touching the original assessment. Their additions become part of the shared record.
- **Adversarial analyst adding critique or an alternative assessment.** Because the assessment layer holds an `assessments` array and a `reviews` array, a critic can record a competing assessment, or a `Review` object with role `adversary`, without overwriting the first analyst's work. The disagreement becomes part of the entry rather than a fork of it.

Multi-user tooling is not fully built. The schema represents these modes, but the prototype only minimally exercises them: both worked examples currently carry a single assessment and an empty reviews array. Questions of identity, trust between contributors, and how to reconcile conflicting assessments are not solved here. What the schema provides is a place to put more than one point of view, not a mechanism for deciding between them.

## 7. LHC example

Using only the framing already in the LHC worked example: the entry records that the primary safety argument draws on institutional sources that share authorship, and that several of its relations were inferred by the analyst rather than stated by any single source. An audit note about whether the safety case rests on partially overlapping institutional or theoretical assumptions could carry a `remap_relations` or `reingest` trigger. A future domain reviewer could then inspect whether specific relations should be promoted from `inferred_across_sources` to `asserted_in_source`, in the cases where a source actually draws the connection directly. None of that requires rebuilding the entry; it is a targeted revisit of the relation layer.

## 8. Eggs example

Using only the framing already in the eggs worked example: the entry treats the broad question "are eggs healthy?" as too vague to answer as stated, and separates it into population-specific and dietary-context-specific sub-questions. A crux about population-specific effects, or about whether the relevant comparison is eggs versus specific replacement foods, could reasonably carry a `rescope` trigger, signaling that the question should be narrowed before any assessment is trusted, and a `reingest` trigger if resolving it would require evidence not yet consulted. Several of the eggs cruxes are marked unresolved or empirically underdetermined and carry `reassess` triggers, since the conclusion would move if that evidence ever arrived.

## 9. Current limitations

To keep the framing honest:

- Orchestration is design-level, not fully automated. Nothing currently reads the trigger fields and acts on them. They are pointers a person follows.
- Trigger assignments are conservative and hand-set. In the worked examples they were added only where an item clearly implied a next action, and they should be read as suggestions rather than a complete map of everything worth revisiting.
- Multi-user identity, trust, and conflict resolution are not solved. The schema can hold multiple assessments and reviews, but it does not say whose assessment wins or how to merge disagreements.
- Relation basis still requires human and domain review. The default in the active data is the conservative `inferred_across_sources`, and promoting a relation to `asserted_in_source` is a judgment that a person has to make against the actual source.
- Source verification remains incomplete. All extracted claims and all relations in the worked examples are currently marked as needing source verification. The living workflow makes it easier to do that verification incrementally, but it does not do the verification for you.
