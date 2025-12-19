import { Suspense } from 'react'
import { notFound, redirect } from 'next/navigation'
import { getIssue } from '@/dal/issue'
import { getAuthenticatedUser } from '@/dal/user'
import { ROUTES } from '@/config/routes'
import { Card } from '@/app/components/Card'
import { IssueForm } from './IssueForm'
import { IssueFormSkeleton } from './IssueFormSkeleton'

export interface IssueSuspenseProps {
  params?: Promise<{ id: string }>
}

const IssueComponent = async ({ params }: IssueSuspenseProps) => {
  const { id: issueId } = params ? await params : {}
  const userPromise = getAuthenticatedUser()
  const issuePromise = issueId ? getIssue(parseInt(issueId)) : Promise.resolve(undefined)

  const [user, issue] = await Promise.all([userPromise, issuePromise])
  
  if (!user) redirect(ROUTES.auth.login.href)
  if (issueId && !issue) notFound()
  if (issue && user.id !== issue.user.id) redirect(ROUTES.dashboard.href)

  return <IssueForm userId={user.id} issue={issue} />
}

export const IssueSuspense = (props: IssueSuspenseProps) => <Card>
  <Suspense fallback={<IssueFormSkeleton />}>
    <IssueComponent {...props} />
  </Suspense>
</Card>
