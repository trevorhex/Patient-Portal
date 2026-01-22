'use client'

import { useContentAnimation } from '@/hooks/animation/useContentAnimation'
import { PageContentSection } from '../PageContentSection'

export const Hero = () => {
  const refs = useContentAnimation({
    autoPlay: true
  })

  return (
    <PageContentSection
      {...refs}
      name="about-hero"
      heading="Transforming Healthcare"
      content="We are dedicated to improving patient outcomes with innovative, secure, and user-friendly solutions."
      className="flex flex-col flex-1 min-h-[calc(100vh-128px)] md:justify-center pt-32 sm:pt-56 md:pt-0"
    />
  )
}
