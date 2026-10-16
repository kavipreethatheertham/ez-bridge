import { BAR_COLORS } from '../../constants/people'
import { nameOf } from '../../utils/calculations'
import { formatINR, toNumber } from '../../utils/money'

/** Coloured bar showing how much of the principal is shared, plus a legend per partner. */
export default function AllocationBar({ partners, loanSummary }) {
  const { principal, partnerTotal, principalMatched, overAllocated } = loanSummary

  const funded = partners.filter((p) => toNumber(p.amount) > 0)
  if (funded.length === 0) return null

  const status = principalMatched ? 'Fully shared' : overAllocated ? 'Over the principal' : 'Part shared'
  const barTotal = Math.max(principal, partnerTotal, 1) // never divide by 0

  return (
    <div className="allocation">
      <div className="allocation__summary">
        <span>{status}</span>
        <span>
          {formatINR(partnerTotal)} of {formatINR(principal)}
        </span>
      </div>

      <div className="allocation__bar">
        {funded.map((p, i) => (
          <i
            key={p.id}
            style={{
              width: `${(toNumber(p.amount) / barTotal) * 100}%`,
              background: BAR_COLORS[i % BAR_COLORS.length],
            }}
          />
        ))}
      </div>

      <div className="allocation__legend">
        {funded.map((p, i) => (
          <span key={p.id}>
            <i
              className="allocation__swatch"
              style={{ background: BAR_COLORS[i % BAR_COLORS.length] }}
            />
            {nameOf(p.person)} · {formatINR(toNumber(p.amount))}
          </span>
        ))}
      </div>
    </div>
  )
}
