'use client'

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { getOptions } from '@/db/schema'
import { Issue, ISSUE_STATUS, ISSUE_PRIORITY } from '@/db/types'
import { Button } from '@/app/components/Button'
import { Form, FormInput, FormTextarea, FormSelect, FormError } from '@/app/components/Form'
import { Priority, Status } from '@/types/issue'
import { ROUTES } from '@/config/routes'
import { createIssue, updateIssue, ActionResponse } from '@/actions/issues'

export interface IssueFormProps {
  issue?: Issue
  userId: string
  isEditing?: boolean
}

const initialState: ActionResponse = {
  success: false,
  message: '',
  errors: undefined,
}

export const IssueForm = ({ issue, userId }: IssueFormProps) => {
  const router = useRouter()
  const isEditing = !!issue

  const [state, formAction, isPending] = useActionState<ActionResponse, FormData>(
    async (prevState: ActionResponse, formData: FormData) => {  
      const data = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        status: formData.get('status') as Status,
        priority: formData.get('priority') as Priority,
        userId
      }

      try {
        const result = isEditing
          ? await updateIssue(Number(issue!.id), data)
          : await createIssue(data)

        if (result.success) {
          toast.success(`Issue ${isEditing ? 'updated' : 'created'} successfully`)
          router.refresh()
          router.push(isEditing ? ROUTES.issues.view(issue!.id).href : ROUTES.issues.base.href)
        }

        return result
      } catch (err) {
        return {
          success: false,
          message: (err as Error).message || 'An error occurred',
          errors: undefined
        }
      }
    },
    initialState
  )

  const statusOptions = getOptions(ISSUE_STATUS)
  const priorityOptions = getOptions(ISSUE_PRIORITY)

  return (
    <Form action={formAction} className="w-full">
      {state?.message && !state.success && (
        <FormError className="mb-4">
          {state.message}
        </FormError>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          name="title"
          label="Title"
          placeholder="Issue title"
          defaultValue={issue?.title ?? ''}
          minLength={3}
          maxLength={100}
          disabled={isPending}
          invalid={!!state?.errors?.title}
          hint={state.errors?.title?.[0]}
          required
          fieldClassName="md:col-span-2"
        />

        <FormTextarea
          name="description"
          label="Description"
          placeholder="Describe the issue..."
          defaultValue={issue?.description ?? ''}
          rows={6}
          disabled={isPending}
          invalid={!!state?.errors?.description}
          hint={state.errors?.description?.[0]}
          required
          fieldClassName="md:col-span-2"
        />

        <FormSelect
          name="status"
          label="Status"
          options={statusOptions}
          defaultValue={issue?.status ?? 'backlog'}
          disabled={isPending}
          invalid={!!state?.errors?.status}
          hint={state.errors?.status?.[0]}
          required
        />

        <FormSelect
          name="priority"
          label="Priority"
          options={priorityOptions}
          defaultValue={issue?.priority ?? 'medium'}
          disabled={isPending}
          invalid={!!state?.errors?.priority}
          hint={state.errors?.priority?.[0]}
          required
        />
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" isLoading={isPending}>
          {isEditing ? 'Update Issue' : 'Create Issue'}
        </Button>
      </div>
    </Form>
  )
}
