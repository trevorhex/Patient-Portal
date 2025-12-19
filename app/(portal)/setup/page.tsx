import { DashboardLayout } from '../components/DashboardLayout'
import { Wizard } from './components/Wizard'

export default function SetupWizardPage() {
  return (
    <DashboardLayout heading="Setup Wizard">
      <Wizard />
    </DashboardLayout>
  )
}
