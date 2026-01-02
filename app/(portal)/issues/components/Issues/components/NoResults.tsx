import { ROUTES } from '@/config/routes'
import { IssueButton } from './IssueButton'

export const NoResults = () => (
  <div
    className={`
      flex flex-col items-center justify-center py-12 px-8 text-center
      bg-zinc-900 border border-zinc-800 rounded-lg
    `}
  >
    <h3 className="text-lg font-medium mb-2">No issues found</h3>
    <p className="text-gray-400 mb-6">
      Get started by creating your first issue.
    </p>
    <IssueButton href={ROUTES.issues.new.href}>
      Create Issue
    </IssueButton>
  </div>
)
