# Epistemic Atlas: A Human-AI Workflow for Building Trustworthy Claim Graphs from Messy Disputes

**Competition:** FLF Epistemic Case Study Competition
**Submission type:** Methodology + Schema + Interactive Prototype
**Schema version:** 3 (JSON Schema Draft 2020-12)
**Data status:** Partial; all extracted claims and all relation links currently require source verification

---

## Abstract

Public epistemic disputes leave behind prose. Newspaper articles, journal papers, safety reports, and regulatory filings are the medium in which disputes unfold, but prose does not preserve the logical structure of a dispute. It does not record which claims depend on which others, which questions are genuinely pivotal, or where specific failure modes enter the argument. When a dispute ends (or seems to end), the record of why it ended is usually lost. The same failure modes recur across decades and domains because they are never made queryable.

Epistemic Atlas proposes a schema and a human-AI workflow for converting real-world disputes into structured, queryable knowledge bases. Each entry is organized into two layers. A core knowledge layer encodes claims at two levels (verbatim extraction and normalized proposition) and maps relations between normalized claims as a directed graph using a small set of relation families. A separate assessment layer holds the more interpretive material: epistemic failure mode flags attached at the individual claim and source level, pivotal cruxes with resolution status, missing evidence, and one or more overall assessments with explicit update conditions. The split lets a later analyst reuse the core structure while disagreeing about the assessment. The output is a machine-readable JSON file conforming to a published schema. It is also a human-navigable artifact.

This submission includes two partially verified worked examples: the 2008 LHC black-hole risk dispute and the decades-long debate over dietary eggs and cardiovascular disease risk. These examples are structured enough to demonstrate the workflow, schema, and interface, but they should not yet be treated as final authoritative knowledge bases. The submission also includes an interactive web prototype that lets a reader inspect any claim's provenance, relations, failure mode flags, crux dependencies, and update conditions. The primary claim is not that this prototype is complete. It is that the structural approach is sound, demonstrably general across substantively different disputes, and composable in ways that prose summaries and LLM-generated overviews are not.

---

## 1. Motivation: Why Summaries Are Not Enough

The standard response to a complicated dispute is a summary. A careful writer reads the sources, weighs the evidence, and produces a prose account of where things stand. This is genuinely useful. It is also structurally lossy in ways that matter.

A summary compresses. It selects which claims to include and which to omit, which conflicts to name explicitly and which to dissolve into hedged prose, which sources to cite and which to mention in passing. These are unavoidable editorial choices, and they are not preserved in the output. A reader of a summary cannot ask: which of these sentences depends on which others? Which conclusion would change if the third-paragraph study turns out to replicate poorly? Which sources share authors?

The compression is especially damaging along three dimensions. First, it destroys provenance chains. A summary statement like "most researchers agree that X" does not tell you who those researchers are, what institutional contexts they work in, whether their agreement is independent or reflects a shared intellectual lineage, or what the basis of their agreement actually is. Second, it buries cruxes. The pivotal empirical question that the entire dispute turns on often appears as a subordinate clause in a summary paragraph, when it should be the most visible element of the map. Third, it prevents cross-case learning. The same epistemic failure modes (funding bias in proximal observational studies, correlated evidence treated as independent, analogy arguments that do not transfer) recur across decades and domains. But because disputes live in prose, there is no surface to query across cases.

These are not failures of the summary writers. They reflect the fundamental limitations of prose as an epistemic medium. Prose is sequential. It can describe structure but cannot preserve it. A schema-based approach preserves structure by recording it explicitly, at the cost of requiring more time to build an entry than to write a summary.

The relevant comparison is not "schema vs. summary as a standalone product." It is "schema vs. summary over repeated use." A summary is read once and loses value as the dispute evolves. A structured entry can be updated as new sources arrive, queried for patterns, exported to other tools, and linked to other entries that share cruxes or failure modes. The value of the schema is compounding. The value of the summary is not.

---

## 2. Design Goals

Six goals shaped the schema and pipeline design. They are not all fully achieved in this prototype; they are the targets the design is oriented toward.

**G1. Preserve provenance without requiring it to be perfect.** Every claim must be traceable to a source. Every source must carry as much provenance metadata as is available. Missing provenance is represented as null, not omitted silently. A low-credibility source is retained and labeled, not discarded. The design handles the realistic case where provenance is incomplete without pretending it is complete.

