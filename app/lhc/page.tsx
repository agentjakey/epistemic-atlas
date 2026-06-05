import CaseStudyView from '@/components/CaseStudyView'
import sourcesData from '@/data/lhc/sources.json'
import claimsData from '@/data/lhc/claims.json'
import graphData from '@/data/lhc/graph.json'
import type {
  Source,
  ExtractedClaim,
  NormalizedClaim,
  Relation,
  Crux,
  FailureModeFlag,
  Assessment,
  MissingEvidence,
} from '@/lib/types_v2'

export const metadata = {
  title: 'LHC Black Holes -- Epistemic Atlas',
}

export default function LHCPage() {
  return (
    <CaseStudyView
      title="LHC Black Holes and Catastrophic Risk"
      domain="Particle physics"
      subdomain="Accelerator safety and quantum gravity"
      status="resolved"
      dataStatus="partial"
      summary="In 2008, concerns emerged that the Large Hadron Collider could produce microscopic black holes capable of destroying Earth. CERN commissioned a formal safety assessment, reviewed independently. A federal legal challenge was filed and dismissed. The dispute involves contested theoretical physics premises, institutional risk communication, and a case where scientific consensus was not effectively transmitted to the public."
      tags={['particle physics', 'risk assessment', 'Hawking radiation', 'extra dimensions', 'public communication', 'legal challenge']}
      sources={sourcesData.sources as unknown as Source[]}
      extractedClaims={(claimsData as any).extracted_claims as ExtractedClaim[]}
      normalizedClaims={(claimsData as any).normalized_claims as NormalizedClaim[]}
      relations={(graphData as any).relations as Relation[]}
      cruxes={(graphData as any).cruxes as Crux[]}
      failureModeFlags={(graphData as any).failure_mode_flags as FailureModeFlag[]}
      assessment={(graphData as any).assessment as Assessment}
      missingEvidence={(graphData as any).missing_evidence as MissingEvidence[]}
    />
  )
}
