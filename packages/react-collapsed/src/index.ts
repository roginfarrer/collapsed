import {
  useState,
  useRef,
  useId,
  useEffect,
  useLayoutEffect as useReactLayoutEffect,
  useCallback,
} from 'react'
import {
  noop,
  getElementHeight,
  getAutoHeightDuration,
  mergeRefs,
  usePaddingWarning,
  useControlledState,
  callAll,
} from './utils'
import {
  UseCollapseInput,
  GetCollapsePropsInput,
  GetTogglePropsOutput,
  GetTogglePropsInput,
  UseCollapseOutput,
  GetCollapsePropsOutput,
} from './types'
import {
  clearAnimationTimeout,
  Frame,
  setAnimationTimeout,
} from './setAnimationTimeout'

const easeInOut = 'cubic-bezier(0.4, 0, 0.2, 1)'

const useLayoutEffect =
  typeof window === 'undefined' ? useEffect : useReactLayoutEffect

export function useCollapse({
  duration,
  easing = easeInOut,
  // collapseStyles = {},
  // expandStyles = {},
  onExpandStart = noop,
  onExpandEnd = noop,
  onCollapseStart = noop,
  onCollapseEnd = noop,
  isExpanded: configIsExpanded,
  defaultExpanded = false,
  hasDisabledAnimation = false,
  ...initialConfig
}: UseCollapseInput = {}): UseCollapseOutput {
  const [isExpanded, setExpanded] = useControlledState(
    configIsExpanded,
    defaultExpanded
  )
  const [isAnimating, setIsAnimating] = useState(false)
  const prevExpanded = useRef(isExpanded)
  const uniqueId = useId()
  const frameId = useRef<number>()
  const endFrameId = useRef<Frame>()
  const collapseElRef = useRef<HTMLElement | null>(null)
  const toggleElRef = useRef<HTMLElement | null>(null)

  usePaddingWarning(collapseElRef)
  const collapsedHeight = `${initialConfig.collapsedHeight || 0}px`

  function setStyles<T extends Partial<CSSStyleDeclaration>>(newStyles: T) {
    if (!collapseElRef.current) return
    const target = collapseElRef.current

    for (const property in newStyles) {
      const value = newStyles[property]
      if (value) {
        target.style[property] = value
      } else {
        target.style.removeProperty(property)
      }
    }
  }

  const setTransitionEndTimeout = useCallback(
    (duration: number) => {
      function endTransition() {
        if (isExpanded) {
          setStyles({
            height: '',
            overflow: '',
            transition: '',
            display: '',
          })
          onExpandEnd()
        } else {
          setStyles({
            transition: '',
          })
          onCollapseEnd()
        }
        setIsAnimating(false)
      }

      if (endFrameId.current) {
        clearAnimationTimeout(endFrameId.current)
      }
      endFrameId.current = setAnimationTimeout(endTransition, duration)
    },
    [isExpanded, onCollapseEnd, onExpandEnd]
  )

  useLayoutEffect(() => {
    if (isExpanded === prevExpanded.current) {
      return
    }
    prevExpanded.current = isExpanded

    const collapse = collapseElRef.current
    if (!collapse) return

    function getDuration(height: number | string) {
      if (hasDisabledAnimation) {
        return 0
      }
      return duration ?? getAutoHeightDuration(height)
    }
    const getTransitionStyles = (height: number | string) =>
      `height ${getDuration(height)}ms ${easing}`

    setIsAnimating(true)

    if (isExpanded) {
      frameId.current = requestAnimationFrame(() => {
        onExpandStart()
        setStyles({
          display: 'block',
          overflow: 'hidden',
          height: collapsedHeight,
        })
        frameId.current = requestAnimationFrame(() => {
          const height = getElementHeight(collapseElRef)
          setTransitionEndTimeout(getDuration(height))

          if (collapseElRef.current) {
            // Order is important! Setting directly.
            collapseElRef.current.style.transition = getTransitionStyles(height)
            collapseElRef.current.style.height = `${height}px`
          }
        })
      })
    } else {
      frameId.current = requestAnimationFrame(() => {
        onCollapseStart()
        const height = getElementHeight(collapseElRef)
        setTransitionEndTimeout(getDuration(height))
        setStyles({
          transition: getTransitionStyles(height),
          height: `${height}px`,
        })
        frameId.current = requestAnimationFrame(() => {
          setStyles({
            height: collapsedHeight,
            overflow: 'hidden',
          })
        })
      })
    }

    return () => {
      if (frameId.current) cancelAnimationFrame(frameId.current)
      if (endFrameId.current) clearAnimationTimeout(endFrameId.current)
    }
  }, [
    isExpanded,
    collapsedHeight,
    onExpandStart,
    setTransitionEndTimeout,
    onCollapseStart,
    hasDisabledAnimation,
    duration,
    easing,
  ])

  useEffect(() => {
    return () => {
      if (frameId.current) cancelAnimationFrame(frameId.current)
      if (endFrameId.current) clearAnimationTimeout(endFrameId.current)
    }
  }, [])

  function getToggleProps({
    disabled = false,
    onClick = noop,
    refKey = 'ref',
    isButton,
    ...rest
  }: GetTogglePropsInput = {}): GetTogglePropsOutput {
    const theirRef: any = rest[refKey as string]

    const props: any = {
      id: `react-collapsed-toggle-${uniqueId}`,
      'aria-controls': `react-collapsed-panel-${uniqueId}`,
      'aria-expanded': isExpanded,
      onClick: disabled ? noop : callAll(onClick, () => setExpanded((n) => !n)),
      [refKey as string]: mergeRefs(theirRef, toggleElRef),
    }
    const buttonProps = {
      type: 'button',
      disabled: disabled ? true : undefined,
    }
    const fakeButtonProps = {
      'aria-disabled': disabled ? true : undefined,
      role: 'button',
      tabIndex: disabled ? -1 : 0,
    }

    if (isButton === false) {
      return { ...props, ...fakeButtonProps }
    } else if (isButton === true) {
      return { ...props, ...buttonProps }
    } else {
      return {
        ...props,
        ...buttonProps,
        ...fakeButtonProps,
      }
    }
  }

  function getCollapseProps({
    style = {},
    refKey = 'ref',
    ...rest
  }: GetCollapsePropsInput = {}): GetCollapsePropsOutput {
    const theirRef: any = rest[refKey]
    return {
      id: `react-collapsed-panel-${uniqueId}`,
      'aria-hidden': !isExpanded,
      role: 'region',
      ...rest,
      [refKey]: mergeRefs(collapseElRef, theirRef),
      style: {
        boxSizing: 'border-box',
        ...(!isAnimating && !isExpanded
          ? {
              // collapsed and not animating
              display: collapsedHeight === '0px' ? 'none' : 'block',
              height: collapsedHeight,
              overflow: 'hidden',
            }
          : {}),
        // additional styles passed, e.g. getCollapseProps({style: {}})
        ...style,
      },
    }
  }

  return {
    getToggleProps,
    getCollapseProps,
    isExpanded,
    setExpanded,
  }
}
