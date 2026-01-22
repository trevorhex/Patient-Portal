'use client'

import { useRef, useCallback } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useReducedMotion } from '@/hooks/useReducedMotion'

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger)

export type UseContentAnimationOptions = {
  scrollTrigger?: {
    start?: string
    end?: string
    toggleActions?: string
    markers?: boolean
  }
  flickerIndex?: number
  autoPlay?: boolean
}

export const useContentAnimation = (options?: UseContentAnimationOptions) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const contentRef = useRef<HTMLParagraphElement>(null)
  const reduceMotion = useReducedMotion()

  const {
    flickerIndex = 0,
    autoPlay = false
  } = options || {}

  const scrollTrigger = {
    start: 'top 60%',
    end: 'bottom 30%',
    toggleActions: 'play none none none',
    ...options?.scrollTrigger ?? {}
  }

  const animateHeading = useCallback(() => {
    /*
    * Heading fade in/rotation
    */
    const split = new SplitText(headingRef.current, { type: 'words,chars' })
    const tl = gsap.timeline()
  
    tl.from(split.chars, {
      duration: 0.5,
      opacity: 0,
      yPercent: 'random(-200, 200)',
      rotationX: 'random(-90, 90)',
      rotationY: 'random(-90, 90)',
      rotationZ: 'random(-45, 45)',
      ease: 'power2.out',
      stagger: {
        amount: 0.5,
        from: 'random'
      }
    })
  
    ScrollTrigger.create({
      trigger: containerRef.current,
      animation: tl,
      ...scrollTrigger
    })

    autoPlay && tl.play()

    /*
    * Heading accent flicker
    */
    const colorTl = gsap.timeline({ repeat: -1 })

    gsap.set(split.words[flickerIndex], { color: '#9810fa', textShadow: '0 0 5px #9810fa' })
    
    const createFlicker = () => {
      const flickerCount = gsap.utils.random(1, 3, 1)
      
      for (let j = 0; j < flickerCount; j++) {
        colorTl.to(split.words[flickerIndex], {
          duration: gsap.utils.random(0.05, 0.15),
          color: '#6e11b0',
          textShadow: '0 0 2px #6e11b0',
          ease: 'power2.inOut'
        })
        .to(split.words[flickerIndex], {
          duration: gsap.utils.random(0.05, 0.15),
          color: '#9810fa',
          textShadow: '0 0 5px #9810fa, 0 0 15px #9810fa55',
          ease: 'power2.inOut'
        })
      }

      colorTl.to(split.words[flickerIndex], {
        duration: gsap.utils.random(1, 4),
        color: '#9810fa',
        textShadow: '0 0 6px #9810fa',
      })

      if (Math.random() < 0.3) {
        colorTl.to(split.words[flickerIndex], {
          duration: gsap.utils.random(0.3, 0.6),
          color: '#6e11b0',
          textShadow: '0 0 2px #6e11b0',
        })
      }
    }
    
    for (let i = 0; i < 20; i++) {
      createFlicker()
    }
    
    colorTl.call(() => {
      colorTl.restart()
    })
  }, [])

  const animateContent = useCallback(() => {
    /*
    * Content fade in
    */
    const split = new SplitText(contentRef.current, { type: 'lines' })
    const tl = gsap.timeline()

    tl.from(split.lines, {
      duration: 0.6,
      opacity: 0,
      yPercent: 40,
      ease: 'power2.out',
      stagger: 0.3,
      delay: 0.5
    })

    ScrollTrigger.create({
      trigger: containerRef.current,
      animation: tl,
      ...scrollTrigger
    })

    autoPlay && tl.play()
  }, [])

  useGSAP(() => {
    if (reduceMotion || !containerRef.current) return

    headingRef.current && animateHeading()
    contentRef.current && animateContent()
  }, { dependencies: [reduceMotion], scope: containerRef })

  return { containerRef, headingRef, contentRef }
}
