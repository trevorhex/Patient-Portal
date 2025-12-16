import { ReactNode } from 'react'
import { Timestamp } from './components/TimeStamp'

export const Footer = ({ children = null, className }: { children?: ReactNode, className?: string }) => {
  return <footer className={className}>
    {children}
    <div className="border-t border-zinc-600 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          &copy; <Timestamp /> Patient Portal. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
}