import Link from 'next/link'
import { PlusIcon } from 'lucide-react'
import { ROUTES } from '@/config/routes'
import { Button } from '@/app/components/Button'
import { PortalLayout } from '../components/PortalLayout'
import { Issues } from './components/Issues'

export default function IssuesPage() {
  return (
    <PortalLayout
      heading="Issues"
      buttons={<Link href={ROUTES.issues.new.href}>
        <Button>
          <span className="flex items-center">
            <PlusIcon size={18} className="mr-2" />
            New Issue
          </span>
        </Button>
      </Link>}
    >
      <Issues />
    </PortalLayout>
  )
}
