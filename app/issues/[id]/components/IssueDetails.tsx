import { Badge } from '@/app/components/Badge'
import { formatRelativeTime } from '@/lib/utils'
import { IssueWithUser, Priority, Status } from '@/types/Issue'

export interface IssueDetailsProps { issue: IssueWithUser }

export const IssueDetails = ({ issue: { status, priority, createdAt, user } }: IssueDetailsProps) => (
  <div className="bg-zinc-900 border border-zinc-700 rounded-lg shadow-sm p-6">
    <h2 className="text-lg font-medium mb-2">Details</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">Assigned to</p>
        <p>{user.email}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">Status</p>
        <Badge status={status as Status}>{status}</Badge>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">Priority</p>
        <Badge priority={priority as Priority}>{priority}</Badge>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">Created</p>
        <p>{formatRelativeTime(new Date(createdAt))}</p>
      </div>
    </div>
  </div>
)
