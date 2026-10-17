import StatusBanner from './components/layout/StatusBanner'
import LoanSection from './components/loan/LoanSection'
import SharingPartnersSection from './components/sharing/SharingPartnersSection'
import PayoutSection from './components/payout/PayoutSection'
import { useAnnexure } from './hooks/useAnnexure'

export default function App() {
  const { form, isReady, loanSummary, payoutRows, actions } = useAnnexure()

  return (
    <main className="page">
      {isReady && <StatusBanner loanNo={form.loanNo} loanSummary={loanSummary} />}

      <LoanSection
        form={form}
        loanSummary={loanSummary}
        onChange={actions.updateLoanField}
        onReset={actions.reset}
        onSave={actions.save}
      />

      <SharingPartnersSection
        partners={form.partners}
        loanSummary={loanSummary}
        onChange={actions.updatePartner}
        onAdd={actions.addPartner}
        onRemove={actions.removePartner}
      />

      <PayoutSection loanNo={form.loanNo} rows={payoutRows} />
    </main>
  )
}
