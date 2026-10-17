import ConsultRow from './ConsultRow'
import { formatINR } from '../../utils/money'
import '../common/LineGrid.css'
import './ConsultancySection.css'

/** Consultancy: fee is loan principal x rate. Its own full-width card, below Case fees. */
export default function ConsultancySection({ consults, principal, total, onChange, onAdd, onRemove }) {
  return (
    <section className="card">
      <h2>Consultancy</h2>
      <p className="hint">
        Fee is base amount × rate. Mohammad Idris is 1% of ₹1,50,00,000, which is ₹1,50,000.
      </p>

      <div className="line-grid line-grid--consult line-grid__head">
        <span className="col-label">Consultant</span>
        <span className="col-label">Rate %</span>
        <span className="col-label">Fee</span>
        <span />
      </div>

      {consults.map((consult) => (
        <ConsultRow
          key={consult.id}
          consult={consult}
          principal={principal}
          onChange={onChange}
          onRemove={onRemove}
        />
      ))}

      <div className="row-actions">
        <button type="button" onClick={onAdd}>
          Add consultant
        </button>
      </div>

      <p className="hint consult-total">Consultancy on this case: {formatINR(total)}</p>
    </section>
  )
}
