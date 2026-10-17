import { useMemo, useState } from 'react'
import { createSampleAnnexure } from '../data/sampleAnnexure'
import { buildPayout, summarizeLoan } from '../utils/calculations'
import { buildStats, summarizeBridge, totalConsultancy } from '../utils/summary'

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
  }
  const save = () => setIsReady(true) // Supabase insert/update goes here later

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
