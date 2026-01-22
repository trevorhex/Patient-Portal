import { useState, useEffect } from 'react'
import { getMediaQuery, Breakpoint, BreakpointQuery } from '@/lib/breakpoints'

export const useBreakpoint = (query: BreakpointQuery, betweenQuery?: Breakpoint): boolean => {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mediaQuery = getMediaQuery(query, betweenQuery)
    const mediaQueryList = window.matchMedia(mediaQuery)
    const handleChange = (event: MediaQueryListEvent) => setMatches(event.matches)

    setMatches(mediaQueryList.matches)
    mediaQueryList.addEventListener('change', handleChange);

    return () => {
      mediaQueryList.removeEventListener('change', handleChange)
    }
  }, [query])

  return matches
}
