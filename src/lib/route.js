/**
 * The pages of the app and their addresses. The address lives after the # in the browser bar
 * (for example http://localhost:5173/#/loans/LN0025), so a refresh, the browser Back button and a
 * copied link all keep working without any server set-up.
 *
 *   no address, or #/    the create page, with the Loans list below the Loan section
 *   #/loans/LN0025       the details of one saved loan
 */
export const homePath = () => '#/'
export const detailsPath = (loanNo) => `#/loans/${encodeURIComponent(loanNo)}`

/** Turns the browser's hash into { name: 'home' } or { name: 'details', loanNo }. Anything else is home. */
export function parseRoute(hash) {
  const match = /^#\/?loans\/(.+?)\/*$/.exec(String(hash || ''))
  if (match) {
    try {
      return { name: 'details', loanNo: decodeURIComponent(match[1]) }
    } catch {
      return { name: 'home' } // a broken % sequence in the address
    }
  }
  return { name: 'home' }
}

/** Opens a page, e.g. goTo(homePath()). */
export const goTo = (path) => {
  window.location.hash = path
}
