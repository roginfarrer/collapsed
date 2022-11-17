import { uid, getAutoHeightDuration, paddingWarning } from './utils'

type Style = Partial<CSSStyleDeclaration>

const easeInOut = 'cubic-bezier(0.4, 0, 0.2, 1)'

export interface CollapseParams {
  /** Element that expands and collapses */
  collapseElement: HTMLElement
  /** Element that controls the collapse */
  toggleElement?: HTMLElement
  /** If true, the collapse element will initialize expanded */
  defaultExpanded?: boolean
  isExpanded?: boolean
  /** Height in pixels that the collapse element collapses to */
  collapsedHeight?: number
  /** Styles applied to the collapse upon expanding */
  expandStyles?: Style
  /** Styles applied to the collapse upon collapsing */
  collapseStyles?: Style
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

interface Instance {
  _getTransitionStyles: (height: number | string) => string
  _setStyles: (styles: Style) => void
  _init: () => void
  _handleTransitionEnd: (e: TransitionEvent) => void
  _removeListeners: () => void
  _addListeners: () => void
  _hydrateId: () => void
  options: CollapseParams & {
    state: {
      isExpanded: boolean
    }
  }
  initialState: {
    isExpanded: boolean
  }
  setOpen: () => void
  setClosed: () => void
  toggle: () => void
  setOptions: (
    update: CollapseParams | ((v: CollapseParams) => CollapseParams)
  ) => void
}

export function createCollapse(config: CollapseParams) {
  const options: CollapseParams = {
    duration: 'auto',
    easing: easeInOut,
    expandStyles: {},
    collapseStyles: {},
    hasDisabledAnimation: false,
    collapsedHeight: 0,
    defaultExpanded: false,
    id: `collapse-${uid(performance.now())}`,
    ...config,
  }

  const initialState = {
    isExpanded: false,
    collapsedHeight: '0px',
  }

  const instance: Instance = {
    options: {
      duration: 'auto',
      easing: easeInOut,
      expandStyles: {},
      collapseStyles: {},
      hasDisabledAnimation: false,
      collapsedHeight: 0,
      defaultExpanded: false,
      ...config,
      state: initialState,
    },
    initialState,

    _getTransitionStyles(height: number | string) {
      const { hasDisabledAnimation, duration, easing } = instance.options

      if (hasDisabledAnimation) {
        return ''
      }
      const _duration =
        duration === 'auto' ? getAutoHeightDuration(height) : duration
      return `height ${_duration}ms ${easing}`
    },

    _setStyles(styles: Style) {
      for (const property in styles) {
        const value = styles[property]
        if (value) {
          options.collapseElement.style[property] = value
        }
      }
    },

    _hydrateId() {
      const { collapseElement, toggleElement, state } = options
      const panelId = `react-collapsed-panel-${state.id}`

      collapseElement.setAttribute('id', panelId)
      if (toggleElement) {
        const toggleId = `react-collapsed-toggle-${state.id}`
        toggleElement.setAttribute('aria-controls', panelId)
        collapseElement.setAttribute('aria-labelledby', toggleId)
      }
    },

    _init() {
      const { defaultExpanded, collapseElement, toggleElement, state } = options

      if (defaultExpanded) {
        instance._setStyles(state.collapsedStyles)
      }

      const panelId = `react-collapsed-panel-${state.id}`
      collapseElement.setAttribute('id', panelId)
      collapseElement.setAttribute('aria-hidden', `${!state.isExpanded}`)
      collapseElement.style.boxSizing = 'border-box'
      collapseElement.addEventListener(
        'transitionend',
        instance._handleTransitionEnd
      )

      if (toggleElement) {
        if (toggleElement.tagName !== 'BUTTON') {
          toggleElement.setAttribute('role', 'button')
          toggleElement.setAttribute('tabIndex', '0')
        }
        const toggleId = `react-collapsed-toggle-${instance.state.id}`
        toggleElement.setAttribute('type', 'button')
        toggleElement.setAttribute('aria-controls', panelId)
        collapseElement.setAttribute('aria-labelledby', toggleId)
        toggleElement.setAttribute(
          'aria-expanded',
          `${instance.state.isExpanded}`
        )

        toggleElement.addEventListener('click', instance.toggle)
      }
    },

    _handleTransitionEnd(e: TransitionEvent) {
      const { collapseElement } = options

      if (e.target !== collapseElement || e.propertyName !== 'height') {
        return
      }

      if (instance.state.isExpanded) {
        collapseElement.style.removeProperty('height')
        collapseElement.style.removeProperty('overflow')
        collapseElement.style.removeProperty('transition')
        collapseElement.style.removeProperty('display')
        instance.state.isExpanded = true
      } else {
        instance._setStyles(instance.state.collapsedStyles)
        collapseElement.style.removeProperty('transition')
        instance.state.isExpanded = false
      }
    },

    setOpen() {
      const { onExpandedChange, collapseElement, toggleElement, expandStyles } =
        instance.options

      onExpandedChange?.('expanding')
      paddingWarning(collapseElement)
      requestAnimationFrame(() => {
        instance._setStyles({
          ...expandStyles,
          display: 'block',
          overflow: 'hidden',
          height: instance.state.collapsedHeight,
        })
        requestAnimationFrame(() => {
          const height = collapseElement.scrollHeight

          // Order important! So setting properties directly
          collapseElement.style.transition =
            instance._getTransitionStyles(height)
          collapseElement.style.height = `${height}px`

          collapseElement.removeAttribute('aria-hidden')
          if (toggleElement) {
            toggleElement.setAttribute('aria-expanded', 'true')
          }
        })
      })
    },

    setClosed() {
      const {
        onExpandedChange,
        collapseElement,
        toggleElement,
        collapseStyles,
      } = instance.options

      onExpandedChange?.('collapsing')
      requestAnimationFrame(() => {
        const height = collapseElement.scrollHeight
        instance._setStyles({
          ...collapseStyles,
          transition: instance._getTransitionStyles(height),
          height: `${height}px`,
        })
        requestAnimationFrame(() => {
          instance._setStyles({
            height: instance.state.collapsedHeight,
            overflow: 'hidden',
          })
          instance.state.isExpanded = false
          collapseElement.setAttribute('aria-hidden', 'true')
          if (toggleElement) {
            toggleElement.setAttribute('aria-expanded', 'false')
          }
        })
      })
    },

    toggle() {
      if (instance.state.isExpanded) {
        instance.setClosed()
      } else {
        instance.setOpen()
      }
    },

    _addListeners() {
      instance.options.collapseElement.addEventListener(
        'transitionend',
        instance._handleTransitionEnd
      )
      if (instance.options.toggleElement) {
        instance.options.toggleElement.addEventListener(
          'click',
          instance.toggle
        )
      }
    },

    _removeListeners() {
      instance.options.collapseElement.removeEventListener(
        'transitionend',
        instance._handleTransitionEnd
      )
      if (instance.options.toggleElement) {
        instance.options.toggleElement.removeEventListener(
          'click',
          instance.toggle
        )
      }
    },

    setOptions(update) {
      const oldOptions = { ...instance.options }
      const newOptions =
        typeof update === 'function' ? update(instance.options) : update
      instance._removeListeners()
      instance.options = { ...oldOptions, ...newOptions }
      instance._addListeners()
      if (newOptions.id !== oldOptions.id) {
        instance._hydrateId()
      }
    },
  }

  instance._init()

  return instance
}
