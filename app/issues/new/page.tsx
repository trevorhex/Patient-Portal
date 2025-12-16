import Link from 'next/link'
import { ArrowLeftIcon } from 'lucide-react'
import { ROUTES } from '@/config/routes'
import { NewIssue } from './components/NewIssue'

export default function NewIssuePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 md:py-16">
      <Link
        href={ROUTES.dashboard.href}
        className="inline-flex items-center text-sm mb-6 text-gray-400 hover:text-gray-200 transition-colors"
      >
        <ArrowLeftIcon size={16} className="mr-1" />
        Back to Dashboard
      </Link>
      <h1 className="text-2xl font-bold mb-6">Create New Issue</h1>
      <div className="bg-zinc-900 border border-zinc-700 rounded-lg shadow-sm p-6">
        <NewIssue />
      </div>
    </div>
  )
}
