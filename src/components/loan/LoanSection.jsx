import Field from '../common/Field'
import { formatINR } from '../../utils/money'
import './LoanSection.css'

/** Section 1: the loan header row. Loan number, amount, rate and the calculated interest. */
export default function LoanSection({ form, loanSummary, onChange }) {
  return (
    <section>
      <h2>Loan</h2>
      <p className="hint">
        The header row. Loan interest stays on the loan. Partner rates are separate and do not have
        to add up to this rate.
      </p>

      <div className="loan-fields">
        <Field label="Loan number" value={form.loanNo} onChange={(v) => onChange('loanNo', v)} />
        <Field
          label="Amount (₹)"
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
