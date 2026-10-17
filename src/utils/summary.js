import { calcInterest } from './calculations'
import { formatINR, isSameAmount, toNumber } from './money'

/** 15000000 -> "₹1.50 cr", 150000 -> "₹1.50 L". Smaller amounts use the normal rupee format. */
export const formatCompact = (n) => {
  const abs = Math.abs(n)
  const sign = n < 0 ? '-' : ''
  if (abs >= 10000000) return `${sign}₹${(abs / 10000000).toFixed(2)} cr`
  if (abs >= 100000) return `${sign}₹${(abs / 100000).toFixed(2)} L`
  return formatINR(n)
}

/** Eazee Bridge: a fixed pool that is split between people. The split must add up to the pool. */
export function summarizeBridge({ bridgeTotal, splits }) {
  const pool = toNumber(bridgeTotal)
  const splitTotal = splits.reduce((sum, s) => sum + toNumber(s.amount), 0)
  return { pool, splitTotal, matched: pool > 0 && isSameAmount(splitTotal, pool) }
}

/** What the consultants earn on this case: base amount x rate, added up over every consultant row. */
export const totalConsultancy = (consults) =>
  consults.reduce((sum, c) => sum + calcInterest(c.amount, c.rate), 0)

/** The four tiles at the top of the sheet. `tone` is '' (plain), 'ok' (green) or 'warn' (amber). */
export function buildStats({ loanRate }, loanSummary, bridge) {
  const { principal, loanInterest, partnerTotal, partnerInterest, principalMatched } = loanSummary
  const sharedPct = principal > 0 ? `${Math.round((partnerTotal / principal) * 100)}%` : '—'

  return [
    {
      id: 'loan-interest',
      value: formatCompact(loanInterest),
      label: `Loan interest · ${toNumber(loanRate) || 0}%`,
      tone: '',
    },
    {
      id: 'principal-shared',
      value: sharedPct,
      label: 'Principal shared',
      tone: principalMatched ? 'ok' : 'warn',
    },
    {
      id: 'sharing-interest',
      value: formatCompact(partnerInterest),
      label: 'Sharing interest',
      tone: '',
    },
    {
      id: 'bridge-split',
      value: bridge.matched ? 'Matched' : formatCompact(bridge.splitTotal - bridge.pool),
      label: 'Bridge split',
      tone: bridge.matched ? 'ok' : 'warn',
    },
  ]
}
