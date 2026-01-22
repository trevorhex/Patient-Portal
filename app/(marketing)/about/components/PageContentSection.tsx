import { Ref } from 'react'
import { cn } from '@/lib/utils'

export interface PageContentSectionProps {
  containerRef: Ref<HTMLDivElement>
  headingRef: Ref<HTMLHeadingElement>
  contentRef: Ref<HTMLParagraphElement>
  name?: string
  heading?: string
  content?: string
  side?: 'left' | 'right'
  className?: string
  headingEl?: 'h1' | 'h2' | 'h3'
}

export const PageContentSection = ({
  containerRef,
  headingRef,
  contentRef,
  name,
  heading,
  content,
  side,
  className,
  headingEl = 'h1'
}: PageContentSectionProps) => {
  const HeadingTag = headingEl
  
  return (
    <div
      ref={containerRef}
      className={cn('mx-auto max-w-7xl w-full px-6 sm:px-10', className)}
      data-component={name}
    >
      <div className={cn('md:max-w-[50%]', side === 'right' && 'ml-auto')}>
        {heading && <HeadingTag ref={headingRef} className={cn(
          'text-5xl lg:text-6xl font-bold mb-14 leading-[1.2]',
          headingEl === 'h2' && 'text-4xl lg:text-5xl leading-[1.3]'
        )} aria-label={heading}>
          {heading}
        </HeadingTag>}
        {content && <p ref={contentRef} className="text-xl leading-[1.8]" aria-label={content}>
          {content}
        </p>}
      </div>
    </div>
  )
}
