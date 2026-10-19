import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'
import { toNumber } from '../utils/money'

/** The Loan section as one row of the `loans` table (column names match the SQL in the setup guide). */
const toLoanRow = ({ loanNo, principal, loanRate }) => ({
  loan_no: String(loanNo ?? '').trim(),
  principal: toNumber(principal),
  loan_rate: toNumber(loanRate),
})

/** Plain-words advice for the setup mistakes people hit most. */
const adviceFor = (error, status) => {
  if (error.code === '42501') {
    return ' Supabase refused the save: run the grant and policy steps from the Supabase setup guide.'
  }
  if (error.code === 'PGRST205' || error.code === '42P01') {
    return ' The loans table was not found: run the SQL from the Supabase setup guide.'
  }
  if (status === 401) {
    return ' Check VITE_SUPABASE_PUBLISHABLE_KEY in .env: copy the Publishable key again.'
  }
  return ''
}

/**
 * Saves the Loan section (loan number, principal, interest %) to the Supabase `loans` table.
 * A loan number that already exists is updated, never duplicated.
 * It never throws: it always returns { ok, message } so the page can show the result.
 */
export async function saveLoan(form) {
  const row = toLoanRow(form)

  if (!row.loan_no) return { ok: false, message: 'Enter a loan number before saving.' }
  if (row.principal <= 0) return { ok: false, message: 'Enter the Principal Amount before saving.' }
  if (String(form.loanRate ?? '').trim() === '') {
    return { ok: false, message: 'Enter the Interest % before saving.' }
  }
  if (row.loan_rate < 0) return { ok: false, message: 'Interest % cannot be negative.' }

  if (!isSupabaseConfigured) {
    return {
      ok: false,
      message:
        'Supabase is not connected yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to .env, then restart npm run dev.',
    }
  }

  try {
    const { error, status } = await supabase.from('loans').upsert(row, { onConflict: 'loan_no' })
    if (error && status === 0) {
      // status 0 means the request never got an answer (offline, wrong URL, paused project)
      return {
        ok: false,
        message: `Could not reach Supabase (${error.message}). Check the internet connection and VITE_SUPABASE_URL.`,
      }
    }
    if (error) {
      return {
        ok: false,
        message: `Could not save loan ${row.loan_no}: ${error.message}.${adviceFor(error, status)}`,
      }
    }
  } catch (error) {
    return { ok: false, message: `Could not reach Supabase: ${error.message}` }
  }

  return { ok: true, message: `Loan ${row.loan_no} saved to the database.` }
}
