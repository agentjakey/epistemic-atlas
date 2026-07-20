# LHC source packet

The frozen input both conditions received. 16 short verified excerpts from 6 sources on the
2008 dispute over whether the Large Hadron Collider could produce micro black holes capable
of catastrophic harm.

## Contents

| File | What it is |
|---|---|
| `packet.json` | the frozen packet: 6 sources, each with its short verified excerpts and location metadata. Checksum `2572241cfacc4b641280347920252e34a9455f8c2c8fd9f743f59687b59ec191` (CRLF-normalized). |
| `sources.json` | source-level metadata (citation, authors/org, date, type, classification, stable identifier, evidentiary role, limitations). |
| `excerpts.jsonl` | excerpt-level metadata (excerpt ID, source ID, short text, location, verification status/reviewer/date). |
| `CHECKSUMS.json` | packet and excerpt checksums. |
| `FREEZE_REPORT.md` | freeze provenance, source versions, and disclosed graph-language concerns. |

## Verification provenance (stated plainly, not overclaimed)

Verification was **AI-assisted source verification; owner-directed, with a four-item owner
spot-check.** Concretely: an AI reviewer checked each excerpt against the primary documents
under the owner's direction, an assistant performed a local recheck (normalized-text
containment plus PDF-render inspection of the math-bearing excerpts), and the owner personally
spot-checked the four highest-leverage or most error-prone excerpts against the rendered
PDFs. This is **not** a claim that all sixteen excerpts were independently hand-verified by
the owner. All 16 are marked verified; 13 were accepted as-is and 3 were revised-then-accepted.

## What is deliberately not published

Full source PDFs and any paywalled full texts are not redistributed - only short quotations
sufficient to ground the claim graph, plus metadata, checksums, and the bibliography below.

## Bibliography (6 sources)

- arXiv:0806.3414 - Giddings & Mangano, astrophysical constraints on the safety of LHC
  micro black holes (src_001).
- arXiv:0806.3381 - companion analysis in the same 2008 safety review (src_002).
- arXiv:0808.1415 - a principal objection preprint (src_009).
- arXiv:0808.4087 - Giddings-Mangano-related technical treatment (src_010).
- arXiv:0807.3349 - related safety analysis (src_011).
- arXiv:0901.2948 - later technical treatment, Randall-Sundrum-scenario constraints
  (src_012).

Exact citations, versions, and stable identifiers are in `sources.json` and
`FREEZE_REPORT.md`.

## Disclosed graph-language concerns

`FREEZE_REPORT.md` records specific places where the existing repository case-graph wording is
stronger than the verified source language (e.g. accretion-cross-section phrasing, "radiating
away their mass", "two independent lines"). These are disclosed rather than silently repaired;
the tracked case graphs are not altered by this experiment.
