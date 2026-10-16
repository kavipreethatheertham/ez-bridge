/**
 * Label + input in one reusable piece.
 * Used by the Loan section (and any other section that needs a labelled input).
 */
export default function Field({
  label,
  value,
  onChange,
  disabled = false,
  inputMode,
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        disabled={disabled}
        inputMode={inputMode}
        readOnly={!onChange}
      />
    </label>
  )
}
