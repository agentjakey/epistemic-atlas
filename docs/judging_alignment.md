# Judging Alignment

This document maps Epistemic Atlas against eight questions we expect FLF judges to ask.
For each question: how the submission addresses it, one concrete example from the case
studies, and an honest statement of where the answer falls short.

---

## 1. Would this actually help someone reason better about this case?

**How addressed.** The interactive prototype lets a reader navigate the epistemic structure
of a dispute rather than read it sequentially. Clicking a normalized claim shows its
provenance (which source said what, verbatim), its supporting and opposing relations to other
claims, which cruxes it is implicated in, and what scenarios would update its status. The
schema also keeps four things visibly separate: what a source said (extracted claims), how it
was standardized (normalized claims), how claims connect (relations), and the analyst's
judgment about all of it (the assessment layer). A reader can follow the source-grounded
structure without being forced to accept the assessment built on top of it. This is not
available from any prose reading of the primary literature.

**Concrete example.** In the LHC case, a reader following the safety argument will find
that the LSAG 2008 conclusion (NC_012) carries two failure mode flags (correlated evidence
treated as independent, and expert consensus without dependency map) while the
Giddings-Mangano accretion argument (NC_004) carries none and provides the structurally
strongest support. A careful reading of the literature would surface this eventually; the
atlas surfaces it in one click. That is a genuine reasoning aid.

**Limitation.** The aid is only as good as the encoding. If a key claim was missed during
extraction, if a normalization shifted the meaning of a source claim, or if a crux was not
identified, the atlas gives the reader a false sense of completeness. The needs_source_
verification flags and the adversarial audit section document where these risks are highest
in the current entries.

---

## 2. Does it generalize?

**How addressed.** The schema is domain-agnostic. The same five relation families, twelve
failure mode types, and default workflow were applied to theoretical physics (LHC) and
observational epidemiology (eggs) without any case-specific extensions. The v3 move from ten
fixed relation types to five broad families plus optional subtype and tags makes the schema
less constrictive across domains: nuance that does not fit a family goes into free text rather
than forcing a new built-in type. The schema version is tracked in each file's _meta field; a
third case would use schema v3 without modification.

**Concrete example.** The failure mode correlated_evidence_treated_as_independent appears
in both cases. In the LHC case it flags that the 2003 CERN report and the 2008 LSAG report
share the same five authors. In the eggs case it flags that two decades of Harvard cohort
studies share data, authorship, and institutional context. The structural pattern is
identical despite the surface content being completely different. A cross-case query on
this failure mode type would surface both entries.

**Limitation.** Tested on two cases only. The schema may need extension for purely
normative disputes (ethics, rights, policy), disputes where the primary evidence is
quantitative models or forecasts rather than empirical studies, or legal disputes where
the interpretation of statutory language is the crux. These categories were not tested.

---

## 3. Does it scale with better AI or more compute?

**How addressed.** The workflow is designed so that source ingestion, claim extraction, and
relation mapping are the most automatable; they involve structured transformation of source
text into schema-conformant objects with relatively clear correctness criteria. These are the
stages that benefit most directly from better language models. Scoping, normalization, crux identification, failure mode flagging, and assessment
require judgment that scales with human expertise rather than compute. The schema also
records workflow triggers on cruxes, missing-evidence items, and audit notes, which gives a
more capable agent explicit signals about what to revisit rather than assuming the work is a
single linear pass. This is a design affordance for iterative loops, not a claim that the
loops are automated yet.

**Concrete example.** The extracted claims in both case studies were generated with LLM
assistance during claim extraction. A more capable model with better instruction following
and less hallucination risk would produce higher-quality extracted claims with less human
correction required. The normalization stage requires a human to decide whether two extracted
claims from different sources are asserting the same proposition or subtly different ones;
that judgment does not obviously improve with scale.

**Limitation.** The bottleneck steps (normalization, crux identification) involve subtle
semantic judgments. It is not clear that these improve reliably with current LLM scale.
Automated normalization that silently merges claims that are materially different is a
worse failure mode than slow normalization. The schema's design of preserving raw extracted
text alongside normalized text is intended to make this failure detectable, but detection
requires a reviewer.

---

## 4. Does it compound across people or teams?

**How addressed.** The JSON output is static, versioned, and format-stable. Multiple
people can extend the same entry by adding sources, claims, and relations without
rebuilding from scratch. The what_would_update field in each assessment explicitly states
what new evidence would change which claims. Because the core knowledge layer is kept
separate from the assessment layer, a later investigator can add critique without
overwriting the original graph: the assessment layer holds an assessments array (more than
one assessment can sit over the same structure) and a reviews array reserved for
collaborator, adversarial, or domain-expert review. The AuditNote type records open issues
so reviewers who come later know what the prior reviewer flagged.

**Concrete example.** If a new prospective study on eggs and CVD is published, a second
researcher can add it to data/eggs/sources.json and data/eggs/claims.json, record new
relations in graph.json, and update the assessment if the crux status changes. The prior
encoding is not discarded; it is extended. This is not how any current epistemic artifact
(summary, meta-analysis, Wikipedia article) is maintained.

**Limitation.** The multi-annotator support is schema-level only for now. The assessments
and reviews arrays exist and are documented, but both worked examples currently carry a
single assessment and an empty reviews array, so the multi-perspective workflow has not
actually been exercised. The schema also has no formal conflict resolution mechanism: if two
annotators produce different normalizations of the same claim, there is no automated way to
detect or reconcile the difference. The arrays make disagreement representable, not resolved.

---

