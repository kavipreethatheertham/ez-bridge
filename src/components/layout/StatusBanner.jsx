import { formatINR } from '../../utils/money'
import './StatusBanner.css'

/** Shown only after "Save loan". Green when partners cover the full principal, amber otherwise. */
export default function StatusBanner({ loanNo, loanSummary }) {
  const { principal, partnerTotal, principalMatched } = loanSummary

  return (
    <div className={`status-banner ${principalMatched ? 'ok' : 'warn'}`} role="status">
      <strong>
        {loanNo} {principalMatched ? 'marked ready' : 'saved with a gap'}
      </strong>
      {principalMatched
        ? `Sharing partners cover the full principal of ${formatINR(principal)}.`
        : `Sharing partners cover ${formatINR(partnerTotal)} of the ${formatINR(principal)} principal.`}
    </div>
  )
}
