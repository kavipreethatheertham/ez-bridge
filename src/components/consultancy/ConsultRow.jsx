import PersonSelect from '../common/PersonSelect'
import { calcInterest } from '../../utils/calculations'
import { formatINR } from '../../utils/money'

/** One consultant row: consultant, base amount, rate, and the calculated fee (base x rate). */
export default function ConsultRow({ consult, onChange, onRemove }) {
  return (
    <div className="line-grid line-grid--consult line-grid__row">
      <div className="line-cell" data-label="Consultant">
        <PersonSelect
          value={consult.person}
          onChange={(v) => onChange(consult.id, 'person', v)}
          ariaLabel="Consultant"
        />
      </div>
      <div className="line-cell" data-label="Base (₹)">
        <input
          value={consult.amount}
          onChange={(e) => onChange(consult.id, 'amount', e.target.value)}
          inputMode="decimal"
          aria-label="Base amount"
        />
      </div>
      <div className="line-cell" data-label="Rate %">
        <input
          value={consult.rate}
          onChange={(e) => onChange(consult.id, 'rate', e.target.value)}
          inputMode="decimal"
          aria-label="Rate percent"
        />
      </div>
      <div className="line-cell" data-label="Fee">
        <input value={formatINR(calcInterest(consult.amount, consult.rate))} disabled aria-label="Fee" />
      </div>
      <button
        type="button"
        className="icon-btn"
        onClick={() => onRemove(consult.id)}
        aria-label="Remove consultant"
      >
        ×
      </button>
    </div>
  )
}
