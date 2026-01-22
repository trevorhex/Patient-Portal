'use client'

import { useHeroAnimation } from './hooks/useHeroAnimation'

export const Hero = () => {
  const { heroRef, headingRef, taglineRef } = useHeroAnimation()

  return (
    <div ref={heroRef} className="flex flex-col flex-1 min-h-[calc(100vh-64px)] justify-center mb-[100vh]">
      <div className="mx-auto max-w-7xl w-full px-6 sm:px-10 -mt-12">
        <h1 ref={headingRef} className="text-5xl font-bold mb-14">
          Transforming Healthcare
        </h1>
        <p ref={taglineRef} className="max-w-[50%] text-xl leading-[1.8]">
          We&apos;re dedicated to improving patient outcomes with innovative, secure, and user-friendly solutions.
        </p>
      </div>
    </div>
  )
}
