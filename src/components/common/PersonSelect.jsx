import { PEOPLE } from '../../constants/people'

/** Dropdown of people. `value` is the person id ('' = nothing selected). */
export default function PersonSelect({ value, onChange, ariaLabel = 'Select person' }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} aria-label={ariaLabel}>
      <option value="">Select</option>
      {PEOPLE.map((person) => (
        <option key={person.id} value={person.id}>
          {person.name}
        </option>
      ))}
    </select>
  )
}
