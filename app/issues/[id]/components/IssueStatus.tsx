import { Badge } from '@/app/components/Badge'
import { formatRelativeTime } from '@/lib/utils'
import { IssueWithUser, Priority, Status } from '@/types/issue'

export interface IssueStatusProps { issue: IssueWithUser }

export const IssueStatus = ({ issue: { status, priority, createdAt, updatedAt, description } }: IssueStatusProps) => (
  <div className="bg-zinc-900 border border-zinc-700 rounded-lg shadow-sm p-6 mb-8">
    <div className="flex flex-wrap gap-3 mb-6">
      <Badge status={status as Status}>{status}</Badge>
      <Badge priority={priority as Priority}>{priority}</Badge>
      <div className="text-sm text-gray-500">
        Created {formatRelativeTime(new Date(createdAt))}
      </div>
      {updatedAt !== createdAt && (
        <div className="text-sm text-gray-500">
          Updated {formatRelativeTime(new Date(updatedAt))}
        </div>
      )}
    </div>

    {description ? (
      <div className="prose prose-invert max-w-none">
        <p className="whitespace-pre-line">{description}</p>
      </div>
    ) : (
      <p className="text-gray-500 italic">No description provided.</p>
    )}
  </div>
)
