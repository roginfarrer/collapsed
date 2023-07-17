import { useState, useEffect } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQueryList = window.matchMedia(QUERY)
    // Set the true initial value, now that we're on the client:
    setPrefersReducedMotion(mediaQueryList.matches)

    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    // Fallback to addListener/removeListener for older browsers, #152
    (mediaQueryList.addEventListener ?? mediaQueryList.addListener)('change', listener)
    return () => {
      (mediaQueryList.removeEventListener ?? mediaQueryList.removeListener)('change', listener)
    }
  }, [])
  return prefersReducedMotion
}
