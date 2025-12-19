import { PortalLayout } from '../components/PortalLayout'
import { Wizard } from './components/Wizard'

export default function PatientProfilePage() {
  return (
    <PortalLayout heading="Patient Profile">
      <Wizard />
    </PortalLayout>
  )
}
