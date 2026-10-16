import { formatINR } from '../../utils/money'
import './PayoutSection.css'

const cell = (n) => (n === 0 ? '—' : formatINR(n))

/** Section 3: one row per person, with everything they earn on this annexure. */
export default function PayoutSection({ loanNo, rows }) {
  return (
    <section>
      <h2>Payout by person</h2>
      <p className="hint">
        Each person is the sum of everything they earn on this annexure. Source: annexure{' '}
        {loanNo || '—'}.
      </p>

      <table className="payout-table">
        <thead>
          <tr>
            <th>Person</th>
            <th className="num">Sharing interest</th>
            <th className="num">Total</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={3} className="payout-table__empty">
                Pick a sharing partner to see their payout.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.personId}>
                <td>{row.name}</td>
                <td className="num">{cell(row.sharing)}</td>
                <td className="num">{formatINR(row.total)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  )
}
