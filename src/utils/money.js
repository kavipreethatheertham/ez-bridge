/**
 * Money helpers.
 * Inputs in the form are plain strings (what the user types), so we always
 * convert them to numbers before doing any maths.
 */

/** "50,00,000" or "5000000" -> 5000000. Anything invalid -> 0. */
export const toNumber = (value) => {
  const n = Number(String(value ?? '').replace(/[^0-9.-]/g, ''))
  return Number.isFinite(n) ? n : 0
}

/** 5000000 -> "₹50,00,000" (Indian digit grouping). */
export const formatINR = (n) =>
  (n < 0 ? '-' : '') + '₹' + Math.abs(Math.round(n)).toLocaleString('en-IN')

/** Two amounts are "the same" when they match after rounding to whole rupees. */
export const isSameAmount = (a, b) => Math.round(a) === Math.round(b)
