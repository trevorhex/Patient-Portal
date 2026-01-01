'use client'

import { use } from 'react'
import { Card } from '@/app/components/Card'
import { FormGroup, FormLabel } from '@/app/components/Form'
import { ProfileContext } from '../../../store'
import { wizardFormPages } from '../config'
import { FormField } from './FormField'

export const FormPage = () => {
  const { state: { currentStep } } = use(ProfileContext).wizard
  const page = wizardFormPages[currentStep]

  return (
    <Card className="space-y-8 py-8">
      <div className="text-center">
        <h2 className="text-xl font-bold mb-5">{page.title}</h2>
        <p>{page.description}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {page.fields.map((field, i) => (
          <FormGroup key={i}>
            <FormLabel htmlFor={field.name}>{field.label}</FormLabel>
            <FormField {...field} />
            {/* {state?.errors?.description &&
              <p id="description-error" className={errorClass}>{state.errors.description[0]}</p>} */}
          </FormGroup>
        ))}

      </div>
    </Card>
  )
}
