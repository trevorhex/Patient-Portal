import { PortalLayout } from '../components/PortalLayout'
import { Profile } from './components/Profile'

export default function PatientProfilePage() {
  return (
    <PortalLayout heading="Patient Profile">
      <Profile />
    </PortalLayout>
  )
}
