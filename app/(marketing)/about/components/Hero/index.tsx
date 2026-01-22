'use client'

import { useHeroAnimation } from './hooks/useHeroAnimation'

const tagline = 'We\'re dedicated to improving patient outcomes with innovative, secure, and user-friendly solutions.'

export const Hero = () => {
  const { heroRef, headingRef, taglineRef } = useHeroAnimation()

  return (
    <div ref={heroRef} className="flex flex-col flex-1 min-h-[calc(100vh-64px)] justify-center mb-[100vh]">
      <div className="mx-auto max-w-7xl w-full px-6 sm:px-10 -mt-12">
        <h1 ref={headingRef} className="text-5xl font-bold mb-14" aria-label="Transforming Healthcare">
          Transforming Healthcare
        </h1>
        <p ref={taglineRef} className="max-w-[50%] text-xl leading-[1.8]" aria-label={tagline}>
          {tagline}
        </p>
      </div>
    </div>
  )
}
