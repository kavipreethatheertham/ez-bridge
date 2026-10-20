import Field from '../common/Field'
import { formatINR } from '../../utils/money'
import './LoanSection.css'

/**
 * Section 1: the loan header row. Loan number, borrower name, amount, rate and the calculated
 * interest. The Reset sample / Save loan buttons sit on the right of the section heading.
 */
export default function LoanSection({ form, loanSummary, onChange, onReset, onSave }) {
  return (
    <section className="loan-section">
      <div className="loan-head">
        <div className="loan-head__text">
          <h2>Loan</h2>
          <p className="hint">
            The header row. Loan interest stays on the loan. Partner rates are separate and do not
            have to add up to this rate.
          </p>
        </div>

        <div className="loan-head__actions">
          <button type="button" className="ghost" onClick={onReset}>
            Reset sample
          </button>
          <button type="button" className="primary" onClick={onSave}>
            Save loan
          </button>
        </div>
      </div>

      <div className="loan-fields">
        <Field label="Loan number" value={form.loanNo} onChange={(v) => onChange('loanNo', v)} />
        <Field
          label="Borrower name"
          value={form.borrowerName}
          onChange={(v) => onChange('borrowerName', v)}
        />
        <Field
          label="Principal Amount (₹)"
          value={form.principal}
          onChange={(v) => onChange('principal', v)}
          inputMode="decimal"
        />
        <Field
          label="Interest %"
          value={form.loanRate}
          onChange={(v) => onChange('loanRate', v)}
          inputMode="decimal"
        />
        <Field label="Interest amount" value={formatINR(loanSummary.loanInterest)} disabled />
      </div>
    </section>
  )
}
