'use client'

import { DotLottieReact as Lottie } from '@lottiefiles/dotlottie-react'
import { cn } from '@/lib/utils'
import { useVirusAnimation } from './hooks/useVirusAnimation'

export const Virus = () => {
  const { virusRef } = useVirusAnimation()
  return (
    <div
      ref={virusRef}
      className={cn(
        'fixed z-0 top-[70vh] md:top-[50vh] right-[30vw] -translate-y-1/2 translate-x-1/2',
        'pointer-events-none select-none w-xl'
      )}
    >
      <Lottie
        src="/animations/virus.lottie"
        loop
        autoplay
        renderConfig={{ autoResize: true }}
      />
    </div>
  )
}
