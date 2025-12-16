import { Suspense } from 'react'
import Link from 'next/link'
import { PlusIcon } from 'lucide-react'
import { Button } from '@/app/components/Button'
import { Badge, BadgeStatus, BadgePriority } from '@/app/components/Badge'
import { getIssues } from '@/lib/dal'
import { formatRelativeTime } from '@/lib/utils'
import { ISSUE_STATUS, ISSUE_PRIORITY } from '@/db/schema'

const IssuesComponent = async () => {
  const issues = await getIssues()

  if (!issues?.length) {
    return (
      <div
        className={`
          flex flex-col items-center justify-center py-12 px-8 text-center
          border border-gray-500 dark:border-dark-border-default rounded-lg dark:bg-dark-high
        `}>
        <h3 className="text-lg font-medium mb-2">No issues found</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Get started by creating your first issue.
        </p>
        <Link href="/issues/new">
          <Button>
            <span className="flex items-center">
              <PlusIcon size={18} className="mr-2" />
              Create Issue
            </span>
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-dark-border-default bg-white dark:bg-dark-high shadow-sm">
      <div
        className={`
          grid grid-cols-12 gap-4 px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400
          bg-gray-50 dark:bg-dark-elevated border-b border-gray-200 dark:border-dark-border-default
        `}
      >
        <div className="col-span-5">Title</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-2">Priority</div>
        <div className="col-span-3">Created</div>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-dark-border-default">
        {issues.map((issue) => (
          <Link
            key={issue.id}
            href={`/issues/${issue.id}`}
            className="block hover:bg-gray-50 dark:hover:bg-dark-elevated transition-colors"
          >
            <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center">
              <div className="col-span-5 font-medium truncate">
                {issue.title}
              </div>
              <div className="col-span-2">
                <Badge status={issue.status as BadgeStatus}>
                  {ISSUE_STATUS[issue.status].label}
                </Badge>
              </div>
              <div className="col-span-2">
                <Badge priority={issue.priority as BadgePriority}>
                  {ISSUE_PRIORITY[issue.priority].label}
                </Badge>
              </div>
              <div className="col-span-3 text-sm text-gray-500 dark:text-gray-400">
                {formatRelativeTime(new Date(issue.createdAt))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export const Issues = async () => <Suspense fallback={<div>Loading issues...</div>}>
  <IssuesComponent />
</Suspense>
