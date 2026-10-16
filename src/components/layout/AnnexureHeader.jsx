import Pill from '../common/Pill'
import './AnnexureHeader.css'

/** Page title, Draft/Ready status and the Reset / Save buttons. */
export default function AnnexureHeader({ loanNo, isReady, onReset, onSave }) {
  return (
    <header className="annexure-header">
      <div>
        <h1>
          Annexure sheet <Pill active={isReady}>{isReady ? 'Ready' : 'Draft'}</Pill>
        </h1>
        <p className="hint">
          One case, entered in the same order as the sheet. Interest amount is amount × interest %.
          Loan {loanNo || '—'}.
        </p>
      </div>

      <div className="annexure-header__actions">
        <button type="button" className="ghost" onClick={onReset}>
          Reset sample
        </button>
        <button type="button" className="primary" onClick={onSave}>
          Save annexure
        </button>
      </div>
    </header>
  )
}
