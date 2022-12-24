import { useState, useRef, TransitionEvent, CSSProperties } from 'react'
import { flushSync } from 'react-dom'
import {
  noop,
  callAll,
  getElementHeight,
  getElementWidth,
  getAutoDistanceDuration,
  mergeRefs,
  usePaddingWarning,
  useUniqueId,
  useEffectAfterMount,
  useControlledState,
} from './utils'
import {
  UseCollapseInput,
  UseCollapseOutput,
  GetCollapsePropsOutput,
  GetCollapsePropsInput,
  GetTogglePropsOutput,
  GetTogglePropsInput,
} from './types'

const easeInOut = 'cubic-bezier(0.4, 0, 0.2, 1)'

export default function useCollapse({
  duration,
  easing = easeInOut,
  collapseStyles = {},
  expandStyles = {},
  onExpandStart = noop,
  onExpandEnd = noop,
  onCollapseStart = noop,
  onCollapseEnd = noop,
  isExpanded: configIsExpanded,
  defaultExpanded = false,
  hasDisabledAnimation = false,
  isHorizontal = false,
  ...initialConfig
}: UseCollapseInput = {}): UseCollapseOutput {
  const [isExpanded, setExpanded] = useControlledState(
    configIsExpanded,
    defaultExpanded
  )
  const uniqueId = useUniqueId()
  const el = useRef<HTMLElement | null>(null)
  usePaddingWarning(el)
  const dimension = isHorizontal ? 'width' : 'height'
  const collapsedDimension = `${(isHorizontal ? initialConfig.collapsedWidth : initialConfig.collapsedHeight) || 0}px`
  const collapsedStyles = {
    display: collapsedDimension === '0px' ? 'none' : 'block',
    [dimension]: collapsedDimension,
    overflow: 'hidden',
  }
  const [styles, setStylesRaw] = useState<CSSProperties>(
    isExpanded ? {} : collapsedStyles
  )
  const setStyles = (newStyles: {} | ((oldStyles: {}) => {})): void => {
    // We rely on reading information from layout
    // at arbitrary times, so ensure all style changes
    // happen before we might attempt to read them.
    flushSync(() => {
      setStylesRaw(newStyles)
    })
  }
  const mergeStyles = (newStyles: {}): void => {
    setStyles((oldStyles) => ({ ...oldStyles, ...newStyles }))
  }

  function getTransitionStyles(distance: number | string): CSSProperties {
    if (hasDisabledAnimation) {
      return {}
    }
    const _duration = duration || getAutoDistanceDuration(distance)
    return {
      transition: `${dimension} ${_duration}ms ${easing}`,
    }
  }

  const [initHeight, setIniHeight] = useState<string|number>(0)
  const [initWidth, setInitWidth] = useState<string|number>(0)

  useEffectAfterMount(() => {
    if (isHorizontal && initHeight === 0) {
      setIniHeight(getElementHeight(el))
      setInitWidth(getElementWidth(el))
      return
    }
    if (isExpanded) {
      requestAnimationFrame(() => {
        onExpandStart()
        mergeStyles({
          ...expandStyles,
          willChange: dimension,
          display: 'block',
          overflow: 'hidden',
        })
        requestAnimationFrame(() => {
          const dimensionValue = isHorizontal ? initWidth : getElementHeight(el)
          const transitionStyles = getTransitionStyles(dimensionValue)
          mergeStyles({
            ...transitionStyles,
            [dimension]: dimensionValue,
          })
        })
      })
    } else {
      requestAnimationFrame(() => {
        onCollapseStart()
        const dimensionValue = isHorizontal ? getElementWidth(el) : getElementHeight(el)
        const transitionStyles = getTransitionStyles(dimensionValue)
        mergeStyles({
          ...collapseStyles,
          ...transitionStyles,
          willChange: dimension,
          [dimension]: dimensionValue,
        })
        requestAnimationFrame(() => {
          mergeStyles({
            [dimension]: collapsedDimension,
            overflow: 'hidden',
            // when collapsing width we make sure to preserve the initial height
            ...(isHorizontal ? {height: initHeight} : {}),
          })
        })
      })
    }
  }, [isExpanded, collapsedDimension, initHeight])

  const handleTransitionEnd = (e: TransitionEvent): void => {
    // Sometimes onTransitionEnd is triggered by another transition,
    // such as a nested collapse panel transitioning. But we only
    // want to handle this if this component's element is transitioning
    if (e.target !== el.current || e.propertyName !== dimension) {
      return
    }

    // The height/width comparisons below are a final check before
    // completing the transition
    // Sometimes this callback is run even though we've already begun
    // transitioning the other direction
    // The conditions give us the opportunity to bail out,
    // which will prevent the collapsed content from flashing on the screen
    if (isExpanded) {
      const dimensionValue = isHorizontal ? getElementWidth(el) : getElementHeight(el)

      // If the height/width at the end of the transition
      // matches the height/width we're animating to,
      if (dimensionValue === styles[dimension]) {
        setStyles({})
      } else {
        // If the heights/widths don't match, this could be due the height/width
        // of the content changing mid-transition
        mergeStyles({ [dimension]: dimensionValue })
      }

      onExpandEnd()

      // If the height/width we should be animating to matches the collapsed height/width,
      // it's safe to apply the collapsed overrides
    } else if (styles[dimension] === collapsedDimension) {
      setStyles({...collapsedStyles, ...(isHorizontal ? {height: initHeight} : {})})
      onCollapseEnd()
    }
  }

  function getToggleProps({
    disabled = false,
    onClick = noop,
    ...rest
  }: GetTogglePropsInput = {}): GetTogglePropsOutput {
    return {
      type: 'button',
      role: 'button',
      id: `react-collapsed-toggle-${uniqueId}`,
      'aria-controls': `react-collapsed-panel-${uniqueId}`,
      'aria-expanded': isExpanded,
      tabIndex: 0,
      disabled,
      ...rest,
      onClick: disabled ? noop : callAll(onClick, () => setExpanded((n) => !n)),
    }
  }

  function getCollapseProps({
    style = {},
    onTransitionEnd = noop,
    refKey = 'ref',
    ...rest
  }: GetCollapsePropsInput = {}): GetCollapsePropsOutput {
    const theirRef: any = rest[refKey]
    return {
      id: `react-collapsed-panel-${uniqueId}`,
      'aria-hidden': !isExpanded,
      ...rest,
      [refKey]: mergeRefs(el, theirRef),
      onTransitionEnd: callAll(handleTransitionEnd, onTransitionEnd),
      style: {
        boxSizing: 'border-box',
        // additional styles passed, e.g. getCollapseProps({style: {}})
        ...style,
        // style overrides from state
        ...styles,
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
