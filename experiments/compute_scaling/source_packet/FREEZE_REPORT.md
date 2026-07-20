# LHC Source Packet - Freeze Report

Frozen 2026-07-15 as SOURCE-VERIFIED. This report records the freeze provenance and
checksums. The packet is source-verified (owner-directed AI-assisted verification
plus assistant local recheck); it is NOT independently human-verified, NOT
multi-reviewer verified, and NOT a scientific adjudication of the LHC
black-hole-risk dispute.

## Freeze provenance

- Verification reviewer: OpenAI GPT-5.6 Thinking (AI-assisted source verification;
  owner-directed under Jacob Ortiz), 2026-07-15.
- Local recheck: assistant (Claude), 2026-07-15 - normalized-text containment plus
  PDF render inspection of c012/c014/c015/c016. See LOCAL_PDF_VERIFICATION.json.
- Full narrative and exact revisions: ASSISTANT_VERIFICATION_HANDOFF.md.
- Process note (disclosed deviation): the locked protocol specified Jacob would
  personally read each excerpt before freezing. This freeze substitutes
  owner-directed AI verification plus assistant recheck, with a four-item owner
  spot-check outstanding.

## Final excerpt set

- 16 excerpts, all verification_status = "verified", verified_by = "OpenAI GPT-5.6
  Thinking (AI-assisted source verification; owner-directed)".
- Decisions: 13 ACCEPT, 3 REVISE-ACCEPTED (c012, c014, c015), 0 REJECT.
- 6 sources: src_001, src_002, src_009, src_010, src_011, src_012.

## Checksums

Packet (canonical text hash, CRLF-normalized; this is the value in the frozen
experiment manifest packet_sha256.lhc and in CHECKSUMS.json):

- packet.json: `2572241cfacc4b641280347920252e34a9455f8c2c8fd9f743f59687b59ec191`
- excerpts.jsonl: `60c656d86643edcf6a49009222dbd41a560905e1e0826ebc5ac064c883803c98`

Source PDFs (raw binary SHA-256, via sha256sum; these match
SOURCE_INVENTORY.json). Note: the harness sha256File normalizes CRLF->LF for text
files and must NOT be used on these binaries; raw binary hashes are authoritative
for the PDFs:

- arxiv_0806.3414.pdf (src_001): `ab0bec65c077f2dc169c7dcb42bf7d07b06ef056332795e428db6a801bc6771a`
- arxiv_0806.3381.pdf (src_002): `939f8daa4ce9a6e93712ddb4f21a3118fdc618dc4c7fd5eaea0171a74429e365`
- arxiv_0808.1415.pdf (src_009): `0f41a2c1385df8e03d9d05bc23f011aeb03a888836cb02638875db5dfa88260a`
- arxiv_0808.4087.pdf (src_010): `5a2d40abae63463b0a26f0ab02d0a9c475e2164a21e718b989a169012651f6c1`
- arxiv_0807.3349.pdf (src_011): `0fb0bf7c6f44d99d4d8474d2197cfe92bde788fc9f5c582dad0ce48098959939`
- arxiv_0901.2948.pdf (src_012): `316145530378973905ef9ac9b2b63e2849a2a85f4a7972fbb698a2bc9d74cc81`

Experiment configuration (from MANIFEST.frozen.json):

- experiment_config_sha256: `a1dcb27034298aca4c51f433871d43b0f74f6903d7040fb004e6c096e19d1504`
- schema_sha256: `f9981fa46a469ef32f2dba90a8d1380fa78adbcacac7e082ee902ebe46faf6ee`
- pricing_sha256: `5ae8b181de98c4da5a9cf78be89c7db42705553077d7c4d5e61fa154da9a510b`

## Packet size

- packet.json: 42,430 bytes; packet token estimate ~10,606; excerpts token
  estimate ~6,341. Within the 10-15K token/packet target in 02_SOURCE_PACKET_PLAN.md.

## Freeze metadata

- Git commit at freeze: `56c24d3b06d7fc10766433c6d492e5c4982ceec6` (working tree clean;
  all packet artifacts live under .local-experiments/, git-excluded).
- Freeze timestamp (manifest frozen_at): 2026-07-16T03:42:58Z (UTC; 2026-07-15
  Pacific).
- Source versions: src_001 arXiv v2; src_002 arXiv v2; src_009 arXiv v3; src_010
  arXiv v1; src_011 arXiv v2; src_012 arXiv v3 (per SOURCE_INVENTORY.json).
- Koch DOI corrected to 10.1016/j.physletb.2009.01.003 (the .048 value was wrong).

## Unresolved scientific disagreements preserved in the packet

The packet deliberately does not resolve these; it represents them:

1. Whether Hawking radiation occurs/at what rate at the Planck scale (c003 vs c011;
   crux CX_002).
2. Whether the Plaga-Giddings-Mangano disagreement is assumption-level (c010) or a
   technical inconsistency (c012).
3. Whether metastable microcanonical black holes could accrete at the Eddington
   limit and evade the astrophysical bounds (c009/c011 vs c013).
4. Model dependence of the no-catastrophe result in the RS scenario (c015/c016).

## Graph-alignment concerns (recorded, not silently accepted)

Flagged in CLAIM_ALIGNMENT.csv as existing_graph_wording_too_strong:

- EC_007, NC_004, CX_004: the "accretion cross-section too small to grow to
  macroscopic size within any available timescale" phrasing is stronger than the
  verified src_002 language, which rules out the fast-accretion CLASS via dense-star
  observation rather than showing all accretion is negligibly slow.
- EC_002: "radiating away their mass before any macroscopic interaction could
  occur" is stronger than c001's "expected to decay ... before they reach the
  detector walls".
- EC_004 / NC_012: the "two independent lines" framing understates that c004 is a
  third (back-decay) line distinct from Hawking radiation and the astrophysical
  argument.

These are recommendations for the case graph (tracked repo data is NOT modified in
this phase); they are not applied here.

## What remains before primary-run scoring

- Four-item owner spot-check: lhc_c002, lhc_c009, lhc_c012, lhc_c015 (see
  reference_sets/lhc/OWNER_SPOT_CHECK.md).
- Publisher-page confirmation of the Koch DOI is advisable but non-blocking.
