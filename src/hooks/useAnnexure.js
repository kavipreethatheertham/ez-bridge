import { useMemo, useRef, useState } from 'react'
import { createSampleAnnexure } from '../data/sampleAnnexure'
import { buildPayout, summarizeLoan } from '../utils/calculations'
import { buildStats, summarizeBridge, totalConsultancy } from '../utils/summary'
import { saveLoan } from '../services/loanService'

// What the page shows after "Save loan": nothing, "Saving…", a success line or an error line.
const IDLE_SAVE = { status: 'idle', message: '' }

// The sheet a page starts with: the sample sheet, or (View Details) the sample sheet with the Loan
// section filled with a loan saved in the database. Only the Loan section is stored there.
const startingForm = (savedLoan) => {
  const sample = createSampleAnnexure()
  if (!savedLoan) return sample
  return {
    ...sample,
    loanNo: savedLoan.loanNo,
    borrowerName: savedLoan.borrowerName,
    principal: String(savedLoan.principal),
    loanRate: String(savedLoan.loanRate),
  }
}

/**
 * One place that owns ALL the annexure state and the actions that change it.
 * Components only receive data + callbacks, so they stay simple.
 * `savedLoan` is optional: View Details passes a loan read from the database to start from.
 */
export function useAnnexure(savedLoan) {
  const [form, setForm] = useState(() => startingForm(savedLoan))
  const [isReady, setIsReady] = useState(false) // false = Draft, true = Ready (after Save)
  const [nextId, setNextId] = useState(3)
  const [saveState, setSaveState] = useState(IDLE_SAVE) // result of the last "Save loan"
  const editCount = useRef(0) // goes up on every change, so a save that ends late knows the sheet moved on
  const isSaving = useRef(false) // true while a save is running

  // Any edit moves the sheet back to "Draft" and clears the last save message.
  const edit = (updater) => {
    setForm(updater)
    setIsReady(false)
    setSaveState(IDLE_SAVE)
    editCount.current += 1
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

  // ---- Case fees --------------------------------------------------------
  const updateFee = (id, field, value) =>
    edit((prev) => ({
      ...prev,
      fees: prev.fees.map((f) => (f.id === id ? { ...f, [field]: value } : f)),
    }))

  const addFee = () => {
    const id = `f${nextId}`
    setNextId((n) => n + 1)
    edit((prev) => ({
      ...prev,
      fees: [...prev.fees, { id, person: '', label: 'Case fees', amount: '' }],
    }))
  }

  const removeFee = (id) =>
    edit((prev) => ({ ...prev, fees: prev.fees.filter((f) => f.id !== id) }))

  // ---- Consultancy ------------------------------------------------------
  const updateConsult = (id, field, value) =>
    edit((prev) => ({
      ...prev,
      consults: prev.consults.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
    }))

  const addConsult = () => {
    const id = `c${nextId}`
    setNextId((n) => n + 1)
    edit((prev) => ({
      ...prev,
      consults: [...prev.consults, { id, person: '', rate: '' }],
    }))
  }

  const removeConsult = (id) =>
    edit((prev) => ({ ...prev, consults: prev.consults.filter((c) => c.id !== id) }))

  // ---- Page actions -----------------------------------------------------
  const reset = () => {
    setForm(createSampleAnnexure())
    setIsReady(false)
    setSaveState(IDLE_SAVE)
    editCount.current += 1
  }

  // Save loan: writes the Loan section (loan number, principal, interest %) to the Supabase `loans` table.
  const save = async () => {
    if (isSaving.current) return // ignore a second click while the first save is still running
    isSaving.current = true
    const editsAtStart = editCount.current
    setSaveState({ status: 'saving', message: 'Saving…' })
    const result = await saveLoan(form)
    isSaving.current = false
    if (editCount.current !== editsAtStart) return // edited while saving: stay on Draft
    setIsReady(result.ok)
    setSaveState({ status: result.ok ? 'saved' : 'error', message: result.message })
  }

  // ---- Derived numbers (recalculated only when the form changes) ---------
  const loanSummary = useMemo(() => summarizeLoan(form), [form])
  const payoutRows = useMemo(() => buildPayout(form), [form])
  const bridgeSummary = useMemo(() => summarizeBridge(form), [form])
  const stats = useMemo(
    () => buildStats(form, loanSummary, bridgeSummary),
    [form, loanSummary, bridgeSummary],
  )
  const consultTotal = useMemo(
    () => totalConsultancy(form.consults, loanSummary.principal),
    [form.consults, loanSummary.principal],
  )

  return {
    form,
    isReady,
    saveState,
    loanSummary,
    payoutRows,
    stats,
    consultTotal,
    actions: {
      updateLoanField,
      updatePartner,
      addPartner,
      removePartner,
      updateFee,
      addFee,
      removeFee,
      updateConsult,
      addConsult,
      removeConsult,
      reset,
      save,
    },
  }
}
