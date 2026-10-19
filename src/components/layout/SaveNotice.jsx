import './SaveNotice.css'

/**
 * The result of the last "Save loan": a grey "Saving…" line, a green line when the loan reached the
 * database, a red line when it did not. Shows nothing until Save loan is clicked, and again after any edit.
 */
export default function SaveNotice({ state }) {
  if (state.status === 'idle') return null

  return (
    <div
      className={`save-notice ${state.status}`}
      role={state.status === 'error' ? 'alert' : 'status'}
    >
      {state.message}
    </div>
  )
}
