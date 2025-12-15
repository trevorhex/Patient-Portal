'use client'

import { useState, useLayoutEffect } from 'react'

export const Timestamp = () => {
  const [time, setTime] = useState<number | null>(null)

  useLayoutEffect(() => {
    setTime(new Date().getFullYear())
  }, [])

  return time
}
