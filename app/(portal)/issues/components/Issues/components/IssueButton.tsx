'use client'

import { KeyboardEvent } from 'react'
import { PlusIcon } from 'lucide-react'
import { Button, ButtonProps } from '@/app/components/Button'
import { useFocus } from '@/hooks/useFocus'
import { MAIN } from '@/app/issues/components/IssueLayout'

export const IssueButton = ({ href, children }: ButtonProps) => {
  const { focusOnKeyDown } = useFocus()
  
  const handleKeyDown = (e: KeyboardEvent) => focusOnKeyDown(e, MAIN, href)

  return (
    <Button href={href} onKeyDown={handleKeyDown}>
      <span className="flex items-center">
        <PlusIcon size={18} className="mr-2" />
        {children}
      </span>
    </Button>
  )
}
