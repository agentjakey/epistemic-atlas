import CaseStudyView from '@/components/CaseStudyView'
import sourcesData from '@/data/lhc/sources.json'
import claimsData from '@/data/lhc/claims.json'
import graphData from '@/data/lhc/graph.json'
import type { Source, Claim, Relation, Crux, MissingEvidence, Assessment } from '@/lib/types'

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
      data_status="partial"
      summary="In 2008, concerns emerged that the Large Hadron Collider could produce microscopic black holes capable of destroying Earth. CERN commissioned a formal safety assessment, reviewed independently. A federal legal challenge was filed and dismissed. The dispute involves contested theoretical physics premises, institutional risk communication, and a case where scientific consensus was not effectively transmitted to the public."
      tags={['particle physics', 'risk assessment', 'Hawking radiation', 'extra dimensions', 'public communication', 'legal challenge']}
      sources={sourcesData.sources as unknown as Source[]}
      claims={claimsData.claims as unknown as Claim[]}
      relations={graphData.relations as unknown as Relation[]}
      cruxes={graphData.cruxes as unknown as Crux[]}
      missing_evidence={graphData.missing_evidence as unknown as MissingEvidence[]}
      assessment={graphData.assessment as unknown as Assessment}
    />
  )
}
