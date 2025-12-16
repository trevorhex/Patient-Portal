import Link from 'next/link'
import { Badge } from '@/app/components/Badge'
import { formatRelativeTime } from '@/lib/utils'
import { ISSUE_STATUS, ISSUE_PRIORITY } from '@/db/schema'
import { Issue, Status, Priority } from '@/types/Issue'
import { ROUTES } from '@/config/routes'

export interface IssuesTableProps { issues: Issue[] }

export const IssuesTable = ({ issues }: IssuesTableProps) => {
  return (
    <div className="overflow-hidden rounded-lg border border-zinc-700 shadow-sm">
      <TableHeader />

      <div className="divide-y divide-zinc-700">
        {issues.map((issue) => (
          <Link
            key={issue.id}
            href={ROUTES.issues.view(issue.id).href}
            className="block bg-zinc-900 hover:bg-zinc-800 transition"
          >
            <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center">
              <div className="col-span-5 font-medium truncate">
                {issue.title}
              </div>
              <div className="col-span-2">
                <Badge status={issue.status as Status}>
                  {ISSUE_STATUS[issue.status].label}
                </Badge>
              </div>
              <div className="col-span-2">
                <Badge priority={issue.priority as Priority}>
                  {ISSUE_PRIORITY[issue.priority].label}
                </Badge>
              </div>
              <div className="col-span-3 text-sm text-gray-400">
                {formatRelativeTime(new Date(issue.createdAt))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export const TableHeader = () => (
  <div className="grid grid-cols-12 gap-4 px-6 py-3 text-sm font-medium text-gray-300 bg-zinc-700">
    <div className="col-span-5">Title</div>
    <div className="col-span-2">Status</div>
    <div className="col-span-2">Priority</div>
    <div className="col-span-3">Created</div>
  </div>
)
