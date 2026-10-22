import StatusBanner from '../layout/StatusBanner'
import SaveNotice from '../layout/SaveNotice'
import SheetFooter from '../layout/SheetFooter'
import StatsRow from '../stats/StatsRow'
import LoanSection from '../loan/LoanSection'
import SharingPartnersSection from '../sharing/SharingPartnersSection'
import CaseFeesSection from '../fees/CaseFeesSection'
import ConsultancySection from '../consultancy/ConsultancySection'
import { useAnnexure } from '../../hooks/useAnnexure'
import { useLoanDetails } from '../../hooks/useLoans'
import { goTo, homePath } from '../../lib/route'
import './SheetPage.css'

const BackButton = () => (
  <button type="button" onClick={() => goTo(homePath())}>
    Back to list
  </button>
)

/**
 * The whole sheet, every box editable (it is the old create page). `savedLoan` fills the Loan section
 * with a loan read from the database; without it the sheet starts with the sample loan.
 */
function Sheet({ savedLoan }) {
  const { form, isReady, saveState, loanSummary, stats, consultTotal, actions } =
    useAnnexure(savedLoan)

  return (
    <main className="page">
      <div className="sheet-nav">
        <BackButton />
      </div>

      <SaveNotice state={saveState} />
      {isReady && <StatusBanner loanNo={form.loanNo} loanSummary={loanSummary} />}

      <StatsRow stats={stats} />

      <LoanSection
        form={form}
        loanSummary={loanSummary}
        onChange={actions.updateLoanField}
        onReset={actions.reset}
        onSave={actions.save}
      />

      <SharingPartnersSection
        partners={form.partners}
        loanSummary={loanSummary}
        onChange={actions.updatePartner}
        onAdd={actions.addPartner}
        onRemove={actions.removePartner}
      />

      <CaseFeesSection
        fees={form.fees}
        onChange={actions.updateFee}
        onAdd={actions.addFee}
        onRemove={actions.removeFee}
      />

      <ConsultancySection
        consults={form.consults}
        principal={loanSummary.principal}
        total={consultTotal}
        onChange={actions.updateConsult}
        onAdd={actions.addConsult}
        onRemove={actions.removeConsult}
      />

      <SheetFooter />
    </main>
  )
}

/**
 * View Details: reads the saved loan first, then shows the sheet with the Loan section filled with it.
 * Only the Loan section is stored in the database; partners, fees and consultancy start as on a new sheet.
 */
function SavedLoanSheet({ loanNo }) {
  const result = useLoanDetails(loanNo)

  if (!result) {
    return (
      <main className="page">
        <div className="sheet-nav">
          <BackButton />
        </div>
        <SaveNotice state={{ status: 'saving', message: `Loading loan ${loanNo}…` }} />
      </main>
    )
  }

  if (!result.ok || !result.loan) {
    return (
      <main className="page">
        <section className="card sheet-problem">
          {result.ok ? (
            <>
              <h2>Loan not found</h2>
              <p className="hint">
                No saved loan has the number {loanNo}. It may not have been saved yet, or the
                address is wrong.
              </p>
            </>
          ) : (
            <SaveNotice state={{ status: 'error', message: result.message }} />
          )}
          <div className="row-actions">
            <BackButton />
          </div>
        </section>
      </main>
    )
  }

  return <Sheet savedLoan={result.loan} />
}

/** The sheet page: a new loan (no loan number in the address) or a saved loan (View Details). */
export default function SheetPage({ loanNo }) {
  return loanNo === undefined ? <Sheet /> : <SavedLoanSheet loanNo={loanNo} />
}
