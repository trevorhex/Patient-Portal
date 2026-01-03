import { PlusIcon } from 'lucide-react'
import { Button } from '@/app/components/Button'
import { ROUTES } from '@/config/routes'
import { PortalLayout } from '../components/PortalLayout'
import { Issues } from './components/Issues'

export default function IssuesPage() {
  return (
    <PortalLayout
      heading="Issues"
      buttons={
        <Button href={ROUTES.issues.new.href}>
          <span className="flex items-center">
            <PlusIcon size={18} className="mr-2" />
            New Issue
          </span>
        </Button>
      }
    >
      <Issues />
    </PortalLayout>
  )
}
