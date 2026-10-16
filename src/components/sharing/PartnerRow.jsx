import PersonSelect from '../common/PersonSelect'
import { calcInterest } from '../../utils/calculations'
import { formatINR } from '../../utils/money'

/** One editable row: partner dropdown, amount, rate, calculated interest, remove button. */
export default function PartnerRow({ partner, onChange, onRemove }) {
  return (
    <div className="partner-grid">
      <PersonSelect
        value={partner.person}
        onChange={(v) => onChange(partner.id, 'person', v)}
        ariaLabel="Sharing partner"
      />
      <input
        value={partner.amount}
        onChange={(e) => onChange(partner.id, 'amount', e.target.value)}
        inputMode="decimal"
        aria-label="Amount"
      />
      <input
        value={partner.rate}
        onChange={(e) => onChange(partner.id, 'rate', e.target.value)}
        inputMode="decimal"
        aria-label="Interest percent"
      />
      <input
        value={formatINR(calcInterest(partner.amount, partner.rate))}
        disabled
        aria-label="Interest amount"
      />
      <button
        type="button"
        className="icon-btn"
        onClick={() => onRemove(partner.id)}
        aria-label="Remove sharing partner"
      >
        ×
      </button>
    </div>
  )
}
