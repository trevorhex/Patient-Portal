import { Suspense } from 'react'
import { getIssues } from '@/lib/dal'
import { NoResults } from './components/NoResults'
import { IssuesTable } from './components/IssuesTable'

const IssuesComponent = async () => {
  const issues = await getIssues()

  if (!issues?.length) return <NoResults />

  return <IssuesTable issues={issues} />
}

const IssuesSkeleton = () => (
  <div className="overflow-hidden rounded-lg dark:bg-zinc-900 border dark:border-zinc-800 shadow-sm">
    <div className="grid grid-cols-12 gap-4 px-6 py-3 dark:bg-dark-elevated border-b dark:border-zinc-800 animate-pulse">
      <div className="col-span-5 h-4 bg-gray-300 dark:bg-gray-600 rounded" />
      <div className="col-span-2 h-4 bg-gray-300 dark:bg-gray-600 rounded" />
      <div className="col-span-2 h-4 bg-gray-300 dark:bg-gray-600 rounded" />
      <div className="col-span-3 h-4 bg-gray-300 dark:bg-gray-600 rounded" />
    </div>
    <div className="divide-y divide-zinc-800 dark:divide-dark-border-default animate-pulse">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="grid grid-cols-12 gap-4 px-6 py-4 items-center">
          <div className="col-span-5 h-4 bg-gray-300 dark:bg-gray-600 rounded" />
          <div className="col-span-2 h-4 bg-gray-300 dark:bg-gray-600 rounded" />
          <div className="col-span-2 h-4 bg-gray-300 dark:bg-gray-600 rounded" />
          <div className="col-span-3 h-4 bg-gray-300 dark:bg-gray-600 rounded" />
        </div>
      ))}
    </div>
  </div>
)

export const Issues = async () => <Suspense fallback={<IssuesSkeleton />}>
  <IssuesComponent />
</Suspense>
