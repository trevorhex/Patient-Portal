'use client'
import { use } from 'react'
import { WizardContext } from '../store/provider' 

export const Progress = () => {
  const { state: { totalSteps, currentStep } } = use(WizardContext)
  return (
    <div className="flex justify-center">
      <div className="inline-flex relative items-center gap-4">
        <span className="absolute h-0.5 top-[50%] left-1 right-1 bg-zinc-400 -mt-px z-0" />
        {Array.from({ length: totalSteps }).map((_, i) => (
          <span key={i}
            className={`w-3 h-3 mx-1 rounded-full z-1 relative ${i <= currentStep ? 'bg-green-400' : 'bg-zinc-400'}`}
          />
        ))}
      </div>
    </div>
  )
}
