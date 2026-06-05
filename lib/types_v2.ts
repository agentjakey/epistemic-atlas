// TypeScript types for Epistemic Atlas Schema v2
// Mirrors schema/epistemic-atlas.schema.json

export type CaseStatus = 'open' | 'resolved' | 'partially_resolved' | 'contested' | 'archived'

export type DataStatus = 'verified' | 'partial' | 'sample'

export type SourceType =
  | 'paper' | 'report' | 'article' | 'book' | 'statement'
  | 'legal_filing' | 'dataset' | 'preprint' | 'commentary' | 'other'

export type Credibility = 'high' | 'medium' | 'low' | 'unknown'

export type DomainType = 'empirical' | 'theoretical' | 'methodological' | 'normative' | 'historical'

export type Position = 'pro' | 'con' | 'neutral' | 'conditional' | 'methodological'

export type ConfidenceLevel = 'high' | 'medium' | 'low' | 'speculative'

export type RelationType =
  | 'supports'
  | 'attacks'
  | 'depends_on'
  | 'reframes'
  | 'narrows'
  | 'generalizes'
  | 'duplicates'
  | 'conflicts_with'
  | 'evidence_for'
  | 'evidence_against'

export type RelationStrength = 'strong' | 'moderate' | 'weak'

export type CruxStatus =
  | 'unresolved'
  | 'resolved_true'
  | 'resolved_false'
  | 'empirically_underdetermined'
  | 'theoretically_underdetermined'

export type FailureModeType =
  | 'correlated_evidence_treated_as_independent'
  | 'rhetorical_weight_exceeds_evidence'
  | 'hidden_assumption'
  | 'source_incentive_pressure'
  | 'proxy_measure_problem'
  | 'population_heterogeneity'
  | 'temporal_drift'
  | 'closed_case_overconfidence'
  | 'vague_question'
  | 'analogy_dependency'
  | 'direct_evidence_absent'
  | 'expert_consensus_without_dependency_map'

export type FlagAppliesTo = 'normalized_claim' | 'source' | 'relation'

export type Severity = 'critical' | 'significant' | 'minor'

export type AssessmentStatus = 'settled' | 'unsettled' | 'partially_settled'

export type UpdateDirection = 'strengthen' | 'weaken' | 'resolve'

export type UpdateMagnitude = 'decisive' | 'significant' | 'minor'

export type MissingEvidenceType = 'empirical' | 'theoretical' | 'historical' | 'legal_institutional'

export type Feasibility = 'feasible' | 'infeasible' | 'unknown'

export type AuditNoteType =
  | 'normalization_concern'
  | 'source_gap'
  | 'asymmetric_flagging'
  | 'relation_error'
  | 'crux_quality'
  | 'missing_evidence_framing'
  | 'assessment_inconsistency'
  | 'verification_needed'
  | 'llm_artifact'
  | 'other'

export type AuditNoteStatus = 'open' | 'resolved' | 'dismissed'

// ------------------------------------------------------------------

export interface Provenance {
  author?: string | string[] | null
  institution?: string | null
  date: string
  venue?: string | null
  url?: string | null
  doi?: string | null
  retrieved?: string | null
  page_range?: string | null
}

export interface Source {
  id: string
  title: string
  type: SourceType
  provenance: Provenance
  credibility: Credibility
  conflict_of_interest?: string | null
  retracted?: boolean
  needs_source_verification?: boolean
  notes?: string | null
}

export interface ExtractedClaim {
  id: string
  source_id: string
  raw_text: string
  location?: {
    page?: string | null
    section?: string | null
    paragraph?: string | null
  }
  speaker?: string | null
  extraction_notes?: string | null
  needs_source_verification?: boolean
}

export interface Confidence {
  level: ConfidenceLevel
  notes?: string | null
}

