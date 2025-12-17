import { ReactNode } from 'react'

export interface MarketingLayoutProps {
  children: ReactNode
  heading?: string
  description?: string
}

export const MarketingLayout = ({ children, heading, description }: MarketingLayoutProps) => {
  return (
    <div className="px-4 py-16">
      <div className="max-w-3xl mx-auto text-center mb-18">
        {heading && <h1 className="text-4xl font-bold mb-4 text-white">{heading}</h1>}
        {description && <p className="text-xl text-gray-400">{description}</p>}
      </div>

      {children}
    </div>
  )
}
