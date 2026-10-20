import Pill from '../common/Pill'
import PartnerRow from './PartnerRow'
import AllocationBar from './AllocationBar'
import './SharingPartnersSection.css'

/** Section 2: who shares the loan, how much each takes, and at what interest rate. */
export default function SharingPartnersSection({
  partners,
  loanSummary,
  onChange,
  onAdd,
  onRemove,
}) {
  return (
    <section className="card">
      <div className="card-head">
        <h2>Principal sharing partners</h2>
        <Pill active={loanSummary.principalMatched}>
          {loanSummary.principalMatched ? 'Allocated' : 'Open'}
        </Pill>
      </div>

      <p className="hint">
        Dropdown rows under the loan. On LN0025, Vivekasundaram takes ₹50,00,000 at 2% and TVH
        Manivannan takes ₹1,00,00,000 at 5%.
      </p>

      <div className="partner-grid">
        <span className="col-label">Sharing partner</span>
        <span className="col-label">Principal amount (₹)</span>
        <span className="col-label">Interest %</span>
        <span className="col-label">Interest amount</span>
        <span />
      </div>

      {partners.map((partner) => (
        <PartnerRow key={partner.id} partner={partner} onChange={onChange} onRemove={onRemove} />
      ))}

      <div className="row-actions">
        <button type="button" onClick={onAdd}>
          Add principal sharing partner
        </button>
      </div>

      <AllocationBar partners={partners} loanSummary={loanSummary} />
    </section>
  )
}