export interface NormalizedClaim {
  id: string
  extracted_claim_ids: string[]
  normalized_text: string
  domain_type: DomainType
  scope?: string | null
  quantification?: string | null
  hedges?: string[]
  position: Position
  confidence: Confidence
  failure_mode_flag_ids?: string[]
  tags?: string[]
  needs_source_verification?: boolean
}

export interface Relation {
  id: string
  from_id: string
  to_id: string
  type: RelationType
  strength: RelationStrength
  notes?: string | null
  needs_source_verification?: boolean
}

export interface Crux {
  id: string
  statement: string
  description: string
  dependent_normalized_claim_ids: string[]
  status: CruxStatus
  resolution_notes?: string | null
  resolution_source_ids?: string[]
}

export interface FailureModeFlag {
  id: string
  type: FailureModeType
  description: string
  applies_to_id: string
  applies_to_type: FlagAppliesTo
  severity: Severity
  affects_conclusion?: boolean
  notes?: string | null
}

export interface UpdateScenario {
  scenario: string
  would_affect_ids: string[]
  direction: UpdateDirection
  magnitude: UpdateMagnitude
}

export interface Assessment {
  status: AssessmentStatus
  settled_direction?: string | null
  epistemic_status_summary?: string | null
  key_crux_ids: string[]
  weak_link_ids: string[]
  what_would_update: UpdateScenario[]
  well_supported_claim_ids?: string[]
  contested_claim_ids?: string[]
  dominant_failure_modes?: string[]
  notes?: string | null
}

export interface MissingEvidence {
  id: string
  description: string
  type: MissingEvidenceType
  would_affect_ids: string[]
  priority: 'critical' | 'important' | 'helpful'
  reason_absent?: string | null
  feasibility?: Feasibility | null
}

export interface AuditNote {
  id: string
  type: AuditNoteType
  description: string
  applies_to_ids: string[]
  severity: Severity
  author?: string | null
  date?: string | null
  status: AuditNoteStatus
  resolution?: string | null
}

export interface CaseV2 {
  id: string
  schema_version: '2'
  title: string
  domain: string
  subdomain?: string
  status: CaseStatus
  data_status: DataStatus
  summary: string
  created: string
  updated: string
  tags?: string[]
  sources: Source[]
  extracted_claims: ExtractedClaim[]
  normalized_claims: NormalizedClaim[]
  relations: Relation[]
  cruxes: Crux[]
  failure_mode_flags: FailureModeFlag[]
  assessment: Assessment
  missing_evidence: MissingEvidence[]
  audit_notes?: AuditNote[]
}

// Lookup helpers for building views
export function buildSourceMap(sources: Source[]): Record<string, Source> {
  return Object.fromEntries(sources.map((s) => [s.id, s]))
}

export function buildClaimMap(claims: NormalizedClaim[]): Record<string, NormalizedClaim> {
  return Object.fromEntries(claims.map((c) => [c.id, c]))
}

export function buildExtractedClaimMap(claims: ExtractedClaim[]): Record<string, ExtractedClaim> {
  return Object.fromEntries(claims.map((c) => [c.id, c]))
}

export function buildFlagMap(flags: FailureModeFlag[]): Record<string, FailureModeFlag> {
  return Object.fromEntries(flags.map((f) => [f.id, f]))
}

export function flagsForClaim(
  claim: NormalizedClaim,
  flagMap: Record<string, FailureModeFlag>
): FailureModeFlag[] {
  return (claim.failure_mode_flag_ids ?? []).map((id) => flagMap[id]).filter(Boolean)
}

export function sourceForExtracted(
  ec: ExtractedClaim,
  sourceMap: Record<string, Source>
): Source | undefined {
  return sourceMap[ec.source_id]
}

export function sourcesForNormalized(
  nc: NormalizedClaim,
  extractedMap: Record<string, ExtractedClaim>,
  sourceMap: Record<string, Source>
): Source[] {
  return nc.extracted_claim_ids
    .map((ecId) => extractedMap[ecId])
    .filter(Boolean)
    .map((ec) => sourceMap[ec.source_id])
    .filter(Boolean)
}
