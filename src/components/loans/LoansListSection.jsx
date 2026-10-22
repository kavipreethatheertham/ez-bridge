import Pill from '../common/Pill'
import SaveNotice from '../layout/SaveNotice'
import { useLoanList } from '../../hooks/useLoans'
import { detailsPath, goTo, newPath } from '../../lib/route'
import { formatINR } from '../../utils/money'
import './LoansListSection.css'

/**
 * The Loans list: every saved loan (from the `loans_list` table), the most recently saved first,
 * each with a View Details link. It loads again every time a loan is saved.
 */
export default function LoansListSection() {
  const result = useLoanList()
  const loans = result?.ok ? result.loans : []
  const count = loans.length

  let hint = 'Every loan saved with Save loan appears here.'
  let body

  if (!result) {
    body = <SaveNotice state={{ status: 'saving', message: 'Loading loans…' }} />
  } else if (result.notConnected) {
    body = <p className="hint">{result.message}</p>
  } else if (!result.ok) {
    body = <SaveNotice state={{ status: 'error', message: result.message }} />
  } else if (count === 0) {
    body = (
      <p className="hint">
        No loans are saved yet. Click New loan, fill in the sheet and click Save loan.
      </p>
    )
  } else {
    hint = `${count} saved ${count === 1 ? 'loan' : 'loans'}, most recently saved first. Click View Details to open one.`
    body = (
      <div role="table" aria-label="Saved loans">
        <div className="loan-grid loan-grid__head" role="row">
          <span className="col-label" role="columnheader">
            Loan ID
          </span>
          <span className="col-label" role="columnheader">
            Borrower Name
          </span>
          <span className="col-label" role="columnheader">
            Principal
          </span>
          <span className="col-label" role="columnheader">
            Status
          </span>
          <span className="col-label" role="columnheader">
            Actions
          </span>
        </div>

        {loans.map((loan) => (
          <div className="loan-grid loan-grid__row" role="row" key={loan.loanNo}>
            <span className="loan-cell loan-id" role="cell" data-label="Loan ID">
              {loan.loanNo}
            </span>
            <span
              className={`loan-cell${loan.borrowerName ? '' : ' loan-empty'}`}
              role="cell"
              data-label="Borrower Name"
            >
              {loan.borrowerName || '—'}
            </span>
            <span className="loan-cell" role="cell" data-label="Principal">
              {formatINR(loan.principal)}
            </span>
            <span className="loan-cell" role="cell" data-label="Status">
              <Pill active={loan.status === 'Active'}>{loan.status}</Pill>
            </span>
            <span className="loan-cell" role="cell" data-label="Actions">
              <a
                className="loan-link"
                href={detailsPath(loan.loanNo)}
                aria-label={`View details of loan ${loan.loanNo}`}
              >
                View Details
              </a>
            </span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <section className="card">
      <div className="loan-list__head">
        <h2>Loan List</h2>
        <div className="loan-list__actions">
          {count > 0 && <Pill>{count} saved</Pill>}
          <button type="button" className="primary" onClick={() => goTo(newPath())}>
            New loan
          </button>
        </div>
      </div>

      <p className="hint">{hint}</p>

      {body}
    </section>
  )
}
