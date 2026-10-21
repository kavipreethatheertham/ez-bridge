import { useEffect } from 'react'
import StatusBanner from './components/layout/StatusBanner'
import SaveNotice from './components/layout/SaveNotice'
import SheetFooter from './components/layout/SheetFooter'
import StatsRow from './components/stats/StatsRow'
import LoanSection from './components/loan/LoanSection'
import LoansListSection from './components/loans/LoansListSection'
import LoanDetails from './components/loans/LoanDetails'
import SharingPartnersSection from './components/sharing/SharingPartnersSection'
import CaseFeesSection from './components/fees/CaseFeesSection'
import ConsultancySection from './components/consultancy/ConsultancySection'
import { useAnnexure } from './hooks/useAnnexure'
import { useRoute } from './hooks/useRoute'

export default function App() {
  const { form, isReady, saveState, loanSummary, stats, consultTotal, actions } = useAnnexure()
  const route = useRoute()

  // A page change starts at the top. The create page keeps what was typed while a loan's details are open.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [route.name, route.loanNo])

  if (route.name === 'details') {
    return <LoanDetails key={route.loanNo} loanNo={route.loanNo} />
  }

  return (
    <main className="page">
      <SaveNotice state={saveState} />
      {isReady && <StatusBanner loanNo={form.loanNo} loanSummary={loanSummary} />}

      <StatsRow stats={stats} />

      <LoanSection
        form={form}
        loanSummary={loanSummary}
        onChange={actions.updateLoanField}
        onReset={actions.reset}
        onSave={actions.save}
      />

      <LoansListSection />

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
