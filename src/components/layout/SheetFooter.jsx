import './SheetFooter.css'

/** Closing note at the bottom of the sheet: what the Vivek and Sathise lines on the sheet contain. */
export default function SheetFooter() {
  return (
    <footer className="sheet-footer">
      <div className="sheet-footer__note">
        <strong>Vivek total and Sathise total on the sheet</strong>
        Those two lines are the Eazee Bridge split only, ₹3,75,000 each. Sharing interest and
        consultancy stay with Vivekasundaram, TVH Manivannan, and Mohammad Idris.
      </div>
    </footer>
  )
}