## 5. Does it preserve provenance?

**How addressed.** Provenance is a first-class schema field, not a citation footnote. Each
source object carries author (string or array), institution, date, publication venue, DOI,
URL, retrieval date, and page range. Each extracted claim records its source ID and
location within the source. The conflict_of_interest field is populated where relevant.
Missing provenance fields are set to null, not omitted. Relations carry the same kind of
honesty: each one records a basis field stating whether the link was asserted in a source,
asserted by a later source, inferred across sources, or inferred by the analyst. This keeps
the difference between what a source said and what an analyst concluded visible in the data
rather than hidden inside a confident-looking edge.

**Concrete example.** The Wagner-Sancho legal complaint (src_008, LHC case) is a
low-credibility source with a non-scientific basis. It is retained in full with credibility
rated low and its nature described in the notes field. The extracted claim drawn from it
(EC_025) is included in NC_002's extracted_claim_ids not as scientific evidence but
because it documents the public risk concern that made the ADD model's prediction socially
significant. Provenance preservation makes this distinction recordable; a summary that
omits the complaint or treats it as equivalent to the CERN safety report would lose it.

**Limitation.** All 50 extracted claims across both case studies are marked
needs_source_verification: true. The specific effect sizes, statistical values, and
attribution claims in the extracted claims were generated with LLM assistance and have
not been checked against primary source documents. All 40 relations (20 per case) are
likewise marked needs_source_verification: true and carry basis inferred_across_sources,
which is a deliberately conservative default: they reflect analyst-level analysis of the
claims, not links a source explicitly drew. The provenance chain is structurally sound; its
content is not yet fully verified.

---

## 6. Does it preserve nuance rather than flattening?

**How addressed.** Several design decisions resist flattening. The extraction-normalization
split preserves the original phrasing alongside the interpreted form. The position field
has five values (pro, con, neutral, conditional, methodological) rather than a binary.
Confidence has four levels with an explanatory notes field. The assessment status has
three values (settled, unsettled, partially_settled) and the settled_direction field
distinguishes direction from status. Missing evidence is a first-class category, not a
binary "more research needed" note.

**Concrete example.** The eggs assessment does not produce a single verdict. It explicitly
records three sub-questions with different epistemic statuses: the question for healthy
adults consuming one egg or fewer per day (most null findings apply here), the question
for diabetic populations (NC_104, multiple studies suggest elevated risk, but CX_103 is
empirically underdetermined), and the question for eggs in the context of a high saturated
fat dietary pattern (NC_106, evidence is insufficient to separate the egg contribution).
The vague_question flag on NC_101 is marked affects_conclusion: true to make explicit that
the ambiguity is not minor.

**Limitation.** Nuance at the level of the normalized claim does not prevent a casual
reader from reading the assessment settled_direction field and stopping there. The
prototype does not enforce careful reading. Readers who want a quick answer can take the
assessment at face value and miss the qualifications recorded in weak_link_ids and the
crux resolution statuses. This is a design choice, not an oversight; the assessment is
meant to be informative quickly, with depth available on demand.

---

## 7. Does it survive adversarial scrutiny?

**How addressed.** Two mechanisms are built in. The extraction-normalization split creates
a paper trail: a reviewer can compare any normalized claim against its extracted claims
and source text to detect drift. The AuditNote type includes an asymmetric_flagging
subtype specifically to record cases where failure mode flags were applied unevenly across
positions. The adversarial audit step is a dedicated pass to catch normalization errors,
missing cruxes, and flag asymmetry. v3 adds schema-level support for more than one
assessment over the same graph and a reviews array for collaborator, adversarial, or
domain-expert review, so a second analyst can record a competing assessment without
overwriting the first.

**Concrete example.** AuditNote AN_001 in the LHC case records that the entire entry is
LLM-assisted and that every source reference requires verification. This is an open audit
note, not a resolved one. A judge reviewing the entry knows exactly where the highest
hallucination risk is and what it would take to resolve it.

**Limitation.** An encoder who wants to produce a motivated result can abuse any schema.
They can normalize toward a preferred conclusion, selectively apply flags to one side,
identify cruxes that happen to favor a desired assessment, or write what_would_update
scenarios that are technically possible but practically implausible. The schema makes these
moves detectable by a careful reviewer but does not prevent them. A multi-annotator
inter-rater study would provide the only strong evidence that the encoding is not
systematically biased, and no such study has been conducted. The multiple-assessment and
review support is present in the schema but not yet exercised: both worked examples carry a
single assessment and an empty reviews array, left empty deliberately rather than filled
with placeholder critique.

---

## 8. Is it easy for judges to inspect and reimplement?

**How addressed.** The data is static JSON in data/lhc/ and data/eggs/, readable without
running any code. The schema is published in schema/epistemic-atlas.schema.json with a
plain-English companion guide in schema/GUIDE.md. The TypeScript types in lib/types_v3.ts
serve as an executable specification. A judge who wants to build a third case study has
a schema, a type system, a default workflow with prompt templates, and two worked
examples to reference.

**Concrete example.** The schema/examples/ directory contains two small valid JSON files
(lhc_black_holes.json and eggs.json) that validate against the full schema. These are
separate from the full case study data and are specifically designed as minimal valid
examples a new implementer can start from.

**Limitation.** The interactive prototype requires Node.js and npm to run locally. A judge
who wants to inspect the data without running the prototype can read the JSON files
directly, but the claim inspection features (relation traversal, flag display, provenance
lookup) are only available in the running app. A static HTML export would remove this
dependency and is a reasonable addition before the final submission.
