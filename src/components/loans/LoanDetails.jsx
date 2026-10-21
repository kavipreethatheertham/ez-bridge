import Field from '../common/Field'
import SaveNotice from '../layout/SaveNotice'
import { useLoanDetails } from '../../hooks/useLoans'
import { calcInterest } from '../../utils/calculations'
import { formatINR } from '../../utils/money'
import { goTo, homePath } from '../../lib/route'
import '../loan/LoanSection.css'
import './LoanDetails.css'

const Page = ({ children }) => <main className="page">{children}</main>

const BackButton = () => (
  <button type="button" onClick={() => goTo(homePath())}>
    Back to list
  </button>
)

/**
 * The details page: the Loan section of the create page, filled with the values saved in the database.
 * The boxes cannot be edited here. Only the Loan section is stored in the database today.
 */
export default function LoanDetails({ loanNo }) {
  const result = useLoanDetails(loanNo)

  if (!result) {
    return (
      <Page>
        <SaveNotice state={{ status: 'saving', message: `Loading loan ${loanNo}…` }} />
      </Page>
    )
  }

  if (!result.ok || !result.loan) {
    return (
      <Page>
        <section className="card loan-details__problem">
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
      </Page>
    )
  }

  const { loan } = result

  return (
    <Page>
      <section className="loan-section">
        <div className="loan-head">
          <div className="loan-head__text">
            <h2>Loan details</h2>
            <p className="hint">
              The saved values of this loan, filled in as on the create page. They cannot be
              changed here.
            </p>
          </div>

          <div className="loan-head__actions">
            <BackButton />
          </div>
        </div>

        <div className="loan-fields">
          <Field label="Loan number" value={loan.loanNo} />
          <Field label="Borrower name" value={loan.borrowerName} />
          <Field label="Principal Amount (₹)" value={String(loan.principal)} />
          <Field label="Interest %" value={String(loan.loanRate)} />
          <Field
            label="Interest amount"
            value={formatINR(calcInterest(loan.principal, loan.loanRate))}
            disabled
          />
        </div>

        <p className="hint loan-details__note">
          Principal sharing partners, Case fees and Consultancy are not saved in the database yet,
          so only the Loan section is shown.
        </p>
      </section>
    </Page>
  )
}
