import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

const NOT_CONNECTED =
  'Supabase is not connected yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to .env, then restart npm run dev.'

/** What the Loans list shows: the `loans_list` table. */
const LIST_COLUMNS = 'loan_no, borrower_name, principal, status'

/** What the details page shows: the Loan section as it was saved in the `loans` table. */
const LOAN_COLUMNS = 'loan_no, borrower_name, principal, loan_rate'

const toListItem = (row) => ({
  loanNo: row.loan_no,
  borrowerName: row.borrower_name ?? '',
  principal: row.principal,
  status: row.status,
})

const toLoan = (row) => ({
  loanNo: row.loan_no,
  borrowerName: row.borrower_name ?? '',
  principal: row.principal,
  loanRate: row.loan_rate,
})

/** Plain-words advice for the setup mistakes people hit most. */
const adviceFor = (error, status, table) => {
  if (error.code === '42501') {
    return ` Supabase refused the read: run the grant and policy steps of the ${table} SQL.`
  }
  if (error.code === 'PGRST205' || error.code === '42P01') {
    return ` The ${table} table was not found: run the ${table} SQL in the Supabase SQL Editor.`
  }
  if (status === 401) {
    return ' Check VITE_SUPABASE_PUBLISHABLE_KEY in .env: copy the Publishable key again.'
  }
  return ''
}

const failure = (error, status, what, table) => {
  if (status === 0) {
    // status 0 means the request never got an answer (offline, wrong URL, paused project)
    return {
      ok: false,
      message: `Could not reach Supabase (${error.message}). Check the internet connection and VITE_SUPABASE_URL.`,
    }
  }
  return { ok: false, message: `Could not ${what}: ${error.message}.${adviceFor(error, status, table)}` }
}

/**
 * Every row of the Loans list, the most recently saved first.
 * It never throws: it returns { ok: true, loans } or { ok: false, message } (plus notConnected: true
 * when Supabase is not set up yet).
 */
export async function listLoans() {
  if (!isSupabaseConfigured) return { ok: false, notConnected: true, message: NOT_CONNECTED }

  try {
    const { data, error, status } = await supabase
      .from('loans_list')
      .select(LIST_COLUMNS)
      .order('updated_at', { ascending: false })
      .order('loan_no', { ascending: true })
    if (error) return failure(error, status, 'load the loans', 'loans_list')
    return { ok: true, loans: data.map(toListItem) }
  } catch (error) {
    return { ok: false, message: `Could not reach Supabase: ${error.message}` }
  }
}

/**
 * One saved loan by its loan number, from the `loans` table.
 * Returns { ok: true, loan } (loan is null when no such loan exists) or { ok: false, message }.
 */
export async function getLoan(loanNo) {
  if (!isSupabaseConfigured) return { ok: false, message: NOT_CONNECTED }

  try {
    const { data, error, status } = await supabase
      .from('loans')
      .select(LOAN_COLUMNS)
      .eq('loan_no', loanNo)
      .maybeSingle()
    if (error) return failure(error, status, `load loan ${loanNo}`, 'loans')
    return { ok: true, loan: data ? toLoan(data) : null }
  } catch (error) {
    return { ok: false, message: `Could not reach Supabase: ${error.message}` }
  }
}
