'use client'

import { usePathname } from 'next/navigation'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { ROUTES } from '@/config/routes'

gsap.registerPlugin(useGSAP)

export const ANIMATE_ID = 'app-header'

export const HeaderAnimation = () => {
  const reduceMotion = useReducedMotion()
  const pathname = usePathname()
  const pathsToAnimate = [
    ROUTES.marketing.product[0].href
  ]

  useGSAP(() => {
    if (reduceMotion || !pathsToAnimate.includes(pathname)) return

    gsap.fromTo(`[data-animate="${ANIMATE_ID}"]`, 
      { opacity: 0, y: -36 }, 
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.8 }
    )
  }, [pathname])

  return null
}
