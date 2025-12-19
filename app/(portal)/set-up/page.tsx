import { DashboardLayout } from '../components/DashboardLayout'
import { Wizard } from './components/Wizard'

export default function SetUpWizardPage() {
  return (
    <DashboardLayout heading="Set Up Wizard">
      <Wizard />
    </DashboardLayout>
  )
}
