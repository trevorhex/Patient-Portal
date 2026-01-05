import '@testing-library/jest-dom'
import { vi } from 'vitest'
import { createElement, CSSProperties, ReactNode } from 'react'

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    pathname: '/',
    params: {}
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams()
}))

vi.mock('next/image', () => ({
  default: (props: {
    src: string
    alt: string
    width?: number
    height?: number
    className?: string
    priority?: boolean
    quality?: number
    style?: CSSProperties
  }) => createElement('img', props)
}))

vi.mock('next/link', () => ({
  default: (props: {
    href: string
    children: ReactNode
    className?: string
    prefetch?: boolean
    replace?: boolean
    scroll?: boolean
    role?: string
  }) => createElement('a', { ...props, role: props.role ?? 'link' }, props.children)
}))
