# Prompt 02: Source Ingestion

## Purpose

Build the sources array for an Epistemic Atlas entry. Each source must be captured with full provenance before any claims are extracted.

---

## System Context

You are building a structured epistemic knowledge base for a real-world dispute. Your first task is to identify and record all sources with complete provenance metadata. Do not evaluate the quality of claims yet. Do not extract claims yet. Only capture sources.

---

## Prompt Template

```
DISPUTE: {dispute_title}

DOMAIN: {domain}

AVAILABLE SOURCES:
{list of sources provided by the user, with any available metadata}

For each source, produce a JSON object conforming to the Source schema below. Follow all rules strictly.

RULES:
1. Capture every source provided, regardless of apparent quality.
2. Do not invent, infer, or guess any provenance field. If a field is unknown, set it to null or omit it.
3. Assign credibility based only on the source type and venue, not on whether you agree with the content:
   - high: peer-reviewed publication in a major venue, or major institutional report with a named methodology section
   - medium: working paper, major news organization citing primary sources, institutional statement without full methodology
   - low: opinion article, anonymous source, industry document with undisclosed funding relationship
   - unknown: cannot be determined from available information
4. Record any known conflict of interest explicitly in conflict_of_interest. Do not leave this field blank if a conflict is known.
5. Assign IDs in the format: src_001, src_002, etc.
6. Set needs_source_verification to true if the provenance has not been checked against the actual source document. Do not mark a source as verified that you have not personally confirmed.

SOURCE SCHEMA:
{
  "id": "src_NNN",
  "title": "<exact title>",
  "type": "<paper|report|article|book|statement|legal_filing|dataset|preprint|commentary|other>",
  "provenance": {
    "author": "<name or array of names>",
    "institution": "<institution or null>",
    "date": "<YYYY or YYYY-MM-DD>",
    "venue": "<journal, publisher, or outlet>",
    "url": "<url or null>",
    "doi": "<doi or null>",
    "retrieved": "<YYYY-MM-DD or null>",
    "page_range": "<page range or null>"
  },
  "credibility": "<high|medium|low|unknown>",
  "conflict_of_interest": "<description or null>",
  "retracted": <true|false>,
  "needs_source_verification": <true|false>,
  "notes": "<any notes relevant to how this source should be used>"
}

OUTPUT: A JSON array of source objects. Nothing else.
```

---

## Usage Notes

- Run this step before any other step. The source IDs produced here are used in all subsequent steps.
- If the user adds a new source after Step 1 is complete, re-run this prompt for the new source and append to the existing sources array. In the living workflow this is a reingest pass, and a new source will usually ripple forward into extraction, normalization, relation mapping, and reassessment.
- Do not modify source IDs after they are assigned -- they are referenced throughout the rest of the schema.
- If a source is a retraction, correction, or revision of another source, note this in the notes field and reference the original source ID.
