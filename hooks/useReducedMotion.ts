import { useEffect, useState } from 'react'

const PREFERS_QUERY =  '(prefers-reduced-motion: reduce)'

export const useReducedMotion = () => {
	const [prefersReducedMotion, setPrefersReducedMotion] = useState(true)

	useEffect(() => {
		const mediaQueryList = window.matchMedia(PREFERS_QUERY)
		const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)

		setPrefersReducedMotion(mediaQueryList.matches)

		mediaQueryList.addEventListener('change', listener)
		return () => mediaQueryList.removeEventListener('change', listener)
	}, [])

	return prefersReducedMotion
}
