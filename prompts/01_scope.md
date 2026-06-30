# Prompt 01: Scope the Question

## Purpose

Define the central dispute as a single, well-formed question before collecting any sources.
A poorly scoped question produces a poorly scoped atlas entry. This step takes 15-30 minutes
and saves hours of rework.

---

## System Context

You are beginning to build a structured epistemic knowledge base. Before any sources are
ingested or claims extracted, the dispute must be scoped. Your output is a case skeleton:
a stable definition of what this atlas entry is and is not trying to answer.

---

## Prompt Template

```
DISPUTE SUBJECT: {what the user wants to investigate}

INITIAL CONTEXT: {any background the user has provided}

Your task is to produce a case skeleton for this dispute. Do not ingest sources yet.
Do not extract claims. Only define the scope.

RULES:
1. The central question must be disputable -- not settled by definition, not purely
   a matter of values, and not resolvable by looking up a single authoritative source.
2. Name the populations, time periods, and conditions that are in scope explicitly.
   Vagueness at this step propagates through all later steps.
3. Do not pre-answer the question. The scope statement is epistemic framing,
   not a preliminary verdict.
4. If the subject dissolves into multiple independent questions, name each as a
   distinct sub-question with its own scope conditions. Do not merge them artificially.
5. The summary must be neutral. It should be acceptable to all major parties in the
   dispute before any evidence is examined.

CASE SKELETON SCHEMA:
{
  "id": "<kebab-case-identifier>",
  "title": "<human-readable title of the dispute>",
  "domain": "<primary knowledge domain>",
  "subdomain": "<more specific domain, or null>",
  "status": "open",
  "data_status": "sample",
  "summary": "<neutral 2-4 sentence description of the dispute, what is at stake, and why it is contested>",
  "central_question": "<the specific disputable question this entry will address>",
  "in_scope": ["<what populations, periods, or conditions are included>"],
  "out_of_scope": ["<what is explicitly excluded and why>"],
  "sub_questions": ["<any distinct sub-questions, or empty array>"],
  "tags": ["<thematic tags>"]
}

OUTPUT: A single case skeleton object. Nothing else.
```

---

## Scope Quality Check

Before proceeding to Step 2, verify:

- Can the central_question be answered yes or no, or by a specific empirical finding?
  If not, it may be a values question rather than an epistemic one.
- Would a proponent and an opponent of the dominant view both accept the summary
  as a neutral description of what is being disputed?
- Does the in_scope list name specific populations or conditions, or does it use
  vague language like "people" or "in general"?
- If sub_questions exist, are they actually independent (different evidence base)
  or just reformulations of the same question?

---

## Usage Notes

- The case ID established here is permanent. Use it to name the data directory
  (e.g., data/{id}/).
- The summary produced here will appear in the prototype UI header. It should be
  readable by a non-specialist.
- If scoping reveals the dispute has no real epistemic content (e.g., it is purely
  a values dispute), stop here. The schema is not appropriate for purely normative
  questions without empirical components.
- Scoping only frames the question. Do not produce cruxes, failure mode flags, or an
  assessment here; those belong to the assessment layer and come much later. The scope is
  not final either: if a later crux or audit note shows the question was too broad or
  conflated, the entry can be rescoped (the rescope trigger in the living workflow).
