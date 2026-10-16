import { toNumber, isSameAmount } from './money'
import { PEOPLE, PERSON_ORDER } from '../constants/people'

/** Interest amount = amount x rate / 100 */
export const calcInterest = (amount, rate) => (toNumber(amount) * toNumber(rate)) / 100

/** Name shown for a person id. Empty id => "Unassigned". */
export const nameOf = (id) =>
  PEOPLE.find((p) => p.id === id)?.name ?? 'Unassigned'

/** Everything the Loan + Sharing partners sections need to display. */
export function summarizeLoan({ principal, loanRate, partners }) {
  const principalNum = toNumber(principal)
  const loanInterest = calcInterest(principal, loanRate)
  const partnerTotal = partners.reduce((sum, p) => sum + toNumber(p.amount), 0)
  const partnerInterest = partners.reduce(
    (sum, p) => sum + calcInterest(p.amount, p.rate),
    0,
  )

  return {
    principal: principalNum,
    loanInterest,
    partnerTotal,
    partnerInterest,
    principalMatched: principalNum > 0 && isSameAmount(partnerTotal, principalNum),
    overAllocated: partnerTotal > principalNum,
  }
}

/**
 * Payout by person.
 * Each person = sum of everything they earn on this annexure.
 * Today only "sharing interest" exists. When Case fees, Consultancy and
 * Eazee Bridge are built, add their numbers to the same bucket
 * (see the commented lines) and add a column in PayoutSection.
 */
export function buildPayout({ partners /* , fees, consults, splits */ }) {
  const buckets = new Map()

  const bucketFor = (personId) => {
    if (!personId) return null // rows with no person selected are ignored
    if (!buckets.has(personId)) buckets.set(personId, { sharing: 0 })
    return buckets.get(personId)
  }

  partners.forEach((p) => {
    const bucket = bucketFor(p.person)
    if (bucket) bucket.sharing += calcInterest(p.amount, p.rate)
  })

  // fees.forEach((f) => { const b = bucketFor(f.person); if (b) b.fees += toNumber(f.amount) })
  // consults.forEach(...)  splits.forEach(...)

  return [...buckets.entries()]
    .sort(([a], [b]) => orderIndex(a) - orderIndex(b))
    .map(([personId, b]) => ({
      personId,
      name: nameOf(personId),
      sharing: b.sharing,
      total: b.sharing,
    }))
}

const orderIndex = (id) => {
  const i = PERSON_ORDER.indexOf(id)
  return i === -1 ? 99 : i
}
