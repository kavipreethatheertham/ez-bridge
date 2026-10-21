/**
 * A tiny "a loan was saved" signal between Save loan and the Loans list.
 * loanService calls announceLoansChanged() after a save; the list listens and loads again.
 */
const listeners = new Set()

/** Calls `listener` every time a loan was saved. Returns the function that stops listening. */
export const onLoansChanged = (listener) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export const announceLoansChanged = () => {
  listeners.forEach((listener) => listener())
}
