import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect as useReactLayoutEffect,
  CSSProperties,
} from 'react'
import {
  useId,
  getElementHeight,
  getAutoHeightDuration,
  mergeRefs,
  usePaddingWarning,
  useControlledState,
  useEvent,
  usePrefersReducedMotion,
  clearAnimationTimeout,
  Frame,
  AssignableRef,
  setAnimationTimeout,
} from './utils'

const useLayoutEffect =
  typeof window === 'undefined' ? useEffect : useReactLayoutEffect

export interface UseCollapseInput {
  /**
   * If true, the collapsible element is expanded.
   */
  isExpanded?: boolean
  /**
   * If true, the collapsible element is expanded when it initially mounts.
   * @default false
   */
  defaultExpanded?: boolean
  /**
   * Sets the height (Number) to which the elements collapses.
   * @default 0
   */
  collapsedHeight?: number
  /**
   * Sets the transition-timing-function of the animation.
   * @default 'cubic-bezier(0.4, 0, 0.2, 1)'
   */
  easing?: string
  /**
   * Sets the duration of the animation. If undefined, a 'natural' duration is
   * calculated based on the distance of the animation.
   */
  duration?: number
  /**
   * If true, the animation is disabled. Overrides the hooks own logic for
   * disabling the animation according to reduced motion preferences.
   */
  hasDisabledAnimation?: boolean
  /**
   * Handler called at each stage of the animation.
   */
  onTransitionStateChange?: (
    state:
      | 'expandStart'
      | 'expandEnd'
      | 'expanding'
      | 'collapseStart'
      | 'collapseEnd'
      | 'collapsing'
  ) => void
  /**
   * Unique identifier used to for associating elements appropriately for accessibility.
   */
  id?: string | number;
}

export function useCollapse({
  duration,
  easing = 'cubic-bezier(0.4, 0, 0.2, 1)',
  onTransitionStateChange: propOnTransitionStateChange = () => {},
  isExpanded: configIsExpanded,
  defaultExpanded = false,
  hasDisabledAnimation,
  id,
  ...initialConfig
}: UseCollapseInput = {}) {
  const onTransitionStateChange = useEvent(propOnTransitionStateChange)
  const uniqueId = useId(id ? `${id}` : undefined)

  const [isExpanded, setExpanded] = useControlledState(
    configIsExpanded,
    defaultExpanded
  )
  const prevExpanded = useRef(isExpanded)
  const [isAnimating, setIsAnimating] = useState(false)

  const prefersReducedMotion = usePrefersReducedMotion()
  const disableAnimation = hasDisabledAnimation ?? prefersReducedMotion

  // Animation frames
  const frameId = useRef<number>()
  const endFrameId = useRef<Frame>()

  // Collapse + toggle elements
  const collapseElRef = useRef<HTMLElement | null>(null)
  const [toggleEl, setToggleEl] = useState<HTMLElement | null>(null)

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

  useLayoutEffect(() => {
    const collapse = collapseElRef.current
    if (!collapse) return

    if (isExpanded === prevExpanded.current) return
    prevExpanded.current = isExpanded

    function getDuration(height: number | string) {
      if (disableAnimation) {
        return 0
      }
      return duration ?? getAutoHeightDuration(height)
    }

    const getTransitionStyles = (height: number | string) =>
      `height ${getDuration(height)}ms ${easing}`

    const setTransitionEndTimeout = (duration: number) => {
      function endTransition() {
        if (isExpanded) {
          setStyles({
            height: '',
            overflow: '',
            transition: '',
            display: '',
          })
          onTransitionStateChange('expandEnd')
        } else {
          setStyles({ transition: '' })
          onTransitionStateChange('collapseEnd')
        }
        setIsAnimating(false)
      }

      if (endFrameId.current) {
        clearAnimationTimeout(endFrameId.current)
      }
      endFrameId.current = setAnimationTimeout(endTransition, duration)
    }

    setIsAnimating(true)

    if (isExpanded) {
      frameId.current = requestAnimationFrame(() => {
        onTransitionStateChange('expandStart')
        setStyles({
          display: 'block',
          overflow: 'hidden',
          height: collapsedHeight,
        })
        frameId.current = requestAnimationFrame(() => {
          onTransitionStateChange('expanding')
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
        onTransitionStateChange('collapseStart')
        const height = getElementHeight(collapseElRef)
        setTransitionEndTimeout(getDuration(height))
        setStyles({
          transition: getTransitionStyles(height),
          height: `${height}px`,
        })
        frameId.current = requestAnimationFrame(() => {
          onTransitionStateChange('collapsing')
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
    disableAnimation,
    duration,
    easing,
    onTransitionStateChange,
  ])

  return {
    isExpanded,
    setExpanded,

    getToggleProps<
      Args extends {
        onClick?: React.MouseEventHandler
        disabled?: boolean
        [k: string]: unknown
      },
      RefKey extends string | undefined = 'ref'
    >(
      args?: Args & {
        /**
         * Sets the key of the prop that the component uses for ref assignment
         * @default 'ref'
         */
        refKey?: RefKey
      }
    ): { [K in RefKey extends string ? RefKey : 'ref']: AssignableRef<any> } & {
      onClick: React.MouseEventHandler
      id: string
      'aria-controls': string
      'aria-expanded'?: boolean
      type?: 'button'
      disabled?: boolean
      'aria-disabled'?: boolean
      role?: 'button'
      tabIndex?: number
    } {
      const { disabled, onClick, refKey, ...rest } = {
        refKey: 'ref',
        onClick() {},
        disabled: false,
        ...args,
      }

      const isButton = toggleEl ? toggleEl.tagName === 'BUTTON' : undefined

      const theirRef: any = args?.[refKey || 'ref']

      const props: any = {
        id: `react-collapsed-toggle-${uniqueId}`,
        'aria-controls': `react-collapsed-panel-${uniqueId}`,
        'aria-expanded': isExpanded,
        onClick(evt: any) {
          if (disabled) return
          onClick?.(evt)
          setExpanded((n) => !n)
        },
        [refKey || 'ref']: mergeRefs(theirRef, setToggleEl),
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
        return { ...props, ...fakeButtonProps, ...rest }
      } else if (isButton === true) {
        return { ...props, ...buttonProps, ...rest }
      } else {
        return {
          ...props,
          ...buttonProps,
          ...fakeButtonProps,
          ...rest
        }
      }
    },

    getCollapseProps<
      Args extends { style?: CSSProperties; [k: string]: unknown },
      RefKey extends string | undefined = 'ref'
    >(
      args?: Args & {
        /**
         * Sets the key of the prop that the component uses for ref assignment
         * @default 'ref'
         */
        refKey?: RefKey
      }
    ): {
      [K in RefKey extends string ? RefKey : 'ref']: AssignableRef<any>
    } & {
      id: string
      'aria-hidden': boolean
      role: string
      style: CSSProperties
    } {
      const { style, refKey } = { refKey: 'ref', style: {}, ...args }
      const theirRef: any = args?.[refKey || 'ref']
      return {
        id: `react-collapsed-panel-${uniqueId}`,
        'aria-hidden': !isExpanded,
        role: 'region',
        ...args,
        [refKey || 'ref']: mergeRefs(collapseElRef, theirRef),
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
      } as any
    },
  }
}
