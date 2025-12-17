import { IssueLayout } from '../../components/IssueLayout'
import { IssueSuspense } from '../../components/IssueSuspense'

export type EditIssuePageProps = { params: Promise<{ id: string }> }

export default function EditIssuePage({ params }: EditIssuePageProps) {
  return (
    <IssueLayout heading="Edit Issue">
      <IssueSuspense params={params} />
    </IssueLayout>
  )
}
