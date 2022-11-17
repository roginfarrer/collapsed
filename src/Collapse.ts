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
  onExpandedChange?: (state: 'expanding' | 'collapsing') => void
}

export class Collapse {
  isExpanded: boolean
  options!: CollapseParams
  private collapseElement!: HTMLElement
  private id: string
  private toggleElement: HTMLElement | undefined

  constructor(
    element: HTMLElement,
    toggle: HTMLElement | undefined,
    params: CollapseParams
  ) {
    this.setOptions(params)
    this.collapseElement = element
    this.toggleElement = toggle

    this.id = this.options.id ?? `collapse-${uid(performance.now())}`
    this.isExpanded = Boolean(this.options.defaultExpanded)

    if (!this.isExpanded) {
      this.setStyles(this.getCollapsedStyles())
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
  }

  private setStyles = (styles: Style) => {
    for (const property in styles) {
      const value = styles[property]
      if (value) {
        this.collapseElement.style[property] = value
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
    if (e.target !== this.collapseElement || e.propertyName !== 'height') {
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
    if (this.isExpanded) {
      return
    }

    this.isExpanded = true
    this.options.onExpandedChange?.('expanding')
    paddingWarning(this.collapseElement)
    requestAnimationFrame(() => {
      this.setStyles({
        ...this.options.expandStyles,
        display: 'block',
        overflow: 'hidden',
        height: `${this.options.collapsedHeight}px`,
      })
      requestAnimationFrame(() => {
        const height = this.collapseElement.scrollHeight

        // Order important! So setting properties directly
        this.collapseElement.style.transition = this.getTransitionStyles(height)
        this.collapseElement.style.height = `${height}px`
      })
    })
  }

  close = () => {
    if (!this.isExpanded) {
      return
    }

    this.isExpanded = false
    this.options.onExpandedChange?.('collapsing')
    requestAnimationFrame(() => {
      const height = this.collapseElement.scrollHeight
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
    const hasToggle = Boolean(this.toggleElement)
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
    const isButton = this.toggleElement
      ? this.toggleElement.tagName === 'BUTTON'
      : false
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
