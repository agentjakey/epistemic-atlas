import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Showcase | Epistemic Atlas',
}

export default function ShowcasePage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">

      {/* two-column hero */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12 pb-12 border-b border-page-border">

        {/* left column */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-ink-faint mb-5">
            FLF Epistemic Case Study Competition
          </p>
          <h1 className="text-4xl font-bold text-ink mb-3 leading-tight">
            Epistemic Atlas
          </h1>
          <p className="text-xl text-accent font-light mb-6">
            Turning messy disputes into inspectable claim graphs.
          </p>
          <p className="text-sm text-ink-light leading-relaxed mb-10 max-w-lg">
            A schema, methodology, and static prototype for converting real-world epistemic
            disputes into structured, queryable knowledge bases. Every source, claim,
            relation, crux, and failure mode is typed, linked, and traceable.
          </p>

          {/* pipeline flow */}
          <div className="mb-8">
            <p className="text-xs section-heading">Six-Stage Pipeline</p>
            <div className="flex items-center flex-wrap gap-y-2">
              {[
                'Sources',
                'Extracted Claims',
                'Norm. Claims',
                'Relations',
                'Cruxes',
                'Assessment',
              ].map((stage, i, arr) => (
                <div key={stage} className="flex items-center">
                  <span className="text-xs font-mono bg-page-off border border-page-border px-2 py-1 text-ink-faint whitespace-nowrap">
                    {stage}
                  </span>
                  {i < arr.length - 1 && (
                    <span className="text-xs text-ink-faint px-1.5">›</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* case cards */}
          <div className="space-y-3">
            {/* LHC */}
            <div className="border border-page-border p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="text-xs font-mono text-ink-faint">LHC-2008</span>
                  <h3 className="text-sm font-semibold text-ink">LHC Black-Hole Risk</h3>
                </div>
                <span className="badge badge-status-resolved">Largely resolved</span>
              </div>
              <p className="text-xs text-ink-light leading-relaxed mb-3">
                2008 dispute over whether the LHC could produce microscopic black holes
                capable of catastrophic harm. Two independent safety arguments with
                different epistemic strengths. Primary safety report carries
                correlated-evidence flags from shared authorship.
              </p>
              <div className="flex gap-4 text-xs text-ink-faint font-mono">
                <span>12 norm. claims</span>
                <span>5 cruxes</span>
                <span>8 flags</span>
              </div>
            </div>

            {/* Eggs */}
            <div className="border border-page-border p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="text-xs font-mono text-ink-faint">EGGS</span>
                  <h3 className="text-sm font-semibold text-ink">Dietary Eggs and CVD Risk</h3>
                </div>
                <span className="badge badge-status-open">Open</span>
              </div>
              <p className="text-xs text-ink-light leading-relaxed mb-3">
                Decades-long nutrition science dispute over whether egg consumption raises
                cardiovascular disease risk. All five cruxes are unresolved or empirically
                underdetermined. Funding pressure and population heterogeneity flags prominent.
              </p>
              <div className="flex gap-4 text-xs text-ink-faint font-mono">
                <span>12 norm. claims</span>
                <span>5 cruxes</span>
                <span>10 flags</span>
              </div>
            </div>

            {/* Schema */}
            <div className="border border-page-border p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="text-xs font-mono text-ink-faint">SCHEMA-V2</span>
                  <h3 className="text-sm font-semibold text-ink">Reusable Schema</h3>
                </div>
                <span className="badge badge-status-underdetermined">v2</span>
              </div>
              <p className="text-xs text-ink-light leading-relaxed mb-3">
                JSON Schema Draft 2020-12. JSON export, typed audit notes, explicit update
                conditions. Case-agnostic: the same specification covers both worked examples
                without extensions or case-specific fields.
              </p>
              <div className="flex gap-4 text-xs text-ink-faint font-mono">
                <span>9 object types</span>
                <span>10 relation types</span>
                <span>12 failure modes</span>
              </div>
            </div>
          </div>
        </div>

        {/* right column: mini claim graph */}
        <div className="flex flex-col">
          <p className="text-xs section-heading">Claim Graph Preview (LHC case)</p>
          <div className="flex-1 border border-page-border bg-page-off p-5 flex items-center justify-center">
            <svg
              viewBox="0 0 460 300"
              className="w-full max-w-lg"
              aria-label="Simplified LHC claim graph"
            >
              <defs>
                <marker
                  id="arrowBlue"
                  markerWidth="7"
                  markerHeight="5"
                  refX="7"
                  refY="2.5"
                  orient="auto"
                >
                  <polygon points="0 0,7 2.5,0 5" fill="#1e40af" />
                </marker>
                <marker
                  id="arrowGray"
                  markerWidth="7"
                  markerHeight="5"
                  refX="7"
                  refY="2.5"
                  orient="auto"
                >
                  <polygon points="0 0,7 2.5,0 5" fill="#94a3b8" />
                </marker>
                <marker
                  id="arrowGreen"
                  markerWidth="7"
                  markerHeight="5"
                  refX="7"
                  refY="2.5"
                  orient="auto"
                >
                  <polygon points="0 0,7 2.5,0 5" fill="#15803d" />
                </marker>
              </defs>

              {/* NC_004: no flags, green */}
              <rect x="10" y="20" width="175" height="62" rx="2" fill="#f0fdf4" stroke="#86efac" strokeWidth="1.5" />
              <text x="20" y="36" fontSize="8" fontFamily="monospace" fill="#94a3b8">NC_004</text>
              <text x="20" y="52" fontSize="10.5" fontWeight="600" fill="#0f172a">Giddings-Mangano</text>
              <text x="20" y="65" fontSize="9.5" fill="#334155">Accretion safety argument</text>
              <text x="20" y="76" fontSize="8" fontFamily="monospace" fill="#15803d">flags: none</text>

              {/* NC_003: 2 flags, amber */}
              <rect x="10" y="125" width="175" height="62" rx="2" fill="#fffbeb" stroke="#fcd34d" strokeWidth="1.5" />
              <text x="20" y="141" fontSize="8" fontFamily="monospace" fill="#94a3b8">NC_003</text>
              <text x="20" y="157" fontSize="10.5" fontWeight="600" fill="#0f172a">Hawking Radiation</text>
              <text x="20" y="170" fontSize="9.5" fill="#334155">Evaporation argument</text>
              <text x="20" y="181" fontSize="8" fontFamily="monospace" fill="#b45309">flags: 2 (direct_evidence_absent...)</text>

              {/* NC_012: 2 flags, blue */}
              <rect x="225" y="65" width="175" height="62" rx="2" fill="#eff6ff" stroke="#93c5fd" strokeWidth="1.5" />
              <text x="235" y="81" fontSize="8" fontFamily="monospace" fill="#94a3b8">NC_012</text>
              <text x="235" y="97" fontSize="10.5" fontWeight="600" fill="#0f172a">Safety Conclusion</text>
              <text x="235" y="110" fontSize="9.5" fill="#334155">LHC poses no catastrophic risk</text>
              <text x="235" y="121" fontSize="8" fontFamily="monospace" fill="#c2410c">flags: 2 (correlated_evidence...)</text>

              {/* Assessment */}
              <rect x="225" y="210" width="175" height="48" rx="2" fill="#f0fdf4" stroke="#86efac" strokeWidth="1.5" />
              <text x="235" y="228" fontSize="8" fontFamily="monospace" fill="#94a3b8">assessment</text>
              <text x="235" y="245" fontSize="11" fontWeight="700" fill="#15803d">status: settled</text>
              <text x="235" y="253" fontSize="8" fontFamily="monospace" fill="#334155">weak_links: NC_003, NC_005</text>

              {/* CX_002 crux box */}
              <rect x="10" y="230" width="175" height="48" rx="2" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />
              <text x="20" y="248" fontSize="8" fontFamily="monospace" fill="#94a3b8">CX_002 (crux)</text>
              <text x="20" y="263" fontSize="9.5" fill="#334155">Hawking radiation at Planck</text>
              <text x="20" y="274" fontSize="8" fontFamily="monospace" fill="#475569">status: theoretically_underdetermined</text>

              {/* Arrow: NC_004 → NC_012 (supports, strong) */}
              <line
                x1="185"
                y1="60"
                x2="223"
                y2="90"
                stroke="#1e40af"
                strokeWidth="1.5"
                markerEnd="url(#arrowBlue)"
              />
              <text x="188" y="75" fontSize="8" fill="#1e40af">supports (strong)</text>

              {/* Arrow: NC_003 → NC_012 (supports, moderate) */}
              <line
                x1="185"
                y1="150"
                x2="223"
                y2="120"
                stroke="#94a3b8"
                strokeWidth="1.5"
                markerEnd="url(#arrowGray)"
              />
              <text x="188" y="142" fontSize="8" fill="#94a3b8">supports (moderate)</text>

              {/* Arrow: NC_012 → Assessment (settles) */}
              <line
                x1="312"
                y1="127"
                x2="312"
                y2="208"
                stroke="#15803d"
                strokeWidth="1.5"
                markerEnd="url(#arrowGreen)"
              />
              <text x="316" y="172" fontSize="8" fill="#15803d">settles</text>

              {/* Arrow: NC_003 → CX_002 (depends_on) */}
              <line
                x1="100"
                y1="187"
                x2="100"
                y2="228"
                stroke="#e2e8f0"
                strokeWidth="1.5"
                markerEnd="url(#arrowGray)"
              />
              <text x="103" y="212" fontSize="8" fill="#94a3b8">depends_on</text>
            </svg>
          </div>
          <p className="text-xs text-ink-faint mt-3 leading-relaxed">
            Green border: no failure mode flags. Amber: flags present. Blue: overall
            safety conclusion with two structural flags. Arrows are typed directed edges
            (supports, depends_on). Assessment lists weak links explicitly.
          </p>
        </div>
      </div>

      {/* key properties strip */}
      <div className="grid grid-cols-3 gap-6 mb-12 pb-12 border-b border-page-border">
        <div>
          <p className="text-xs section-heading">Claim-Level Granularity</p>
          <p className="text-sm text-ink-light leading-relaxed">
            Failure mode flags attach to individual claims and sources, not to the case as a
            whole. This makes them queryable across cases and enables pattern recognition
            across structurally different disputes.
          </p>
        </div>
        <div>
          <p className="text-xs section-heading">Explicit Update Conditions</p>
          <p className="text-sm text-ink-light leading-relaxed">
            Each assessment specifies concrete scenarios that would change the conclusion:
            named study designs, specific crux resolutions, identified weak links. Not
            "more research needed" but "if X is confirmed, NC_003 is strengthened decisively."
          </p>
        </div>
        <div>
          <p className="text-xs section-heading">Provenance at Every Layer</p>
          <p className="text-sm text-ink-light leading-relaxed">
            Every normalized claim traces to its extracted claim, which traces to its
            source. Every relation is justified. Every flag is attached to the specific
            object that triggered it. The audit trail is complete and inspectable.
          </p>
        </div>
      </div>

      {/* disclaimer */}
      <p className="text-xs text-ink-faint border border-amber-200 bg-amber-50 px-4 py-3 max-w-4xl leading-relaxed">
        Current case data is partially verified and intended to demonstrate the workflow,
        not to provide final scientific or medical authority. All extracted claims carry
        the needs_source_verification flag and have not been checked against primary
        source documents.
      </p>
    </div>
  )
}
