import { IssueLayout } from '../components/IssueLayout'
import { IssueSuspense } from '../components/IssueSuspense'

export default function NewIssuePage() {
  return (
    <IssueLayout heading="Create New Issue">
      <IssueSuspense />
    </IssueLayout>
  )
}
