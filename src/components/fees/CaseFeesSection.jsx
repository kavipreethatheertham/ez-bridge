import FeeRow from './FeeRow'
import '../common/LineGrid.css'

/** Case fees: a fee assigned to a person. Its own full-width card, like Principal sharing partners. */
export default function CaseFeesSection({ fees, onChange, onAdd, onRemove }) {
  return (
    <section className="card">
      <h2>Case fees</h2>
      <p className="hint">
        A fee assigned to a person. Fees carry no interest. Sathise is recorded at ₹0 on this sheet.
      </p>

      <div className="line-grid line-grid--fee line-grid__head">
        <span className="col-label">Person</span>
        <span className="col-label">Fee</span>
        <span className="col-label">Interest (%)</span>
        <span />
      </div>

      {fees.map((fee) => (
        <FeeRow key={fee.id} fee={fee} onChange={onChange} onRemove={onRemove} />
      ))}

      <div className="row-actions">
        <button type="button" onClick={onAdd}>
          Add fee
        </button>
      </div>
    </section>
  )
}
