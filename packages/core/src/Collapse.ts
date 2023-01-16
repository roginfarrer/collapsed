import { uid, getAutoDimensionDuration, paddingWarning } from './utils'

type Style = Partial<CSSStyleDeclaration>

export interface CollapseParams {
  /** If true, the collapse element will initialize expanded */
  defaultExpanded?: boolean
  /** @deprecate Height in pixels that the collapse element collapses to */
  collapsedHeight?: number
  /** Dimension in pixels that the collapse element collapses to */
  collapsedDimension?: number
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
  /** Vertical/Horizontal mode expand/collapse height/width, default value is vertical */
  axis?: 'vertical' | 'horizontal'
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
  private isVertical = true
  private dimension: 'height' | 'width'
  private initialDimensions = { height: 0, width: 0 }

  constructor(params: CollapseParams) {
    this.setOptions(params)
    this.isExpanded = Boolean(this.options.defaultExpanded)
    this.isVertical = this.options.axis === 'vertical'
    this.dimension = this.isVertical ? 'height' : 'width'
    this.init()
    this.isMounted = true
  }

  init = () => {
    const collapseElement = this.options.getCollapseElement()
    if (this.collapseElement !== collapseElement) {
      this.collapseElement = collapseElement
      this.setInitialDimensions()
      if (!this.isExpanded) {
        this.setStyles({
          ...this.getCollapsedStyles(),
          // When expand = false and collapsing width we preserve initial height
          ...(this.isVertical ? {} : { height: `${this.initialDimensions.height}px` }),
        })
      }
    }
  }

  private getCollapsedStyles = (): Style => {
    return {
      display: this.options.collapsedDimension === 0 ? 'none' : 'block',
      [this.dimension]: `${this.options.collapsedDimension}px`,
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
      collapsedDimension: 0,
      defaultExpanded: false,
      axis: 'vertical',
      onExpandedChange() {},
      ...opts,
    }

    this.options.collapsedDimension = this.isVertical ? this.options.collapsedHeight : this.options.collapsedDimension

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

  private getTransitionStyles = (dimension: number | string) => {
    if (this.options.hasDisabledAnimation) {
      return ''
    }
    const duration =
      this.options.duration === 'auto'
        ? getAutoDimensionDuration(dimension)
        : this.options.duration
    return `${this.dimension} ${duration}ms ${this.options.easing}`
  }

  private handleTransitionEnd = (e: TransitionEvent) => {
    if (e.propertyName !== this.dimension) {
      return
    }

    if (this.isExpanded) {
      this.setStyles({
        [this.dimension]: '',
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

  private setInitialDimensions = () => {
    const collapseElement = this.options.getCollapseElement()
    if (this.initialDimensions.width === 0) {
      this.initialDimensions.width = collapseElement?.scrollWidth || 0
    }
    if (this.initialDimensions.height === 0) {
      this.initialDimensions.height = collapseElement?.scrollHeight || 0
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
        [this.dimension]: `${this.options.collapsedDimension}px`,
      })
      requestAnimationFrame(() => {
        const dimensionValue = this.isVertical ? target.scrollHeight : this.initialDimensions.width

        // Order important! So setting properties directly
        target.style.transition = this.getTransitionStyles(dimensionValue)
        target.style[this.dimension] = `${dimensionValue}px`
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
      const dimensionValue = this.isVertical ? target.scrollHeight : target.scrollWidth
      this.setStyles({
        ...this.options.collapseStyles,
        transition: this.getTransitionStyles(dimensionValue),
        [this.dimension]: `${dimensionValue}px`,
      })
      requestAnimationFrame(() => {
        this.setStyles({
          [this.dimension]: `${this.options.collapsedDimension}px`,
          overflow: 'hidden',
          // when collapsing width we make sure to preserve the initial height
          ...(this.isVertical ? {} : { height: `${this.initialDimensions.height}px` }),
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
