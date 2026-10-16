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
export const BAR_COLORS = ['#8c2f3b', '#2f6f73', '#c0820f', '#4b5f9e', '#6b7f3a', '#7a4a78']
