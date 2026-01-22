'use client'

import { useRef, useCallback } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useReducedMotion } from '@/hooks/useReducedMotion'

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger)

export const useHeroAnimation = () => {
  const heroRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)
  const reduceMotion = useReducedMotion()

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
      trigger: heroRef.current,
      start: 'bottom 80%',
      end: 'bottom 80%',
      animation: tl,
      toggleActions: 'none reverse play none'
    })

    tl.play()

    /*
    * Heading accent flicker
    */
    const colorTl = gsap.timeline({ repeat: -1 })

    gsap.set(split.words[0], { color: '#9810fa', textShadow: '0 0 5px #9810fa' })
    
    const createFlicker = () => {
      const flickerCount = gsap.utils.random(1, 3, 1)
      
      for (let j = 0; j < flickerCount; j++) {
        colorTl.to(split.words[0], {
          duration: gsap.utils.random(0.05, 0.15),
          color: '#6e11b0',
          textShadow: '0 0 2px #6e11b0',
          ease: 'power2.inOut'
        })
        .to(split.words[0], {
          duration: gsap.utils.random(0.05, 0.15),
          color: '#9810fa',
          textShadow: '0 0 5px #9810fa, 0 0 15px #9810fa55',
          ease: 'power2.inOut'
        })
      }

      colorTl.to(split.words[0], {
        duration: gsap.utils.random(1, 4),
        color: '#9810fa',
        textShadow: '0 0 6px #9810fa',
      })

      if (Math.random() < 0.3) {
        colorTl.to(split.words[0], {
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

  const animateTagline = useCallback(() => {
    /*
    * Tagline fad in
    */
    const split = new SplitText(taglineRef.current, { type: 'lines' })
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
      trigger: heroRef.current,
      start: 'bottom 80%',
      end: 'bottom 80%',
      animation: tl,
      toggleActions: 'none reverse play none'
    })

    tl.play()
  }, [])

  useGSAP(() => {
    if (reduceMotion || !heroRef.current) return

    headingRef.current && animateHeading()
    taglineRef.current && animateTagline()
  }, { dependencies: [reduceMotion], scope: heroRef })

  return { heroRef, headingRef, taglineRef }
}
