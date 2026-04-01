'use client'

import { useState, useEffect } from 'react'
import Desktop from './components/Desktop'
import MobileGate from './components/MobileGate'

export default function Home() {
  const [isMobile, setIsMobile] = useState(true) // default to mobile (hide desktop)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  if (isMobile) return <MobileGate />
  return <Desktop />
}
