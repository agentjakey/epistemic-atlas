import CaseStudyView from '@/components/CaseStudyView'
import sourcesData from '@/data/eggs/sources.json'
import claimsData from '@/data/eggs/claims.json'
import graphData from '@/data/eggs/graph.json'
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
  title: 'Dietary Eggs and CVD Risk -- Epistemic Atlas',
}

export default function EggsPage() {
  return (
    <CaseStudyView
      title="Dietary Egg Consumption and Cardiovascular Disease Risk"
      domain="Nutrition science"
      subdomain="Dietary cholesterol and lipid metabolism"
      status="open"
      dataStatus="partial"
      summary="A decades-long dispute over whether regular egg consumption increases cardiovascular disease risk. High-quality observational studies contradict each other. Regulatory guidance shifted in 2015 without clear scientific resolution. Industry funding is a documented confound in a portion of the literature. The central cruxes -- whether dietary cholesterol from eggs independently raises CVD risk, and whether the population heterogeneity (especially diabetic subgroups) is biologically meaningful -- remain empirically underdetermined."
      tags={['nutrition', 'cardiovascular disease', 'dietary guidelines', 'funding bias', 'observational epidemiology', 'population heterogeneity', 'regulatory history']}
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
