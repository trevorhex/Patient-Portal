'use client'

import { useContentAnimation } from '@/hooks/animation/useContentAnimation'
import { PageContentSection } from '../PageContentSection'

export const Mission = () => {
  const refs = useContentAnimation({
    flickerIndex: 4
  })

  return (
    <PageContentSection
      {...refs}
      name="about-mission"
      headingEl="h2"
      heading="We Reach Health Goals Together."
      content="Our mission sit amet consectetur adipisicing elit sed similique corrupti corporis rerum your healthcare."
      side="right"
      className="py-28"
    />
  )
}