**G2. Separate extraction from normalization.** The gap between what a source actually says and what an annotator makes of it is where most interpretive work (and most error) happens. Making this gap explicit, by preserving both the verbatim extracted claim and the normalized proposition, creates a paper trail that can be audited. It also prevents normalization from compressing what was said into what the annotator expected.

**G3. Make cruxes first-class objects.** A crux is a question whose resolution would significantly change the overall dispute. Treating cruxes as first-class objects with IDs, resolution status, and dependency links to normalized claims changes how a reader engages with the dispute. It is not an annotation on the margin; it is a navigational landmark.

**G4. Make failure modes queryable at claim level.** Attaching failure mode flags to individual claims and sources, rather than to the case as a whole, enables cross-case queries that case-level annotations do not support. The question "in which cases does correlated evidence appear in the key safety-supporting claims?" requires claim-level granularity to answer.

**G5. Represent honest incompleteness.** Missing evidence is a structured category, not a residual. The schema records what evidence does not currently exist, what it would resolve if it did exist, and whether obtaining it is feasible. This is a different category from evidence that exists but was not cited.

**G6. Support update without rebuild.** The entry should be updatable as new sources arrive and new evidence emerges. The schema dates each entry and records a data_status field. Update conditions are explicit in the assessment object. A well-built entry does not need to be rebuilt from scratch when the dispute develops; it needs to be extended.

---

## 3. Workflow Overview

The workflow converts raw source material into a structured atlas entry. The default order has six stages: stages 1 through 5 are constructive, and stage 6 is adversarial, actively trying to find errors in what the earlier stages built. The order is a starting path, not a strict one-way pipeline. Work in real disputes is iterative, and the schema is built to support that (see the note on a living workflow below).

**Stage 1 (Scope the question):** Define the central dispute as a single well-formed question before collecting sources. Vagueness at this stage propagates through all later stages. The question must be disputable, not settled by definition, and must name its in-scope populations, time periods, and conditions.

**Stage 2 (Ingest sources):** Build source objects with full provenance metadata. All consulted sources are retained regardless of quality or position. Missing provenance is set to null, not invented. Conflicts of interest are recorded when known.

**Stage 3 (Extract and normalize claims):** Extract every significant epistemic claim as an ExtractedClaim object with verbatim or near-verbatim text. Then group extracted claims into NormalizedClaim objects: unambiguous, scope-explicit propositions. The extracted_claim_ids field preserves the link to the source material. A single normalized claim can synthesize evidence from multiple extracted claims and sources.

**Stage 4 (Map structure):** Build a directed relation graph between normalized claims using five relation families (supports, opposes, depends_on, contextualizes, equivalent), with optional subtype and tags for nuance and a basis field recording how each link is grounded. Identify 2 to 7 pivotal questions as Crux objects with resolution status and dependency links. Attach FailureModeFlag objects to specific normalized claims or sources using a twelve-type controlled vocabulary. Cruxes, flags, and the rest of the interpretive material live in the assessment layer, separate from the core relation graph. Flags must be applied symmetrically across all positions in the dispute.

**Stage 5 (Produce assessment):** Synthesize the graph into an Assessment object: status (settled, unsettled, or partially_settled), settled_direction if settled, key crux IDs, weak link IDs, dominant failure modes, and explicit what-would-update scenarios. The assessment must be internally consistent with the claim and crux-level data.

**Stage 6 (Adversarial audit):** Actively review the completed entry for normalization drift, asymmetric failure flagging, inconsistent crux identification, and hallucinated source references if the entry was LLM-assisted. Record unresolved issues as AuditNote objects. A known open issue is better than a silent inaccuracy.

**A living workflow, not a one-way pipeline.** The six stages describe the default order, but a finished entry is rarely the end. A newly identified crux, a missing-evidence item, an audit note, or a newly found source can each send the work back to an earlier stage: rescope the question, reingest sources, re-extract claims, renormalize, remap relations, or reassess. The schema records these as trigger fields on cruxes, missing-evidence items, and audit notes (rescope, reingest, reextract, renormalize, remap_relations, reassess, re_review), so the next person to pick up an entry can see what it is asking to have revisited. This is a design affordance for iterative work. The orchestration around it (tools that act on triggers automatically) is still early, and the triggers are best read as hand-set pointers rather than an automated engine.

