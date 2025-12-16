import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/dal'
import { ROUTES } from '@/config/routes'
import { IssueForm } from '../../components/IssueForm'


const NewIssueComponent = async () => {
  const user = await getCurrentUser()

  if (!user) redirect(ROUTES.auth.login.href)

  return <IssueForm userId={user.id} />
}

export const NewIssue = () => <Suspense fallback={<div>Loading...</div>}>
  <NewIssueComponent />
</Suspense>
