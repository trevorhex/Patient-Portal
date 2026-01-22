'use client'

import { useRef, useCallback } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { getMediaQueryMatch } from '@/lib/breakpoints'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export const useVirusAnimation = () => {
  const virusRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  const animate = useCallback(() => {
    const tl = gsap.timeline()
    const isMd = getMediaQueryMatch('md')
    const hero = document.querySelector('[data-component="about-hero"]')
    const mission = document.querySelector('[data-component="about-mission"]')

    /*
    * Side entrance
    */
    document.body.style.overflow = 'hidden' // let animation complete

    tl.fromTo(virusRef.current, {
      y: gsap.utils.random(-100, 100),
      right: '-10%',
      scale: gsap.utils.random(0.5, 0.8),
    }, {
      y: 0,
      right: isMd ? '30vw' : '50vw',
      scale: 1,
      duration: 0.7,
      ease: 'power1.out',
      onComplete: () => { document.body.style.overflow = '' }
    })

    /*
    * Move left(md)/up(mobile) on scroll
    */
    gsap.fromTo(virusRef.current, {
      right: isMd ? '30vw' : '50vw',
      scale: 1
    }, {
      right: isMd ? '70vw' : '50vw',
      top: isMd ? '50vh' : '20vh',
      scale: 0.7,
      ease: 'power1.inOut',
      scrollTrigger: {
        trigger: hero,
        start: 'bottom 90%',
        end: 'bottom 40%',
        scrub: true
      }
    })

    /*
    * Move off screen on scroll
    */
    gsap.fromTo(virusRef.current, {
      right: isMd ? '70vw' : '50vw',
      scale: 0.7
    }, {
      right: isMd ? '-10%' : '-40%',
      top: isMd ? '80vh' : '20vh',
      scale: 1.3,
      ease: 'power1.inOut',
      scrollTrigger: {
        trigger: mission,
        start: isMd ? 'bottom 75%' : 'bottom 85%',
        end: isMd ? 'bottom top' : 'bottom 60%',
        scrub: true
      }
    })
  }, [])

  useGSAP(() => {
    if (reduceMotion || !virusRef.current) return

    animate()
  }, { dependencies: [reduceMotion], scope: virusRef })

  return { virusRef }
}
