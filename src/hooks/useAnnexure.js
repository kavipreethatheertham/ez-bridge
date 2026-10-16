import { useMemo, useState } from 'react'
import { createSampleAnnexure } from '../data/sampleAnnexure'
import { buildPayout, summarizeLoan } from '../utils/calculations'

/**
 * One place that owns ALL the annexure state and the actions that change it.
 * Components only receive data + callbacks, so they stay simple.
 */
export function useAnnexure() {
  const [form, setForm] = useState(createSampleAnnexure)
  const [isReady, setIsReady] = useState(false) // false = Draft, true = Ready (after Save)
  const [nextId, setNextId] = useState(3)

  // Any edit moves the sheet back to "Draft".
  const edit = (updater) => {
    setForm(updater)
    setIsReady(false)
  }

  // ---- Loan -------------------------------------------------------------
  const updateLoanField = (field, value) =>
    edit((prev) => ({ ...prev, [field]: value }))

  // ---- Sharing partners -------------------------------------------------
  const updatePartner = (id, field, value) =>
    edit((prev) => ({
      ...prev,
      partners: prev.partners.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    }))

  const addPartner = () => {
    const id = `p${nextId}`
    setNextId((n) => n + 1)
    edit((prev) => ({
      ...prev,
      partners: [...prev.partners, { id, person: '', amount: '', rate: '' }],
    }))
  }

  const removePartner = (id) =>
    edit((prev) => ({ ...prev, partners: prev.partners.filter((p) => p.id !== id) }))

  // ---- Page actions -----------------------------------------------------
  const reset = () => {
    setForm(createSampleAnnexure())
    setIsReady(false)
  }
  const save = () => setIsReady(true) // Supabase insert/update goes here later

  // ---- Derived numbers (recalculated only when the form changes) ---------
  const loanSummary = useMemo(() => summarizeLoan(form), [form])
  const payoutRows = useMemo(() => buildPayout(form), [form])

  return {
    form,
    isReady,
    loanSummary,
    payoutRows,
    actions: { updateLoanField, updatePartner, addPartner, removePartner, reset, save },
  }
}
