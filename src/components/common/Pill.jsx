/** Small rounded status label, e.g. Draft / Ready / Open / Allocated. */
export default function Pill({ children, active = false }) {
  return <span className={`pill${active ? ' on' : ''}`}>{children}</span>
}
