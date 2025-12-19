'use client'

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Issue, ISSUE_STATUS, ISSUE_PRIORITY, getOptions } from '@/db/schema'
import { Button } from '@/app/components/Button'
import {
  Form,
  FormGroup,
  FormLabel,
  FormInput,
  FormTextarea,
  FormSelect,
  FormError,
  errorClass,
  inputErrorClass
} from '@/app/components/Form'
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
          router.push(isEditing ? ROUTES.issues.view(issue!.id).href : ROUTES.dashboard.href)
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
    <Form action={formAction}>
      {state?.message && !state.success && (
        <FormError className="mb-4">
          {state.message}
        </FormError>
      )}

      <FormGroup>
        <FormLabel htmlFor="title">Title</FormLabel>
        <FormInput
          id="title"
          name="title"
          placeholder="Issue title"
          defaultValue={issue?.title ?? ''}
          required
          minLength={3}
          maxLength={100}
          disabled={isPending}
          aria-describedby="title-error"
          className={state?.errors?.title ? inputErrorClass : ''}
        />
        {state?.errors?.title &&
          <p id="title-error" className={errorClass}>{state.errors.title[0]}</p>}
      </FormGroup>

      <FormGroup>
        <FormLabel htmlFor="description">Description</FormLabel>
        <FormTextarea
          id="description"
          name="description"
          placeholder="Describe the issue..."
          rows={4}
          defaultValue={issue?.description || ''}
          disabled={isPending}
          aria-describedby="description-error"
          className={state?.errors?.description ? inputErrorClass : ''}
        />
        {state?.errors?.description &&
          <p id="description-error" className={errorClass}>{state.errors.description[0]}</p>}
      </FormGroup>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormGroup>
          <FormLabel htmlFor="status">Status</FormLabel>
          <FormSelect
            id="status"
            name="status"
            defaultValue={issue?.status || 'backlog'}
            options={statusOptions}
            disabled={isPending}
            required
            aria-describedby="status-error"
            className={state?.errors?.status ? inputErrorClass: ''}
          />
          {state?.errors?.status &&
            <p id="status-error" className={errorClass}>{state.errors.status[0]}</p>}
        </FormGroup>

        <FormGroup>
          <FormLabel htmlFor="priority">Priority</FormLabel>
          <FormSelect
            id="priority"
            name="priority"
            defaultValue={issue?.priority || 'medium'}
            options={priorityOptions}
            disabled={isPending}
            required
            aria-describedby="priority-error"
            className={state?.errors?.priority ? inputErrorClass: ''}
          />
          {state?.errors?.priority &&
            <p id="priority-error" className={errorClass}>{state.errors.priority[0]}</p>}
        </FormGroup>
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