---

## 4. Data Model and Interoperability

The schema defines twelve object types, each with its own ID namespace and field requirements: Case, Source, ExtractedClaim, NormalizedClaim, Relation, AssessmentLayer, Crux, FailureModeFlag, MissingEvidence, Assessment, Review, and AuditNote. AssessmentLayer is a container that groups the interpretive objects; it is not a separate file. The objects divide into two layers. The core knowledge layer (sources, extracted claims, normalized claims, relations) is meant to be relatively reusable and source-grounded. The assessment layer (cruxes, failure mode flags, missing evidence, assessments, reviews, audit notes) is more interpretive and contestable. Different analysts can reuse the same core structure while disagreeing about cruxes, weak links, sensitivity, or the overall assessment. The full schema is published as a JSON Schema Draft 2020-12 document in schema/epistemic-atlas.schema.json.

Each atlas case is split across three JSON files. sources.json contains source objects. claims.json contains extracted claims and normalized claims. graph.json contains the relations array and the assessment_layer, a nested container that groups cruxes, failure mode flags, missing evidence, the assessments array, reviews, and audit notes. The three-file split is a packaging choice; the assessment layer is a container inside graph.json, not a separate file. Each file has a _meta wrapper that records the schema version, case ID, and data status.

Relations use five broad families rather than a long list of fixed types: supports (A raises the credibility of B), opposes (A lowers it or stands in tension with it), depends_on (A is only meaningful if B holds), contextualizes (A reframes, narrows, or generalizes B), and equivalent (A and B make the same claim). Finer distinctions are carried by an optional subtype and free-text tags rather than by the family itself. The revised schema intentionally avoids a crisp split between "support" and "evidence for," because real evidential support often combines empirical observation, theoretical assumption, source interpretation, and later analyst judgment, and forcing that into two separate built-in types misrepresented how mixed most real links are. Each relation also carries a basis field recording how the link is grounded: asserted_in_source, asserted_by_later_source, inferred_across_sources, analyst_inferred, or unclear. This keeps the difference between what a source actually stated and what an analyst inferred visible in the data itself.

The twelve failure mode types are chosen to reflect patterns that appear repeatedly across real disputes. They include: correlated_evidence_treated_as_independent, source_incentive_pressure, hidden_assumption, proxy_measure_problem, population_heterogeneity, analogy_dependency, direct_evidence_absent, vague_question, temporal_drift, expert_consensus_without_dependency_map, rhetorical_weight_exceeds_evidence, and closed_case_overconfidence. Each type has a controlled name that enables cross-case queries. The vocabulary is not exhaustive; it covers the patterns most relevant to the chosen case studies and is designed to be extended.

Each assessment's what_would_update field is worth specific attention. Rather than a vague statement that "more research is needed," each update scenario specifies a concrete condition (a named study design, a specific model parameter, a resolution of a crux), the normalized claim IDs it would affect, the direction of change (strengthen, weaken, or resolve), and the magnitude (decisive, significant, or minor). This converts the assessment from a snapshot verdict into a conditional map. An assessment can also record a light sensitivity analysis: which claims or cruxes the conclusion is robust or fragile to. Because the schema holds an assessments array rather than a single assessment, more than one assessment can sit over the same graph, and a reviews array is reserved for collaborator, adversarial, or domain-expert review. Both let a later analyst add judgment without overwriting the core structure. The reviews array is currently empty in both worked examples rather than filled with placeholder content.

All data is static JSON imported directly by the Next.js application. There are no external API calls, no server-side data fetching, and no database. The data can be exported, versioned with git, and ingested by any tool that can read JSON.

---

## 5. Worked Example 1: LHC Black-Hole Risk

### Background

In 2008, as the Large Hadron Collider was being commissioned, a public dispute arose over whether the collider could produce microscopic black holes capable of causing catastrophic harm to Earth. The scenario required two theoretical preconditions: that extra spatial dimensions exist at the scale predicted by the ADD model, enabling black hole production at LHC energies; and that those black holes, if produced, would not evaporate via Hawking radiation and would instead accrete matter and grow. CERN commissioned a formal safety review (the LSAG report), which concluded that LHC operations posed no meaningful risk. A federal legal challenge was filed in Hawaii and eventually dismissed.

