import Link from 'next/link'
import { PlusIcon } from 'lucide-react'
import { Button } from '@/app/components/Button'
import { Issues } from './components/Issues'

export default function DashboardPage() {
  return <div className="px-8 py-8">
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-2xl font-bold">Issues</h1>
      <Link href="/issues/new">
        <Button>
          <span className="flex items-center">
            <PlusIcon size={18} className="mr-2" />
            New Issue
          </span>
        </Button>
      </Link>
    </div>
    <Issues />
  </div>
}
