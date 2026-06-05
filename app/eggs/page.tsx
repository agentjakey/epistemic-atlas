import CaseStudyView from '@/components/CaseStudyView'
import sourcesData from '@/data/eggs/sources.json'
import claimsData from '@/data/eggs/claims.json'
import graphData from '@/data/eggs/graph.json'
import type { Source, Claim, Relation, Crux, MissingEvidence, Assessment } from '@/lib/types'

export const metadata = {
  title: 'Dietary Eggs and CVD Risk -- Epistemic Atlas',
}

export default function EggsPage() {
  return (
    <CaseStudyView
      title="Dietary Egg Consumption and Cardiovascular Disease Risk"
      domain="Nutrition science"
      subdomain="Dietary cholesterol and lipid metabolism"
      status="open"
      data_status="partial"
      summary="A decades-long dispute over whether regular egg consumption increases cardiovascular disease risk. High-quality observational studies contradict each other. Regulatory guidance shifted in 2015 without clear scientific resolution. Industry funding is a documented confound in a meaningful portion of the favorable-to-eggs literature. The central crux -- whether dietary cholesterol from eggs independently raises CVD risk, controlling for saturated fat -- remains empirically underdetermined."
      tags={['nutrition', 'cardiovascular disease', 'dietary guidelines', 'funding bias', 'observational epidemiology', 'regulatory history']}
      sources={sourcesData.sources as unknown as Source[]}
      claims={claimsData.claims as unknown as Claim[]}
      relations={graphData.relations as unknown as Relation[]}
      cruxes={graphData.cruxes as unknown as Crux[]}
      missing_evidence={graphData.missing_evidence as unknown as MissingEvidence[]}
      assessment={graphData.assessment as unknown as Assessment}
    />
  )
}