### What the Atlas Encodes

The LHC case encodes 8 sources, 25 extracted claims, 12 normalized claims, 20 relations, 5 cruxes, and 8 failure mode flags. All extracted claim text is based on LLM-assisted paraphrase and has not been verified against primary source documents. All 20 relations are currently recorded with basis inferred_across_sources and marked needs_source_verification: true. This is a deliberately conservative default: the relations reflect analyst-level logical analysis of the claims rather than links a source explicitly drew. A later domain-review pass could promote specific relations to asserted_in_source where a source makes the connection directly. The graph should be read as a working structure, not a final one.

The five cruxes reveal the logical structure of the dispute. CX_001 (whether the kinematic analogy between LHC collisions and cosmic ray interactions is valid) was resolved true by the Giddings-Mangano analysis, which showed that cosmic rays have been delivering far higher equivalent energies to astrophysical bodies for billions of years without catastrophic effect. CX_002 (whether Hawking radiation occurs at the Planck scale) remains theoretically underdetermined: there is no confirmed experimental detection of Hawking radiation, and its occurrence at the relevant scales is a theoretical inference, not an observation. CX_003 (whether the ADD model's prediction of large extra dimensions holds) remains empirically underdetermined; CMS Run 1 data (NC_009) placed constraints but did not exclude the full parameter space. CX_004 (whether the Giddings-Mangano accretion argument is valid) was resolved true as a separate line of argument: even if Hawking radiation were absent, the accumulation timescale for black holes in the density regime of Earth makes catastrophic harm physically implausible on human timescales. CX_005 (whether the 2003 and 2008 CERN safety reports are meaningfully independent) remains unresolved.

The eight failure mode flags reveal something that a prose reading of the LSAG report would not easily surface. The primary safety conclusion (NC_012) carries two flags: correlated_evidence_treated_as_independent (FF_005), because the 2003 CERN report and the 2008 LSAG report share the same five authors; and expert_consensus_without_dependency_map (FF_008), because the report's framing as scientific consensus obscures which specific claims the consensus depends on. By contrast, the Giddings-Mangano argument (NC_004) carries no failure mode flags and has two outgoing strong relations: it provides evidence against NC_002 (the ADD model black hole concern) and supports NC_012 (the overall safety conclusion). The atlas makes explicit that NC_004 is the epistemically cleanest leg of the safety argument.

### Assessment

Status: settled. The settled direction is that LHC operations do not pose a risk of catastrophic harm from microscopic black holes at the scale of concern in 2008. The weak links are NC_003 (Hawking radiation evaporation, theoretically uncertain) and NC_005 (the 2003 CERN assessment framework, shared with the LSAG authorship). The key insight the atlas surfaces is that the settlement does not require Hawking radiation to be correct; the kinematic analogy and the accretion timescale argument provide independent lines of safety support that do not depend on the contested Hawking radiation premise.

---

## 6. Worked Example 2: Dietary Eggs and Cardiovascular Health

### Background

Whether regular egg consumption increases cardiovascular disease (CVD) risk is a question that has been debated in the nutrition science literature for decades. The relevant biological mechanism involves dietary cholesterol and its effect on plasma lipids. Regulatory guidance changed significantly when the 2015 Dietary Guidelines Advisory Committee removed the longstanding 300 mg/day dietary cholesterol limit. However, the guidance change was not driven by a clear resolution of the underlying science; it reflected a shift in expert judgment under genuine uncertainty. Subsequent high-profile studies, including Zhong et al. (2019) in JAMA, found positive associations that conflicted with several earlier null findings.

### What the Atlas Encodes

The eggs case encodes 8 sources, 25 extracted claims, 12 normalized claims, 20 relations, 5 cruxes, and 10 failure mode flags. All extracted claim text is based on LLM-assisted paraphrase and has not been verified against primary source documents. As in the LHC case, all 20 relations are currently recorded with basis inferred_across_sources and marked needs_source_verification: true, reflecting analyst-level analysis of the claims rather than links a source drew directly. This is deliberate humility, not a claim that the graph is final.

The five cruxes are all either unresolved or empirically underdetermined. CX_101 (whether the Zhong 2019 positive association reflects a causal relationship or a confounding artifact) is unresolved: the study is observational, and residual confounding by dietary pattern and socioeconomic factors is a documented concern. CX_102 (whether dietary pattern context determines the egg-CVD relationship) is unresolved: the evidence for dietary pattern mediation comes from observational studies with the same confounding limitations. CX_103 (whether the elevated risk in diabetic and pre-diabetic subgroups represents a meaningful biological difference) is empirically underdetermined: no adequately powered dedicated study exists for this subgroup. CX_104 (whether LDL is a valid proxy for egg-related CVD risk) is unresolved: eggs raise both LDL and HDL, and the net effect on cardiovascular risk via the LDL pathway is contested. CX_105 (whether the heterogeneity observed in meta-analyses between Asian and Western populations is biological or methodological in origin) is empirically underdetermined.

The ten failure mode flags form a more complex pattern than the LHC case. The vague_question flag (FF_105) on NC_101 is particularly important: the question "does egg consumption affect CVD risk?" is not a single question. It conflates at least three: the question for healthy adults consuming one egg or fewer per day in the context of a varied diet; the question for diabetic or insulin-resistant populations; and the question for people consuming eggs as part of a dietary pattern high in saturated fat and processed food. The flag on NC_101 is marked affects_conclusion: true, meaning the vagueness of the question is not merely a semantic issue but directly changes what the claim asserts. The population_heterogeneity flag (FF_101) on NC_101 is similarly marked affects_conclusion: true.

Two correlated_evidence_treated_as_independent flags capture the Harvard cohort overlap problem. Hu et al. (1999) and Drouin-Chartier et al. (2020) both analyzed NHS and HPFS cohort data; Frank B. Hu is a co-author on both papers. The meta-analytic literature that aggregates these papers as independent estimates is treating correlated sources as independent. This does not invalidate the null finding; it means the effective number of independent replications is smaller than a head count of studies would suggest.

### Assessment

Status: unsettled. The assessment makes explicit three sub-questions with different epistemic statuses:

1. For healthy adults consuming up to one egg per day in the context of a varied diet, the preponderance of high-quality observational evidence suggests no significant association with CVD risk. This sub-claim is most consistent with NC_101 (null finding) and NC_105 (Hu 1999 null in health professionals).

2. For people with diabetes or insulin resistance, several high-quality studies have reported elevated risk. This sub-claim is represented in NC_104 and is plausible, but CX_103 (meaningful biological difference) is empirically underdetermined. No adequately powered dedicated study exists.

3. For people consuming eggs in the context of dietary patterns high in saturated fat and processed food, the evidence is insufficient to separate the egg contribution from the dietary pattern contribution. NC_106 (dietary pattern context determines effect) is relevant here, and its support is observational.

The atlas does not produce a medical recommendation. It produces a structured map of what is and is not known, for whom, and under what conditions. This is a different output than either "eggs are fine" or "eggs are dangerous."

---

## 7. Evaluation

Four lenses were used to assess the submission.

**Faithfulness:** Does the encoding accurately reflect what the sources say? Partial. All 50 extracted claims in both case studies are marked needs_source_verification: true. They were derived with LLM assistance and represent paraphrases, not verbatim quotations verified against primary source documents. The schema records this status explicitly via the needs_source_verification flag and the data_status: partial metadata. The claims should be treated as working hypotheses, not verified records.

**Usefulness:** Does the structure help a reader understand the dispute better than prose does? Strong. Both case studies surface findings that are non-obvious from the prose literature. In the LHC case, the atlas makes clear that the Giddings-Mangano accretion argument is epistemically independent from the Hawking radiation argument, and that the primary safety report carries correlated-evidence flags that other lines of evidence do not. In the eggs case, the atlas makes explicit that the conflict between Zhong 2019 and earlier null findings is not resolvable by dose adjustment alone (a common rhetorical move in this literature) and is recorded as a genuine unresolved crux.

**Generality:** Does the schema transfer across substantively different disputes? Strong. The LHC and eggs cases involve different domains (theoretical physics vs. observational epidemiology), different resolution statuses (settled vs. unsettled), different primary failure mode profiles (institutional correlated evidence vs. population heterogeneity and funding pressure), and different crux structures (mostly resolved vs. all unresolved). Both cases use the same schema without any case-specific extensions. The five relation families plus optional tags and free text keep the schema from being constrictive across different domains. The fact that correlated_evidence_treated_as_independent appears as a key failure mode flag in both cases (for different structural reasons) illustrates how the schema enables cross-case pattern recognition.

**Adversarial robustness:** Can the structure resist motivated use? Partial. The schema makes motivated encoding detectable but does not prevent it. An encoder who systematically normalizes claims toward a preferred conclusion, selectively applies failure mode flags to one side, or identifies cruxes that happen to favor a desired assessment will not be caught by the schema alone. The detection mechanisms are: the needs_source_verification flag (which marks claims that have not been checked), the AuditNote type asymmetric_flagging (which the adversarial review step is designed to produce), and the explicit preservation of extracted claims for comparison against normalized claims. These mechanisms require a reviewer who knows to look for the problem. They do not automate the check.

---

## 8. What This Submission Is Not

**It is not a fully autonomous truth machine.** Every quality-sensitive step in the pipeline (scoping the question, normalizing claims, identifying cruxes, applying failure mode flags, producing the assessment) requires human judgment. The pipeline is designed for LLM-assisted execution with human oversight at each stage. LLM assistance reduces the time cost of source ingestion, claim extraction, and relation mapping. It increases the risk of hallucination in source references and claim attributions. The net result is a prototype that can be built faster but that requires more careful verification than a fully human-generated entry would.

**It is not a replacement for domain experts.** The LHC case required familiarity with the theoretical physics literature on extra dimensions, Hawking radiation, and cosmic ray physics. The eggs case required familiarity with observational epidemiology methodology, lipid metabolism research, and dietary cohort study design. The schema structures what experts know; it does not substitute for knowing it. An atlas entry built without domain expertise will have normalization errors that are not detectable from the schema alone.

**It is not a medical or physics authority.** The eggs case study explicitly does not produce a dietary recommendation. The LHC case study explicitly does not endorse any position on whether CERN's safety assessment was conducted appropriately. The atlas maps what the evidence says, what the cruxes are, and what update conditions exist. It does not tell anyone what to do with that map.

**It is not a generic LLM summary wrapper.** The output of a standard LLM prompt on "summarize the debate about egg consumption and CVD risk" is prose: fluent, balanced-sounding, and structurally lossy. The output of this workflow is a JSON graph with relations grouped into families, crux objects, failure mode flags, and explicit update conditions. The structure is the point. Producing that structure with LLM assistance is not the same as delegating the epistemic work to the LLM. The LLM writes draft text that a human reviews; it does not make the normalization decisions, the crux identification decisions, or the failure mode flagging decisions.

---

## 9. Limitations and Failure Modes

The following limitations are structural features of the current design, not implementation gaps that better engineering would resolve.

**Atomicity is not fully systematizable.** The requirement that each claim be atomic (one proposition, one testable assertion) is a target standard, not a guaranteed output. Many real-world claims bundle multiple propositions. Deciding where to split them involves judgment that the pipeline does not fully prescribe. Different annotators working from the same source text will produce different decompositions, reducing inter-annotator reliability.

**Normalization is interpretation.** The extracted-to-normalized gap is where the most consequential interpretive work happens. The schema preserves both forms and records the mapping, but there is no automated check that the normalized form accurately represents the extracted form. Normalization drift (where the normalized claim shifts the meaning of the original) is the failure mode most likely to go undetected and most damaging to faithfulness.

**Relation strength is subjective.** The strong / moderate / weak scale for relation strength is not formally defined. Two annotators working from the same source material will often assign different strengths to the same relation. The schema records the judgment but does not calibrate it.

**Source selection bias.** The atlas only knows what its sources know. If the consulted sources do not include a significant position, that position is absent from the atlas. Source selection is a major determinant of what the atlas represents. There is no automated completeness check.

**No formal consistency checking.** The relation families (supports, opposes, etc.) are not defined in a formal logical system. This makes the schema more accessible but means that consistency checks are informal. There is no automated detection of transitively inconsistent claims or cycles in the dependency graph.

**No uncertainty quantification.** Confidence levels are ordinal categories, not probability estimates. A claim rated "medium" confidence that depends_on a claim rated "low" confidence has no derived confidence level. Uncertainty does not propagate across the graph. This is a significant limitation for any downstream use that requires formal reasoning under uncertainty.

**Time cost.** A complete atlas entry from 8 sources typically requires 6 to 10 hours of human review time across all stages. This cost is not reducible to near-zero by LLM automation without sacrificing the quality properties that make the schema useful. The schema is designed for important disputes, not for every dispute.

---

## 10. Why This Can Compound

The argument for structured encoding over prose summary is not primarily about the value of a single entry. It is about what a growing library of entries makes possible.

A single encoded dispute is useful as a reference. It answers questions like: what does the evidence actually say, who are the key sources, what are the unresolved questions, what would update the conclusion? These questions are currently answered by reading and re-reading the primary literature, a process that is expensive and does not produce reusable artifacts.

A library of encoded disputes enables queries across cases. Which disputes share failure mode patterns? In which cases does source_incentive_pressure co-occur with correlated_evidence_treated_as_independent? Which cruxes that were once marked unresolved have since been marked resolved_true, and what type of evidence resolved them? These are questions about the structure of epistemic failure across domains, and they are not answerable from prose.

The library also enables linking. If a crux in one dispute (say, the validity of dietary cholesterol as a CVD risk factor) is relevant to another dispute (say, the effects of red meat consumption), the atlas can make that dependency explicit. A resolution of the shared crux propagates to both entries. This is not currently implemented in the prototype, but the schema supports it: crux IDs and claim IDs are strings that can be referenced cross-case.

Update is cheaper than rebuild. When a new high-quality study is published on egg consumption and CVD risk, adding it to the atlas requires creating new source and extracted claim objects and updating the relations and assessment that those new claims affect. It does not require reconstructing the full dispute from scratch. The structured encoding preserves the epistemic capital already invested.

Finally, the schema is machine-readable. The JSON output can be ingested by other tools: retrieval systems, reasoning engines, fact-checking pipelines, educational platforms. The atlas does not require the current prototype to be the final consumer of the data. Building an open library of structured disputes in a standard format creates a public good that no single piece of prose, however careful, can create.

---

## 11. Future Work

Several extensions would substantially increase the value of this approach.

**Full primary source verification.** Every claim in both case studies is marked needs_source_verification: true. The most important next step is verifying extracted claims against primary source documents by a domain expert and updating the data_status field accordingly. This is not a schema change; it is the labor that makes a partial entry into a verified one.

**Inter-annotator reliability study.** Building the same entry from the same sources with multiple independent annotators would measure how much of the structure is reproducible and where the highest-variance judgments are. This is a prerequisite for making any strong claims about the faithfulness of the approach.

**Visual graph rendering.** The current prototype displays relations as a structured list. A force-directed or DAG visualization of the claim graph would make the relation structure more legible for disputes with 20+ claims and relations.

**Quantified uncertainty propagation.** Replacing ordinal confidence levels with probability estimates and propagating uncertainty through the depends_on relation graph would enable formal reasoning about how confidence in the assessment depends on confidence in the weak links. This would require a significant schema extension but would address the most serious formal limitation of the current design.

**Cross-case crux linkage.** The schema currently supports within-case crux dependencies. Supporting explicit links between cruxes in different cases (for example, "resolving CX_104 in the eggs case would also update CX_201 in the red meat case") would be the first step toward a library with connected structure rather than isolated entries.

**Standardized adversarial review protocol.** A structured rubric for the adversarial audit step, with specific checks and inter-rater reliability targets, would make adversarial review more systematically useful and less dependent on individual reviewer quality. The reviews array added in v3 gives such a protocol a place to record its output.

---

*This document is the primary submission writeup for Epistemic Atlas. The full submission includes:*
*schema/epistemic-atlas.schema.json, schema/GUIDE.md, schema/examples/, data/lhc/, data/eggs/, prompts/ (prompt templates for the workflow stages), lib/types_v3.ts (TypeScript types), the interactive Next.js prototype (app/), and the companion documents docs/methodology.md, docs/limitations.md, and docs/judging_alignment.md.*
