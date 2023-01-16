import { uid, getAutoHeightDuration, paddingWarning } from './utils'

type Style = Partial<CSSStyleDeclaration>

export interface CollapseParams {
  /** If true, the collapse element will initialize expanded */
  defaultExpanded?: boolean
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
}

export class Collapse {
  isExpanded: boolean
  options!: CollapseParams
  private id!: string
  private collapseElement: HTMLElement | null | undefined = null
  private isMounted = false

  constructor(params: CollapseParams) {
    this.setOptions(params)
    this.isExpanded = Boolean(this.options.defaultExpanded)
    this.init()
    this.isMounted = true
  }

  init = () => {
    const collapseElement = this.options.getCollapseElement()
    if (this.collapseElement !== collapseElement) {
      this.collapseElement = collapseElement
      if (!this.isExpanded) {
        this.setStyles(this.getCollapsedStyles())
      }
    }
  }

  private getCollapsedStyles = (): Style => {
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
      defaultExpanded: false,
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
        target.style[property] = value
      } else {
        target.style.removeProperty(property)
      }
    }
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

  private handleTransitionEnd = (e: TransitionEvent) => {
    if (e.propertyName !== 'height') {
      return
    }

    if (this.isExpanded) {
      this.setStyles({
        height: '',
        overflow: '',
        transition: '',
        display: '',
      })
      this.options.onExpandEnd?.()
    } else {
      this.setStyles({
        ...this.getCollapsedStyles(),
        transition: '',
      })
      this.options.onCollapseEnd?.()
    }
  }

  open = (): void => {
    // don't repeat if already open
    if (this.isExpanded || !this.isMounted) {
      return
    }

    const target = this.options.getCollapseElement()
    if (!target) {
      return
    }

    this.isExpanded = true
    this.options.onExpandedChange?.(true)
    this.options.onExpandStart?.()
    paddingWarning(target)
    requestAnimationFrame(() => {
      this.setStyles({
        ...this.options.expandStyles,
        display: 'block',
        overflow: 'hidden',
        height: `${this.options.collapsedHeight}px`,
      })
      requestAnimationFrame(() => {
        const height = target.scrollHeight

        // Order important! So setting properties directly
        target.style.transition = this.getTransitionStyles(height)
        target.style.height = `${height}px`
      })
    })
  }

  close = () => {
    // don't repeat if already closed
    if (!this.isExpanded) {
      return
    }

    const target = this.options.getCollapseElement()
    if (!target) {
      return
    }

    if (!this.isMounted) {
      this.init()
      return
    }

    this.isExpanded = false
    this.options.onExpandedChange?.(false)
    this.options.onCollapseStart?.()
    requestAnimationFrame(() => {
      const height = target.scrollHeight
      this.setStyles({
        ...this.options.collapseStyles,
        transition: this.getTransitionStyles(height),
        height: `${height}px`,
      })
      requestAnimationFrame(() => {
        this.setStyles({
          height: `${this.options.collapsedHeight}px`,
          overflow: 'hidden',
        })
      })
    })
  }

  toggle = () => {
    if (this.isExpanded) {
      this.close()
    } else {
      this.open()
    }
  }

  getCollapse = () => {
    const hasToggle = Boolean(this.options.getToggleElement?.())
    return {
      id: this.id,
      'aria-hidden': this.isExpanded ? undefined : true,
      onTransitionEndHandler: this.handleTransitionEnd,
      style: {
        boxSizing: 'border-box' as const,
      },
      role: 'region',
      'aria-labelledby': hasToggle ? `${this.id}-toggle` : undefined,
    }
  }

  getToggle = (
    { disabled }: { disabled?: boolean } = { disabled: false }
  ): {
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
      onClickHandler: disabled ? () => {} : this.toggle,
      id: `${this.id}-toggle`,
      'aria-controls': this.id,
      'aria-expanded': this.isExpanded,
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
