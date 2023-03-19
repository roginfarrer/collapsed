import { useRef, useEffect, useCallback } from 'react'

export function useEvent<T extends (...args: any[]) => any>(callback?: T) {
  const ref = useRef<T | undefined>(callback)

  useEffect(() => {
    ref.current = callback
  })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(((...args: any) => ref.current?.(...args)) as T, [])
}
