import { MutableRefObject, RefObject, useEffect } from 'react'
import { CollapseError, warning } from './CollapseError'

export { useEvent } from './useEvent'
export { useControlledState } from './useControlledState'
export { usePrefersReducedMotion } from './usePrefersReducedMotion'
export { useId } from './useId'
export * from './setAnimationTimeout'

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
  | MutableRefObject<ValueType | null>

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = (): void => {}

export function getElementHeight(el: RefObject<HTMLElement>): number {
  if (!el?.current) {
    warning(
      true,
      `Was not able to find a ref to the collapse element via \`getCollapseProps\`. Ensure that the element exposes its \`ref\` prop. If it exposes the ref prop under a different name (like \`innerRef\`), use the \`refKey\` property to change it. Example:

const collapseProps = getCollapseProps({refKey: 'innerRef'})`
    )
    return 0
  }
  // scrollHeight will give us the height of the element, even if it's not visible.
  // clientHeight, offsetHeight, nor getBoundingClientRect().height will do so
  return el.current.scrollHeight
}

// https://github.com/mui-org/material-ui/blob/da362266f7c137bf671d7e8c44c84ad5cfc0e9e2/packages/material-ui/src/styles/transitions.js#L89-L98
export function getAutoHeightDuration(height: number | string): number {
  if (!height || typeof height === 'string') {
    return 0
  }

  const constant = height / 36

  // https://www.wolframalpha.com/input/?i=(4+%2B+15+*+(x+%2F+36+)+**+0.25+%2B+(x+%2F+36)+%2F+5)+*+10
  return Math.round((4 + 15 * constant ** 0.25 + constant / 5) * 10)
}

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
      throw new CollapseError(`Cannot assign value "${value}" to ref "${ref}"`)
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

export function usePaddingWarning(element: RefObject<HTMLElement>): void {
  // @ts-expect-error we do use it in dev
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let warn = (el?: RefObject<HTMLElement>): void => {}

  if (process.env.NODE_ENV !== 'production') {
    warn = (el) => {
      if (!el?.current) {
        return
      }
      const { paddingTop, paddingBottom } = window.getComputedStyle(el.current)
      const hasPadding =
        (paddingTop && paddingTop !== '0px') ||
        (paddingBottom && paddingBottom !== '0px')

      warning(
        !hasPadding,
        `Padding applied to the collapse element will cause the animation to break and not perform as expected. To fix, apply equivalent padding to the direct descendent of the collapse element. Example:

Before:   <div {...getCollapseProps({style: {padding: 10}})}>{children}</div>

After:   <div {...getCollapseProps()}>
             <div style={{padding: 10}}>
                 {children}
             </div>
          </div>`
      )
    }
  }

  useEffect(() => {
    warn(element)
  }, [element])
}
