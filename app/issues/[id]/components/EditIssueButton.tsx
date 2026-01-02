'use client'

import { KeyboardEvent } from 'react'
import { Edit2Icon } from 'lucide-react'
import { Button, ButtonProps } from '@/app/components/Button'
import { useFocus } from '@/hooks/useFocus'
import { MAIN } from '@/app/issues/components/IssueLayout'

export const EditIssueButton = ({ href }: ButtonProps) => {
  const { focusOnKeyDown } = useFocus()
  
  const handleKeyDown = (e: KeyboardEvent) => focusOnKeyDown(e, MAIN, href)

  return (
    <Button variant="outline" size="sm" className="flex items-center" href={href} onKeyDown={handleKeyDown}>
      <Edit2Icon size={16} className="mr-1" /> Edit
    </Button>
  )
}
