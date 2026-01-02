'use client'

import { use, useRef, useEffect } from 'react'
import { Card } from '@/app/components/Card'
import { ProfileContext } from '../../../store'
import { wizardFormPages } from '../config'
import { FormField } from './FormField'

export const FormPage = () => {
  const { state: { currentStep } } = use(ProfileContext).wizard
  const page = wizardFormPages[currentStep]
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    cardRef.current?.focus()
  }, [currentStep])

  return (
    <Card ref={cardRef} tabIndex={0} aria-labelledby="wizard-form-page-title" className="space-y-8 py-8">
      <div className="text-center" id="wizard-form-page-title">
        <h2 className="text-xl font-bold mb-5">{page.title}</h2>
        <p>{page.description}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {page.fields.map((field, i) => <FormField key={i} {...field} />)}
      </div>
    </Card>
  )
}
