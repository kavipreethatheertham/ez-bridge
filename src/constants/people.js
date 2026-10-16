/**
 * People who can be picked in the dropdowns.
 * Later this list will come from the Supabase `people` table.
 */
export const PEOPLE = [
  { id: 'vivekasundaram', name: 'Vivekasundaram' },
  { id: 'tvh-manivannan', name: 'TVH Manivannan' },
  { id: 'sathise', name: 'Sathise' },
  { id: 'mohammad-idris', name: 'Mohammad Idris' },
  { id: 'vivek', name: 'Vivek' },
]

/** Fixed order used to sort the payout table. */
export const PERSON_ORDER = PEOPLE.map((p) => p.id)

/** Colours used for each sharing-partner segment in the allocation bar. */
export const BAR_COLORS = ['#0b2545', '#5b84b1', '#3d5a80', '#1f7a8c', '#6b7a90', '#9a6b2f']
