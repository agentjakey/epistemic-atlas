export type SourceType =
  | 'paper'
  | 'report'
  | 'article'
  | 'book'
  | 'statement'
  | 'legal_filing'
  | 'dataset'
  | 'preprint'
  | 'commentary'
  | 'other'

export type Credibility = 'high' | 'medium' | 'low' | 'unknown'

export type Position = 'pro' | 'con' | 'neutral' | 'conditional' | 'methodological'

export type DomainType = 'empirical' | 'theoretical' | 'methodological' | 'normative' | 'historical'

export type ConfidenceLevel = 'high' | 'medium' | 'low' | 'speculative'

export type RelationType =
  | 'supports'
  | 'attacks'
  | 'depends_on'
  | 'qualifies'
  | 'implies'
  | 'is_crux_of'

export type RelationStrength = 'strong' | 'moderate' | 'weak'

export type CruxStatus =
  | 'unresolved'
  | 'resolved_true'
  | 'resolved_false'
  | 'empirically_underdetermined'
  | 'theoretically_underdetermined'

export type MissingEvidenceType = 'empirical' | 'theoretical' | 'historical' | 'legal_institutional'

export type Priority = 'critical' | 'important' | 'helpful'

export type CaseStatus = 'open' | 'resolved' | 'partially_resolved' | 'contested' | 'archived'

export type DataStatus = 'verified' | 'sample' | 'partial'

export type FailureFlag =
  | 'motivated_reasoning'
  | 'cherry_picking'
  | 'overgeneralization'
  | 'false_dichotomy'
  | 'appeal_to_authority'
  | 'funding_bias'
  | 'methodological_weakness'
  | 'equivocation'
  | 'base_rate_neglect'
  | 'status_quo_bias'
  | 'asymmetric_skepticism'
  | 'publication_bias'
  | 'scope_creep'
  | 'moving_goalposts'
  | 'no_true_scotsman'
  | 'false_precision'
  | 'suppressed_evidence'

export interface Source {
  id: string
  title: string
  type: SourceType
  provenance: {
    author?: string | string[] | null
    institution?: string | null
    date: string
    venue?: string | null
    url?: string | null
    doi?: string | null
    retrieved?: string | null
  }
  credibility: Credibility
  conflict_of_interest?: string | null
  notes?: string | null
}

export interface Claim {
  id: string
  raw: string
  normalized: string
  source_id: string
  position: Position
  domain_type: DomainType
  confidence: {
    level: ConfidenceLevel
    notes?: string | null
  }
  tags: string[]
  failure_flags: FailureFlag[]
  data_status?: DataStatus | null
}

export interface Relation {
  id: string
  from_claim_id: string
  to_claim_id: string
  type: RelationType
  strength: RelationStrength
  notes?: string
}

export interface Crux {
  id: string
  statement: string
  description: string
  dependent_claim_ids: string[]
  status: CruxStatus
  resolution_notes?: string | null
}



export interface MissingEvidence {
  id: string
  description: string
  type: MissingEvidenceType
  would_affect_ids: string[]
  priority: Priority
}

export interface Assessment {
  epistemic_status: string
  resolved: boolean
  resolution_summary?: string | null
  well_supported_claim_ids: string[]
  contested_claim_ids: string[]
  failure_modes_observed: string[]
  notes?: string
}

export interface CaseStudy {
  id: string
  title: string
  domain: string
  subdomain?: string
  status: CaseStatus
  data_status: DataStatus
  summary: string
  created: string
  updated: string
  tags: string[]
  sources: Source[]
  claims: Claim[]
  relations: Relation[]
  cruxes: Crux[]
  missing_evidence: MissingEvidence[]
  assessment: Assessment
}
