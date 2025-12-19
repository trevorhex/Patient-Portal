import { PortalLayout } from '../components/PortalLayout'
import { Wizard } from './components/Wizard'

export default function SetupWizardPage() {
  return (
    <PortalLayout heading="Setup Wizard">
      <Wizard />
    </PortalLayout>
  )
}
