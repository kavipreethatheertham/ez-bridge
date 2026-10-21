import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'
import { toNumber } from '../utils/money'
import { announceLoansChanged } from '../lib/loanEvents'

/** The Loan section as one row of the `loans` table (column names match the SQL in the setup guide). */
const toLoanRow = ({ loanNo, borrowerName, principal, loanRate }) => ({
  loan_no: String(loanNo ?? '').trim(),
  borrower_name: String(borrowerName ?? '').trim() || null, // a blank box is stored as empty (null), not as ''
  principal: toNumber(principal),
  loan_rate: toNumber(loanRate),
})

/**
 * The same loan as one row of the `loans_list` table, which the Loans list reads.
 * `status` is not sent: a new loan starts as Active and a later save keeps the status it has.
 */
const toListRow = ({ loan_no, borrower_name, principal }) => ({ loan_no, borrower_name, principal })

/** Plain-words advice for the setup mistakes people hit most. */
const adviceFor = (error, status) => {
  if (error.code === '42501') {
    return ' Supabase refused the save: run the grant and policy steps from the Supabase setup guide.'
  }
  if (error.code === 'PGRST205' || error.code === '42P01') {
    return ' The loans table was not found: run the SQL from the Supabase setup guide.'
  }
  if (error.code === 'PGRST204' || error.code === '42703') {
    return " The loans table has no borrower_name column yet: add it in the Supabase SQL Editor (if you just added it, run notify pgrst, 'reload schema'; there too), then save again."
  }
  if (status === 401) {
    return ' Check VITE_SUPABASE_PUBLISHABLE_KEY in .env: copy the Publishable key again.'
  }
  return ''
}

/** Plain-words advice when the loan was saved but its `loans_list` row could not be written. */
const listAdviceFor = (error, status) => {
  if (status === 0) {
    return ' Check the internet connection and VITE_SUPABASE_URL, then save again.'
  }
  if (error.code === '42501') {
    return ' Supabase refused the save: run the grant and policy steps of the loans_list SQL.'
  }
  if (error.code === 'PGRST205' || error.code === '42P01') {
    return ' The loans_list table was not found: run the loans_list SQL in the Supabase SQL Editor, then save again.'
  }
  return ''
}

/**
 * Saves the Loan section (loan number, borrower name, principal, interest %) to the Supabase `loans` table,
 * and the same loan's row for the Loans list to the `loans_list` table.
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

    // The Loans list reads its own table, so the same loan is written there too.
    const list = await supabase.from('loans_list').upsert(toListRow(row), { onConflict: 'loan_no' })
    if (list.error) {
      return {
        ok: false,
        message: `Loan ${row.loan_no} was saved, but the Loans list could not be updated: ${list.error.message}.${listAdviceFor(list.error, list.status)}`,
      }
    }
  } catch (error) {
    return { ok: false, message: `Could not reach Supabase: ${error.message}` }
  }

  announceLoansChanged() // the Loans list loads again and shows this loan
  return { ok: true, message: `Loan ${row.loan_no} saved to the database.` }
}
