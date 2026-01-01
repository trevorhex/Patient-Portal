import { notFound } from 'next/navigation'
import { Edit2Icon } from 'lucide-react'
import { ROUTES } from '@/config/routes'
import { getIssue } from '@/dal/issue'
import { Button } from '@/app/components/Button'
import { IssueLayout } from '../components/IssueLayout'
import { DeleteIssueButton } from './components/DeleteIssueButton'
import { IssueStatus } from './components/IssueStatus'
import { IssueDetails } from './components/IssueDetails'

export type IssuePageProps = { params: Promise<{ id: string }> }

export default async function IssuePage({ params }: IssuePageProps) {
  const { id } = await params
  const issue = await getIssue(parseInt(id))

  if (!issue) notFound()

  return (
    <IssueLayout
      heading={issue.title}
      buttons={<>
        <Button variant="outline" size="sm" className="flex items-center" href={ROUTES.issues.edit(id).href}>
          <Edit2Icon size={16} className="mr-1" /> Edit
        </Button>
        <DeleteIssueButton id={parseInt(id)} />
      </>}
    ><>
      <IssueStatus issue={issue} />
      <IssueDetails issue={issue} />
    </></IssueLayout>
  )
}
