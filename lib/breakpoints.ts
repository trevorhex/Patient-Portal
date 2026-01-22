export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

export type Breakpoint = keyof typeof breakpoints
export type BreakpointQuery = Breakpoint | `${Breakpoint}-down`

export const getMediaQuery = (query: BreakpointQuery, betweenQuery?: Breakpoint): string => {
  if (query.endsWith('-down')) {
    const bp = query.replace('-down', '') as Breakpoint
    return `(max-width: ${breakpoints[bp] - 1}px)`
  } else {
    const bp = query as Breakpoint
    
    if (betweenQuery) {
      return `(min-width: ${breakpoints[bp]}px) and (max-width: ${breakpoints[betweenQuery] - 1}px)`
    } else {
      return `(min-width: ${breakpoints[bp]}px)`
    }
  }
}

export const getMediaQueryMatch = (query: BreakpointQuery, betweenQuery?: Breakpoint): boolean =>
  window.matchMedia(getMediaQuery(query, betweenQuery)).matches
