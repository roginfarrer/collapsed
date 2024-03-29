import { useState, useEffect } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return
    }

    const mediaQueryList = window.matchMedia(QUERY)
    // Set the true initial value, now that we're on the client:
    setPrefersReducedMotion(mediaQueryList.matches)

    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    // Fallback to addListener/removeListener for older browsers, #152
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', listener)
      return () => {
        mediaQueryList.removeEventListener('change', listener)
      }
    } else if (mediaQueryList.addListener) {
      mediaQueryList.addListener(listener)
      return () => {
        mediaQueryList.removeListener(listener)
      }
    }
    return undefined
  }, [])
  return prefersReducedMotion
}
