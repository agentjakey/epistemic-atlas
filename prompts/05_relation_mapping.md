# Prompt 05: Relation Mapping

## Purpose

Identify and record relationships between normalized claims. Relations are part of the core
knowledge layer, alongside sources, extracted claims, and normalized claims. They are kept
separate from the assessment layer (cruxes, failure mode flags, assessments), which is built
on top of them later.

---

## System Context

You are building a structured epistemic knowledge base. You have a normalized claims array
from the normalization step. Map the relationships between claims: which claims raise or
lower the credibility of which others, which depend on which, and which restate or
recontextualize each other.

v3 uses five broad relation families rather than a long list of fixed types. The goal is a
small, clear graph, not an exhaustive one. Nuance goes into the optional `subtype`, `tags`,
and `notes` fields rather than into new family names.

---

## Prompt Template

```
DISPUTE: {dispute_title}

DOMAIN: {domain}

NORMALIZED CLAIMS (from the normalization step):
{normalized_claims_json}

For each significant relationship between claims, produce a relation object. You do not need
to record every possible relationship. Record only those that are logically significant or
that would matter to someone navigating the dispute. Prefer fewer, clearer relations over a
dense graph full of weak links.

RELATION FAMILIES:
- supports: Claim A raises the credibility of Claim B, whether by logical justification or by
  empirical evidence. Do not split logical "support" from empirical "evidence for"; both are
  supports. If the distinction matters in a given case, record it in subtype (for example
  "empirical" or "logical") rather than as a separate family.
- opposes: Claim A lowers the credibility of Claim B or stands in tension with it. This covers
  direct contradiction, empirical evidence against, and mutual tension where two claims cannot
  both be fully right but neither strictly refutes the other. Use subtype to record which case
  applies (for example "empirical", "logical", or "mutual_tension").
- depends_on: Claim A is only meaningful or true if Claim B is true. If B is false, A cannot
  be evaluated.
- contextualizes: Claim A changes the scope or interpretation of Claim B without simply
  supporting or opposing it. This covers narrowing, generalizing, and reframing. Record which
  in subtype (for example "narrow", "generalize", or "reframe").
- equivalent: Claim A and Claim B assert the same proposition, usually from different sources.

BASIS (how the relation is grounded):
- asserted_in_source: a single source states this relation directly.
- asserted_by_later_source: a later source explicitly draws the connection between earlier
  claims.
- inferred_across_sources: you are synthesizing the relation by comparing several sources,
  none of which states it outright.
- analyst_inferred: this is your own logical inference, not stated by any source.
- unclear: the grounding has not been determined.

Set basis honestly. If you are drawing a link the sources did not draw, say so with
analyst_inferred or inferred_across_sources rather than implying a source made the connection.
When basis is asserted_in_source or asserted_by_later_source, list the source IDs in
basis_source_ids.

STRENGTH:
- strong: the relationship is direct, well-established, and logically or methodologically tight.
- moderate: plausible and supported but involving some inferential steps or caveats.
- weak: indirect, speculative, or dependent on premises not in the atlas.

MAPPING RULES:
1. Only record relationships between claims in this atlas. Do not introduce external facts.
2. Relations are directed. Specify direction from_id -> to_id carefully. "A supports B" is not
   "B supports A": a piece of evidence supports a conclusion, not the other way around.
3. Do not invent relationships that are not analytically defensible or supported by the
   source material.
4. Default needs_source_verification to true whenever the basis is inferred_across_sources,
   analyst_inferred, or unclear, or whenever you are not certain the grounding is correct.
5. Preserve disagreement and ambiguity in notes rather than resolving it prematurely. If two
   readings of a relation are both defensible, say so.
6. Assign IDs in the format R_001, R_002, etc.
7. A single claim can be involved in multiple relations.

RELATION SCHEMA:
{
  "id": "R_NNN",
  "from_id": "<NC id>",
  "to_id": "<NC id>",
  "family": "<supports|opposes|depends_on|contextualizes|equivalent>",
  "subtype": "<optional free-text label, or null>",
  "tags": ["<optional free-text tags>"],
  "basis": "<asserted_in_source|asserted_by_later_source|inferred_across_sources|analyst_inferred|unclear>",
  "basis_source_ids": ["<src id>", ...],
  "strength": "<strong|moderate|weak>",
  "notes": "<explanation of why this relation holds, including any ambiguity or disagreement>",
  "needs_source_verification": <true|false>
}

OUTPUT: A JSON array of relation objects. Nothing else.
```

---

## Usage Notes

- The relation graph should be directed. Check that the direction is correct before
  finalizing.
- Pay special attention to `depends_on` relations. They reveal the structure of assumptions
  underlying the dispute. A long depends_on chain suggests a dispute with a deep crux, which
  the crux identification step should pick up.
- Do not force a crisp support-versus-evidence distinction. If you find yourself wanting a
  family that is "empirical support" as opposed to "logical support," use the supports family
  with subtype "empirical" instead.
- After running this step, check the graph for cycles. A -> B -> A usually indicates an error
  in direction or a conflation of two different claims.
- Relations belong to the core knowledge layer. Do not record cruxes, failure mode flags, or
  assessments here. Those come later and live in the assessment layer.
