import {
  clearAnimationTimeout,
  Frame,
  setAnimationTimeout,
} from './setAnimationTimeout'
import { uid, getAutoHeightDuration, paddingWarning } from './utils'

type Style = Partial<CSSStyleDeclaration>

export interface CollapseParams {
  /** If true, the collapse element will initialize expanded */
  // defaultExpanded?: boolean
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
  /** If true, the animation will be disabled. Useful for disabling if the user prefers reduced motion */
  hasDisabledAnimation?: boolean
  /** Unique ID used for accessibility */
  id?: string
  /** Handler called when the expanded state changes */
  onExpandedChange?: (state: boolean) => void
  /** Handler called when the collapse transition starts */
  onCollapseStart?: () => void
  /** Handler called when the collapse transtion ends */
  onCollapseEnd?: () => void
  /** Handler called when the expand transition starts */
  onExpandStart?: () => void
  /** Handler called when the expand transition end */
  onExpandEnd?: () => void
  /** Function that returns a reference to the element that expands and collapses */
  getCollapseElement: () => HTMLElement | null | undefined
  /** Function that returns a reference to the toggle for the collapse region */
  getToggleElement?: () => HTMLElement | null | undefined
  setStyles?: (newStyles: any) => void
  styles?: Record<string, string | number>
  onStateChange?: (stage: State) => void
  state: State
  initialExpanded?: boolean
}

export type State =
  | 'preOpen'
  | 'opening'
  | 'open'
  | 'closing'
  | 'closed'
  | 'preClose'

export class Collapse {
  options!: CollapseParams
  private id!: string
  toggleEl: HTMLElement | undefined
  frameId: number | undefined
  endFrameId: Frame | undefined
  styles: any = {}

  constructor(params: CollapseParams) {
    this.setOptions(params)
  }

  getCollapsedStyles = (): Style => {
    return {
      display: this.options.collapsedHeight === 0 ? 'none' : 'block',
      height: `${this.options.collapsedHeight}px`,
      overflow: 'hidden',
    }
  }

  setOptions = (
    update: CollapseParams | ((prev: CollapseParams) => CollapseParams)
  ) => {
    const opts = typeof update === 'function' ? update(this.options) : update

    Object.entries(opts).forEach(([key, value]) => {
      if (typeof value === 'undefined') delete (opts as any)[key]
    })

    this.options = {
      duration: 'auto',
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      expandStyles: {},
      collapseStyles: {},
      hasDisabledAnimation: false,
      collapsedHeight: 0,
      onExpandedChange() {},
      ...opts,
    }

    this.id = this.options.id ?? `collapse-${uid(this)}`
  }

  private setStyles = (styles: Style) => {
    const target = this.options.getCollapseElement()
    if (!target) {
      return
    }
    for (const property in styles) {
      const value = styles[property]
      if (value) {
        // Set the style property to immediately trigger change
        target.style[property] = value
        // Cache the style property in case the component re-renders
        this.styles[property] = value
      } else {
        target.style.removeProperty(property)
        delete this.styles[property]
      }
    }
  }

  getDuration = (height: number) => {
    return this.options.duration === 'auto' || !this.options.duration
      ? getAutoHeightDuration(height)
      : this.options.duration
  }

  private getTransitionStyles = (height: number | string) => {
    if (this.options.hasDisabledAnimation) {
      return ''
    }
    const duration =
      this.options.duration === 'auto'
        ? getAutoHeightDuration(height)
        : this.options.duration
    return `height ${duration}ms ${this.options.easing}`
  }

  private endTransition = () => {
    console.log('transitionend')

    if (this.options.state === 'opening') {
      this.setStyles({
        height: '',
        overflow: '',
        transition: '',
        display: '',
      })
      this.options.onExpandEnd?.()
      this.options.onStateChange?.('open')
    } else if (this.options.state === 'closing') {
      this.setStyles({
        ...this.getCollapsedStyles(),
        transition: '',
      })
      this.options.onCollapseEnd?.()
      this.options.onStateChange?.('closed')
    }
  }

