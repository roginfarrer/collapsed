import { useState, useRef, useCallback, useEffect } from 'react'
import { warning } from './CollapseError'
import { useEvent } from './useEvent'

export function useControlledState<T>(
  value: T | undefined,
  defaultValue: T | undefined,
  callback?: (value: T) => void
): [T, (update: T | ((value: T) => T)) => void] {
  const [state, setState] = useState<T>(defaultValue as T)
  const initiallyControlled = useRef(typeof value !== 'undefined')
  const effectiveValue = initiallyControlled.current ? value : state
  const cb = useEvent(callback)

  const onChange = useCallback(
    (update: React.SetStateAction<T>) => {
      const setter = update as (value?: T) => T
      const newValue =
        typeof update === 'function' ? setter(effectiveValue) : update

      if (!initiallyControlled.current) {
        setState(newValue)
      }

      cb?.(newValue)
    },
    [cb, effectiveValue]
  )

  useEffect(() => {
    warning(
      !(initiallyControlled.current && value == null),
      '`isExpanded` state is changing from controlled to uncontrolled. useCollapse should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled collapse for the lifetime of the component. Check the `isExpanded` prop.'
    )
    warning(
      !(!initiallyControlled.current && value != null),
      '`isExpanded` state is changing from uncontrolled to controlled. useCollapse should not switch from uncontrolled to controlled (or vice versa). Decide between using a controlled or uncontrolled collapse for the lifetime of the component. Check the `isExpanded` prop.'
    )
  }, [value])

  return [effectiveValue as T, onChange]
}
