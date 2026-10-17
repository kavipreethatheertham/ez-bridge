import PersonSelect from '../common/PersonSelect'

/** One case-fee row: who gets it, the fee name, and the figure next to it. */
export default function FeeRow({ fee, onChange, onRemove }) {
  return (
    <div className="line-grid line-grid--fee line-grid__row">
      <div className="line-cell" data-label="Person">
        <PersonSelect
          value={fee.person}
          onChange={(v) => onChange(fee.id, 'person', v)}
          ariaLabel="Person"
        />
      </div>
      <div className="line-cell" data-label="Fee">
        <input
          value={fee.label}
          onChange={(e) => onChange(fee.id, 'label', e.target.value)}
          placeholder="Case fees"
          aria-label="Fee"
        />
      </div>
      <div className="line-cell" data-label="Interest (%)">
        <input
          value={fee.amount}
          onChange={(e) => onChange(fee.id, 'amount', e.target.value)}
          inputMode="decimal"
          aria-label="Interest (%)"
        />
      </div>
      <button
        type="button"
        className="icon-btn"
        onClick={() => onRemove(fee.id)}
        aria-label="Remove fee"
      >
        ×
      </button>
    </div>
  )
}
