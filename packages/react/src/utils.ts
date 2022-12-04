import * as React from 'react'
import { useState, useRef, useEffect, useCallback } from 'react'
import warning from 'tiny-warning'

type AnyFunction = (...args: any[]) => unknown

// Helper function for render props. Sets a function to be called, plus any additional functions passed in
export const callAll =
  (...fns: AnyFunction[]) =>
  (...args: any[]): void =>
    fns.forEach((fn) => fn && fn(...args))

// https://github.com/mui-org/material-ui/blob/da362266f7c137bf671d7e8c44c84ad5cfc0e9e2/packages/material-ui/src/styles/transitions.js#L89-L98
export function getAutoHeightDuration(height: number | string): number {
  if (!height || typeof height === 'string') {
    return 0
  }

  const constant = height / 36

  // https://www.wolframalpha.com/input/?i=(4+%2B+15+*+(x+%2F+36+)+**+0.25+%2B+(x+%2F+36)+%2F+5)+*+10
  return Math.round((4 + 15 * constant ** 0.25 + constant / 5) * 10)
}

/**
 * React.Ref uses the readonly type `React.RefObject` instead of
 * `React.MutableRefObject`, We pretty much always assume ref objects are
 * mutable (at least when we create them), so this type is a workaround so some
 * of the weird mechanics of using refs with TS.
 */
export type AssignableRef<ValueType> =
  | {
      bivarianceHack(instance: ValueType | null): void
    }['bivarianceHack']
  | React.MutableRefObject<ValueType | null>

export function assignRef<RefValueType = any>(
  ref: AssignableRef<RefValueType> | null | undefined,
  value: any
) {
  if (ref == null) return
  if (typeof ref === 'function') {
    ref(value)
  } else {
    try {
      ref.current = value
    } catch (error) {
      throw new Error(`Cannot assign value "${value}" to ref "${ref}"`)
    }
  }
}

/**
 * Passes or assigns a value to multiple refs (typically a DOM node). Useful for
 * dealing with components that need an explicit ref for DOM calculations but
 * also forwards refs assigned by an app.
 *
 * @param refs Refs to fork
 */
export function mergeRefs<RefValueType = any>(
  ...refs: (AssignableRef<RefValueType> | null | undefined)[]
) {
  if (refs.every((ref) => ref == null)) {
    return null
  }
  return (node: any) => {
    refs.forEach((ref) => {
      assignRef(ref, node)
    })
  }
}

export function useEvent<T extends (...args: any[]) => any>(callback?: T) {
  const ref = useRef<T | undefined>(callback)

  useEffect(() => {
    ref.current = callback
  })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(((...args: any) => ref.current?.(...args)) as T, [])
}

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
      'useCollapse is changing from controlled to uncontrolled. useCollapse should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled collapse for the lifetime of the component. Check the `isExpanded` prop.'
    )
    warning(
      !(!initiallyControlled.current && value != null),
      'useCollapse is changing from uncontrolled to controlled. useCollapse should not switch from uncontrolled to controlled (or vice versa). Decide between using a controlled or uncontrolled collapse for the lifetime of the component. Check the `isExpanded` prop.'
    )
  }, [value])

  return [effectiveValue as T, onChange]
}

export const useLayoutEffect =
  typeof window !== 'undefined' ? React.useLayoutEffect : useEffect
