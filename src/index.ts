import React, {
  useEffect,
  useRef,
  useCallback,
  TransitionEventHandler,
} from 'react'
import {
  noop,
  callAll,
  getElementHeight,
  getAutoHeightDuration,
  usePaddingWarning,
  useControlledState,
  useId,
  mergeRefs,
} from './utils'
import { CSSProperties } from 'styled-components'

export { useCollapse } from './useCollapse'

const easeInOut = 'cubic-bezier(0.4, 0, 0.2, 1)'

const useLayoutEffect =
  typeof window === 'undefined' ? useEffect : React.useLayoutEffect

function getCollapsedStyles(height: string) {
  const collapsedStyles = {
    display: height === '0px' ? 'none' : 'block',
    height: height,
    overflow: 'hidden',
  }
  return collapsedStyles
}

export interface UseCollapseOptions {
  /** If true, the collapse element is expanded */
  isExpanded?: boolean
  /** If true, the collapse element will initialize expanded */
  defaultExpanded?: boolean
  /** Height in pixels that the collapse element collapses to */
  collapsedHeight?: number
  /** Timing function for the transition */
  easing?: string
  /**
   * Duration of the expand/collapse animation.
   * If 'auto', the duration will be calculated based on the height of the collapse element
   */
  duration?: number | 'auto'
  /** Handler called when the collapse element begins the collapse transition */
  onCollapseStart?: () => void
  /** Handler called when the collapse element ends the collapse transition */
  onCollapseEnd?: () => void
  /** Handler called when the collapse element begins the expand transition */
  onExpandStart?: () => void
  /** Handler called when the collapse element ends the expand transition */
  onExpandEnd?: () => void
  /** If true, the animation will be disabled. Useful for disabling if the user prefers reduced motion */
  hasDisabledAnimation?: boolean
  /** Unique ID used for accessibility */
  id?: string
  onExpandedChange?: (state: 'expanding' | 'collapsing') => void
}

function useCollapse({
  duration,
  easing = easeInOut,
  isExpanded: configIsExpanded,
  defaultExpanded = false,
  hasDisabledAnimation = false,
  ...initialConfig
}: UseCollapseOptions = {}) {
  const [isExpanded, setExpanded] = useControlledState(
    configIsExpanded,
    defaultExpanded
  )
  const isMounted = useIsMounted()
  const uniqueId = useId()
  const el = useRef<HTMLElement | null>(null)
  usePaddingWarning(el)
  const collapsedHeight = `${initialConfig.collapsedHeight || 0}px`
  const panelId = `react-collapsed-panel-${uniqueId}`
  const toggleId = `react-collapsed-toggle-${uniqueId}`

  const insertStyles = useCallback((styles: Partial<CSSStyleDeclaration>) => {
    if (el.current) {
      for (const property in styles) {
        el.current.style[property] = styles[property]!
      }
    }
  }, [])

  const getTransition = useCallback(
    (height: number | string) => {
      if (hasDisabledAnimation) {
        return ''
      }
      const _duration =
        duration === 'auto' ? getAutoHeightDuration(height) : duration
      return `height ${_duration}ms ${easing}`
    },
    [duration, easing, hasDisabledAnimation]
  )

  useLayoutEffect(() => {
    if (!el.current) {
      return
    }

    if (!isExpanded || !isMounted.current) {
      // Set collapsed styles on mount, without transition
      insertStyles(getCollapsedStyles(collapsedHeight))
      return
    }

    if (isExpanded) {
      requestAnimationFrame(() => {
        insertStyles({
          display: 'block',
          overflow: 'hidden',
        })
        requestAnimationFrame(() => {
          if (el.current) {
            const height = getElementHeight(el)
            // Order important! So setting properties directly
            el.current.style.transition = getTransition(height)
            el.current.style.height = `${height}px`
          }
        })
      })
    } else {
      requestAnimationFrame(() => {
        const height = getElementHeight(el)
        insertStyles({
          transition: getTransition(height),
          height: `${height}px`,
        })
        requestAnimationFrame(() => {
          insertStyles({
            height: collapsedHeight,
            overflow: 'hidden',
          })
        })
      })
    }
  }, [isExpanded, collapsedHeight, insertStyles, getTransition, isMounted])

  const handleTransitionEnd: TransitionEventHandler = (e) => {
    // Sometimes onTransitionEnd is triggered by another transition,
    // such as a nested collapse panel transitioning. But we only
    // want to handle this if this component's element is transitioning
    if (e.target !== el.current || e.propertyName !== 'height' || !el.current) {
      return
    }

    if (isExpanded) {
      insertStyles({
        height: '',
        overflow: '',
        transition: '',
        display: '',
      })
    } else {
      insertStyles({
        ...getCollapsedStyles(collapsedHeight),
        transition: '',
      })
    }
  }

  function getToggleProps(
    props: {
      disabled?: boolean
      onClick?: (e: MouseEvent) => void
      [key: string]: unknown
    } = {}
  ) {
    const { disabled = false, onClick = noop, ...rest } = props
    return {
      type: 'button',
      role: 'button',
      id: toggleId,
      'aria-controls': panelId,
      'aria-expanded': isExpanded,
      tabIndex: disabled ? -1 : 0,
      disabled,
      ...rest,
      onClick: disabled ? noop : callAll(onClick, () => setExpanded((n) => !n)),
    }
  }

  function getCollapseProps(
    props: {
      style?: CSSProperties
      onTransitionEnd?: TransitionEventHandler
      refKey?: string
      [k: string]: unknown
    } = {}
  ) {
    const {
      style = {},
      onTransitionEnd = noop,
      refKey = 'ref',
      ...rest
    } = props
    const theirRef: any = rest[refKey]

    return {
      role: 'region',
      id: panelId,
      'aria-hidden':
        !isExpanded && collapsedHeight === '0px' ? true : undefined,
      ...rest,
      onTransitionEnd: callAll(handleTransitionEnd, onTransitionEnd),
      [refKey]: mergeRefs(el, theirRef),
      style: {
        ...style,
        boxSizing: 'border-box',
      },
    }
  }

  return {
    getToggleProps,
    getCollapseProps,
    isExpanded,
    setExpanded,
  } as const
}

function useIsMounted() {
  const ref = useRef(false)
  useEffect(() => {
    ref.current = true
  }, [])
  return ref
}