  setTransitionEndTimeout = ({ duration }: { duration: number }) => {
    if (this.endFrameId) {
      clearAnimationTimeout(this.endFrameId)
    }
    this.endFrameId = setAnimationTimeout(this.endTransition, duration)
  }

  open = () => {
    const target = this.options.getCollapseElement()
    console.log('start open', { target })
    if (!target) {
      return
    }

    if (this.frameId) {
      cancelAnimationFrame(this.frameId)
    }

    this.options.onExpandStart?.()
    paddingWarning(target)
    this.frameId = requestAnimationFrame(() => {
      this.options.onStateChange?.('preOpen')
      this.setStyles({
        ...this.options.expandStyles,
        display: 'block',
        overflow: 'hidden',
        height: `${this.options.collapsedHeight}px`,
      })
      this.frameId = requestAnimationFrame(() => {
        this.options.onStateChange?.('opening')
        const height = target.scrollHeight
        this.setTransitionEndTimeout({ duration: this.getDuration(height) })

        this.setStyles({
          // Order important! Transition first, height second
          transition: this.getTransitionStyles(height),
          height: `${height}px`,
        })
      })
    })
  }

  close = () => {
    const target = this.options.getCollapseElement()
    console.log('start close', { target })
    if (!target) {
      return
    }

    if (this.frameId) {
      cancelAnimationFrame(this.frameId)
    }

    this.options.onCollapseStart?.()
    this.frameId = requestAnimationFrame(() => {
      this.options.onStateChange?.('preClose')
      const height = target.scrollHeight
      this.setTransitionEndTimeout({ duration: this.getDuration(height) })
      this.setStyles({
        ...this.options.collapseStyles,
        transition: this.getTransitionStyles(height),
        height: `${height}px`,
      })
      this.frameId = requestAnimationFrame(() => {
        this.options.onStateChange?.('closing')
        this.setStyles({
          height: `${this.options.collapsedHeight}px`,
          overflow: 'hidden',
        })
      })
    })
  }

  cleanup = () => {
    console.log('cleanup', this.frameId)
    if (this.frameId) {
      cancelAnimationFrame(this.frameId)
    }
    if (this.endFrameId) {
      clearAnimationTimeout(this.endFrameId)
    }
  }

  getIsOpen = () => {
    const state = this.options.state
    return state === 'preClose' || state === 'open' || state === 'opening'
  }
  getIsClosed = () => {
    const state = this.options.state
    return state === 'preOpen' || state === 'closed' || state === 'closing'
  }

  getCollapse = () => {
    const hasToggle = Boolean(this.options.getToggleElement?.())
    return {
      id: this.id,
      'aria-hidden': this.getIsOpen() ? undefined : true,
      style: {
        boxSizing: 'border-box' as const,
        ...(this.options.state === 'closed' ? this.getCollapsedStyles() : {}),
        ...this.styles,
      },
      role: 'region',
      'aria-labelledby': hasToggle ? `${this.id}-toggle` : undefined,
    }
  }

  getToggle = ({
    disabled,
  }: {
    disabled?: boolean
  }): {
    onClickHandler: () => void
    id: string
    'aria-controls': string
    'aria-expanded': boolean
    disabled?: boolean
    type?: 'button'
    'aria-disabled'?: boolean
    role?: 'button'
    tabIndex?: 0 | -1
  } => {
    const toggleElement = this.options.getToggleElement?.()
    const isButton = toggleElement ? toggleElement.tagName === 'BUTTON' : false
    const props: any = {
      id: `${this.id}-toggle`,
      'aria-controls': this.id,
      'aria-expanded': this.getIsOpen(),
    }
    if (isButton) {
      props.type = 'button'
      props.disabled = disabled ? true : undefined
    } else {
      props['aria-disabled'] = disabled ? true : undefined
      props.role = 'button'
      props.tabIndex = disabled ? -1 : 0
    }
    return props
  }
}
