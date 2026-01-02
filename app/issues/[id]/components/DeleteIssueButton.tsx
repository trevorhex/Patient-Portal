'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2Icon } from 'lucide-react'
import { Button } from '@/app/components/Button'
import { deleteIssue } from '@/actions/issues'
import { ROUTES } from '@/config/routes'
import { useToast } from '@/hooks/useToast'

interface DeleteIssueButtonProps { id: number }

export const DeleteIssueButton = ({ id }: DeleteIssueButtonProps) => {
  const cancelRef = useRef<HTMLButtonElement>(null)
  const verifyDeleteRef = useRef<HTMLButtonElement>(null)
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showConfirm, setShowConfirm] = useState(false)
  const { showSuccess, showError } = useToast()

  const handleVerifyDelete = () => {
    setShowConfirm(true)
    setTimeout(() => cancelRef.current?.focus())
  }

  const handleCancel = () => {
    setShowConfirm(false)
    setTimeout(() => verifyDeleteRef.current?.focus())
  }

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        const result = await deleteIssue(id)

        if (!result.success) throw new Error(result.error || 'Failed to delete issue')

        showSuccess('Issue deleted successfully')
        router.refresh()
        router.push(ROUTES.issues.base.href)
      } catch (e) {
        showError('Failed to delete issue')
        console.error('Error deleting issue:', e)
      }
    })
  }

  if (showConfirm) {
    return (
      <div className="flex items-center space-x-2">
        <Button
          ref={cancelRef}
          variant="outline"
          size="sm"
          onClick={handleCancel}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={handleDelete}
          isLoading={isPending}
        >
          Delete
        </Button>
      </div>
    )
  }

  return (
    <Button ref={verifyDeleteRef} variant="outline" size="sm" onClick={handleVerifyDelete}>
      <span className="flex items-center">
        <Trash2Icon size={16} className="mr-1" />
        Delete
      </span>
    </Button>
  )
}
