import { uid, getAutoHeightDuration, paddingWarning } from './utils'

type Style = Partial<CSSStyleDeclaration>

const easeInOut = 'cubic-bezier(0.4, 0, 0.2, 1)'

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
  onExpandedChange?: (state: boolean) => void
  getCollapseElement: () => HTMLElement | null | undefined
}

export class Collapse {
  isExpanded: boolean
  options!: CollapseParams
  private collapseElement: HTMLElement | null | undefined = null
  private id!: string

  constructor(params: CollapseParams) {
    this.setOptions(params)
    this.isExpanded = Boolean(this.options.defaultExpanded)
    this.init()
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

  private getCollapsedStyles = () => {
    return {
      display: this.options.collapsedHeight === 0 ? 'block' : 'none',
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
      easing: easeInOut,
      expandStyles: {},
      collapseStyles: {},
      hasDisabledAnimation: false,
      collapsedHeight: 0,
      defaultExpanded: false,
      onExpandedChange() {},
      ...opts,
    }

    this.id = this.options.id ?? `collapse-${uid(performance.now())}`
  }

  private setStyles = (styles: Style) => {
    const target = this.options.getCollapseElement()
    if (!target) {
      return
    }
    for (const property in styles) {
      const value = styles[property]
      if (value && target) {
        target.style[property] = value
      }
    }
  }

  private getTransitionStyles = (height: number | string) => {
    if (this.options.hasDisabledAnimation) {
      return ''
    }
    const _duration =
      this.options.duration === 'auto'
        ? getAutoHeightDuration(height)
        : this.options.duration
    return `height ${_duration}ms ${this.options.easing}`
  }

  private handleTransitionEnd = (e: TransitionEvent) => {
    const node = this.options.getCollapseElement()
    if (e.target !== node || e.propertyName !== 'height') {
      return
    }

    if (this.isExpanded) {
      this.setStyles({
        height: '',
        overflow: '',
        transition: '',
        display: '',
      })
    } else {
      this.setStyles({
        ...this.getCollapsedStyles(),
        transition: '',
      })
    }
  }

  open = (): void => {
    console.log('open')
    // don't repeat if already open
    if (this.isExpanded) {
      return
    }

    const target = this.options.getCollapseElement()

    if (!target) {
      return
    }

    this.isExpanded = true
    this.options.onExpandedChange?.(true)
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

    this.isExpanded = false
    this.options.onExpandedChange?.(false)
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
    const hasToggle = false /* Boolean(this.toggleElement) */
    return {
      id: this.id,
      'aria-hidden': !this.isExpanded,
      onTransitionEndHandler: this.handleTransitionEnd,
      style: {
        boxSizing: 'border-box',
      },
      role: 'region',
      'aria-labelledby': hasToggle ? `${this.id}-toggle` : undefined,
    } as const
  }

  getToggle = (
    { disabled }: { disabled?: boolean } = { disabled: false }
  ): ToggleProps => {
    // const isButton = this.toggleElement
    //   ? this.toggleElement.tagName === 'BUTTON'
    //   : false
    const isButton = true
    const props: ToggleProps = {
      onClickHandler: disabled ? () => {} : this.toggle,
      id: `${this.id}-toggle`,
      'aria-controls': this.id,
      'aria-expanded': this.isExpanded,
    }
    if (isButton) {
      props.type = 'button'
      props.disabled = disabled
    } else {
      props['aria-disabled'] = disabled
      props.role = 'button'
      props.tabIndex = disabled ? -1 : 0
    }
    return props
  }
}

interface ToggleProps {
  onClickHandler: () => void
  id: string
  'aria-controls': string
  'aria-expanded': boolean
  disabled?: boolean
  type?: 'button'
  'aria-disabled'?: boolean
  role?: 'button'
  tabIndex?: 0 | -1
}
