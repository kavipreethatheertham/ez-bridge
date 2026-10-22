import { useEffect } from 'react'
import LoansListSection from './components/loans/LoansListSection'
import SheetPage from './components/sheet/SheetPage'
import { useRoute } from './hooks/useRoute'

/**
 * Two pages, told apart by the address after the # (see src/lib/route.js):
 *   the main page (#/)      only the Loan List, nothing to type in
 *   the sheet page          stats, Loan, partners, fees, consultancy and the footer note, all editable:
 *                           #/new for a new loan, #/loans/LN0025 for a saved loan (View Details)
 */
export default function App() {
  const route = useRoute()

  // A page change starts at the top.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [route.name, route.loanNo])

  if (route.name === 'home') {
    return (
      <main className="page">
        <LoansListSection />
      </main>
    )
  }

  // A new key gives every loan (and New loan) its own fresh sheet.
  return <SheetPage key={route.loanNo ?? 'new'} loanNo={route.loanNo} />
}
