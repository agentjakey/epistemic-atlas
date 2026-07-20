// Cost accounting. Projections only; actual spend is reconciled against the
// Anthropic console usage export (the receipt of record).

export function ratesFor(pricing, model, tier) {
  const m = pricing.models[model]
  if (!m) throw new Error(`no pricing entry for model "${model}"`)
  const r = m[tier] || m.standard
  if (!r) throw new Error(`no "${tier}" or "standard" rates for model "${model}"`)
  return r
}

export function priceCall({ pricing, model, tier, usage }) {
  const r = ratesFor(pricing, model, tier)
  const inTok = usage.input_tokens || 0
  const outTok = usage.output_tokens || 0
  const cacheRead = usage.cache_read_input_tokens || 0
  const cacheWrite = usage.cache_creation_input_tokens || 0
  const usd =
    (inTok / 1e6) * r.input_per_mtok_usd +
    (outTok / 1e6) * r.output_per_mtok_usd +
    (cacheRead / 1e6) * r.input_per_mtok_usd * (pricing.cache_read_input_multiplier ?? 0.1) +
    (cacheWrite / 1e6) * r.input_per_mtok_usd * (pricing.cache_write_input_multiplier ?? 1.25)
  return round4(usd)
}

// Worst-case projection for the interlock: full input estimate at the given
// tier plus the entire max_tokens allowance as output.
export function projectCallCost({ pricing, model, tier, estInputTokens, maxOutputTokens }) {
  return priceCall({
    pricing, model, tier,
    usage: { input_tokens: estInputTokens, output_tokens: maxOutputTokens },
  })
}

export function estimateTokensFromText(text) {
  // chars/4 heuristic for projections; live runs record real API usage.
  return Math.ceil(String(text).length / 4)
}

export function round4(n) {
  return Math.round(n * 10000) / 10000
}

export function spentFromCostLog(rows, { stage } = {}) {
  let total = 0
  for (const row of rows) {
    if (row.mode !== 'live') continue // mock rows carry $0 actual spend
    if (stage && row.budget_stage !== stage) continue
    total += Number(row.call_cost_usd || 0)
  }
  return round4(total)
}
