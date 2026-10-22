import { useEffect, useState } from 'react'
import { getLoan, listLoans } from '../services/loanQueries'
import { onLoansChanged } from '../lib/loanEvents'

/**
 * The rows of the Loans list: null while the first answer is on its way, then what the service returned.
 * It loads again after every Save loan, and keeps showing the old rows until the new ones arrive.
 */
export function useLoanList() {
  const [result, setResult] = useState(null)
  const [version, setVersion] = useState(0)

  useEffect(() => onLoansChanged(() => setVersion((v) => v + 1)), [])

  useEffect(() => {
    let current = true // false once the page was left, so a late answer is ignored
    listLoans().then((answer) => {
      if (current) setResult(answer)
    })
    return () => {
      current = false
    }
  }, [version])

  return result
}

/** One saved loan for the sheet that View Details opens: null while the answer is on its way. */
export function useLoanDetails(loanNo) {
  const [answer, setAnswer] = useState(null)

  useEffect(() => {
    let current = true
    getLoan(loanNo).then((result) => {
      if (current) setAnswer({ loanNo, result })
    })
    return () => {
      current = false
    }
  }, [loanNo])

  return answer?.loanNo === loanNo ? answer.result : null
}
