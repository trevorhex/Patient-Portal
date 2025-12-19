import { Suspense } from 'react'
import { getIssues } from '@/dal/issue'
import { NoResults } from './components/NoResults'
import { IssuesTable, TableHeader } from './components/IssuesTable'

const IssuesComponent = async () => {
  const issues = await getIssues()

  if (!issues?.length) return <NoResults />

  return <IssuesTable issues={issues} />
}

const IssuesTableSkeleton = () => (
  <div className="overflow-hidden rounded-lg bg-zinc-900 border border-zinc-700 shadow-sm">
    <TableHeader />
    <div className="divide-y divide-zinc-700 animate-pulse">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="grid grid-cols-12 gap-4 px-6 py-5 items-center divide-y divide-zinc-700">
          {[5, 2, 2, 3].map((span, j) =>
            <div key={j} className={`col-span-${span} h-4 bg-zinc-800 rounded`} />)}
        </div>
      ))}
    </div>
  </div>
)

export const Issues = async () => <Suspense fallback={<IssuesTableSkeleton />}>
  <IssuesComponent />
</Suspense>
