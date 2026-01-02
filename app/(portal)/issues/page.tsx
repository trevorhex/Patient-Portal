import { ROUTES } from '@/config/routes'
import { PortalLayout } from '../components/PortalLayout'
import { IssueButton } from './components/Issues/components/IssueButton'
import { Issues } from './components/Issues'

export default function IssuesPage() {
  return (
    <PortalLayout
      heading="Issues"
      buttons={<IssueButton href={ROUTES.issues.new.href}>New Issue</IssueButton>}
    >
      <Issues />
    </PortalLayout>
  )
}
