# Prompt 04: Relation Mapping

## Purpose

Identify and record logical and evidential relationships between normalized claims.

---

## System Context

You are building a structured epistemic knowledge base. You have a normalized claims array from Step 3. Map the relationships between claims: which claims support which, which attack which, and which are structurally dependent.

---

## Prompt Template

```
DISPUTE: {dispute_title}

DOMAIN: {domain}

NORMALIZED CLAIMS (from Step 3):
{claims_json}

For each significant relationship between claims, produce a relation object. You do not need to record every possible relationship -- only those that are logically significant or that would matter to someone navigating the dispute.

RELATION TYPES:
- supports: Claim A provides evidence or logical justification that makes Claim B more likely to be true.
- attacks: Claim A provides evidence against, or is logically inconsistent with, Claim B being true.
- depends_on: Claim A is only meaningful or true if Claim B is true. If B is false, A cannot be evaluated.
- qualifies: Claim A narrows or restricts the scope of Claim B without directly contradicting it. B may still be true; A says it is true only under conditions.
- implies: Claim A logically entails Claim B (stronger than supports -- if A is true, B must be true).
- is_crux_of: Claim A is a pivotal load-bearing claim for Claim B. If A were false, B would be significantly weakened or unsupportable.

STRENGTH RULES:
- strong: The relationship is direct, explicit in the source material, and logically tight.
- moderate: The relationship is plausible and supported but involves some inferential steps.
- weak: The relationship is indirect, speculative, or depends on premises not in the atlas.

MAPPING RULES:
1. Only record relationships between claims in this atlas. Do not introduce external facts.
2. Relationships are not symmetric -- specify direction from_claim_id -> to_claim_id carefully.
3. "A supports B" is not the same as "B supports A". A piece of evidence supports a conclusion; the conclusion does not support the evidence.
4. Do not infer relationships that are not analytically obvious or supported by the source material.
5. Assign IDs in the format: R001, R002, etc.
6. A single claim can be involved in multiple relationships.

RELATION SCHEMA:
{
  "id": "R_NNN",
  "from_claim_id": "<claim id>",
  "to_claim_id": "<claim id>",
  "type": "<supports|attacks|depends_on|qualifies|implies|is_crux_of>",
  "strength": "<strong|moderate|weak>",
  "notes": "<explanation of why this relation holds, especially for non-obvious cases>"
}

OUTPUT: A JSON array of relation objects. Nothing else.
```

---

## Usage Notes

- The relation graph should be directed. Check that the direction is correct before finalizing.
- Pay special attention to `depends_on` relations -- they reveal the structure of assumptions underlying the dispute. A long depends_on chain suggests a dispute with a deep crux.
- `is_crux_of` relations are rare but important. They should connect directly to crux objects in Step 5.
- After running this step, check the relation graph for cycles. A -> B -> A usually indicates an error in direction or a conflation of two different claims.
