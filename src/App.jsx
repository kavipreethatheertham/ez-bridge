import StatusBanner from './components/layout/StatusBanner'
import SheetFooter from './components/layout/SheetFooter'
import StatsRow from './components/stats/StatsRow'
import LoanSection from './components/loan/LoanSection'
import SharingPartnersSection from './components/sharing/SharingPartnersSection'
import CaseFeesSection from './components/fees/CaseFeesSection'
import ConsultancySection from './components/consultancy/ConsultancySection'
import { useAnnexure } from './hooks/useAnnexure'

export default function App() {
  const { form, isReady, loanSummary, stats, consultTotal, actions } = useAnnexure()

  return (
    <main className="page">
      {isReady && <StatusBanner loanNo={form.loanNo} loanSummary={loanSummary} />}

      <StatsRow stats={stats} />

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

      <CaseFeesSection
        fees={form.fees}
        onChange={actions.updateFee}
        onAdd={actions.addFee}
        onRemove={actions.removeFee}
      />

      <ConsultancySection
        consults={form.consults}
        principal={loanSummary.principal}
        total={consultTotal}
        onChange={actions.updateConsult}
        onAdd={actions.addConsult}
        onRemove={actions.removeConsult}
      />

      <SheetFooter />
    </main>
  )
}
