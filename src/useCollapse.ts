import {
  useId,
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  MouseEventHandler,
} from 'react'
import { Collapse, CollapseParams } from './Collapse'
import { callAll, mergeRefs } from './utils'

export interface UseCollapseParams
  extends Omit<CollapseParams, 'toggleElement' | 'collapseElement'> {
  isExpanded?: boolean
  defaultExpanded?: boolean
}

function useIsMounted() {
  const ref = useRef(false)
  useEffect(() => {
    ref.current = true
  }, [])
  return ref
}

export function useCollapse(options: UseCollapseParams = {}) {
  const {
    isExpanded: propExpanded,
    defaultExpanded: propDefaultExpanded,
    ...opts
  } = options

  const id = useId()
  const [collapseEl, setCollapseEl] = useState<HTMLElement | null>(null)
  const [toggleEl, setToggleEl] = useState<HTMLElement | null>(null)
  const [instance, setInstance] = useState<Collapse | undefined>()
  const isControlledRef = useRef(typeof propExpanded !== 'undefined')

  const [isExpanded, setExpanded] = useState(propDefaultExpanded)

  const isMounted = useIsMounted()

  /**
   * Handle controlled updates
   */
  useLayoutEffect(() => {
    if (!isMounted.current || !isControlledRef.current) {
      return
    }

    if (propExpanded) {
      instance?.open()
    } else {
      instance?.close()
    }
  }, [instance, propExpanded, isMounted])

  useLayoutEffect(() => {
    if (collapseEl) {
      setInstance(
        () =>
          new Collapse(collapseEl, toggleEl ?? undefined, {
            id,
            ...opts,
            defaultExpanded:
              typeof propExpanded === 'undefined' ? isExpanded : propExpanded,
          })
      )
    }
  }, [collapseEl, toggleEl])

  useEffect(() => {
    instance?.setOptions((prev) => ({
      id,
      ...prev,
      ...options,
      onExpandedChange(state) {
        setExpanded(state === 'expanding')
        opts.onExpandedChange?.(state)
      },
    }))
  })

  return {
    getCollapseProps({
      refKey = 'ref',
      ...rest
    }: { refKey?: string; [k: string]: unknown } = {}) {
      const theirRef: any = rest[refKey]
      if (!instance) {
        return { [refKey]: mergeRefs(theirRef, setCollapseEl) }
      }

      const { onTransitionEndHandler, ...props } = instance.getCollapse()

      return {
        ...props,
        [refKey]: mergeRefs(theirRef, setCollapseEl),
        onTransitionEnd: onTransitionEndHandler,
      }
    },
    getToggleProps({
      disabled,
      onClick = () => {},
      refKey = 'ref',
      ...rest
    }: {
      disabled?: boolean
      onClick?: MouseEventHandler<any>
      refKey?: string
      [k: string]: unknown
    } = {}) {
      const theirRef: any = rest[refKey]
      if (!instance) {
        return { [refKey]: mergeRefs(theirRef, setToggleEl) }
      }
      const { onClickHandler, ...props } = instance.getToggle({
        disabled,
      })
      return {
        ...props,
        [refKey]: mergeRefs(theirRef, setToggleEl),
        onClick: callAll(onClickHandler, onClick),
      }
    },
    isExpanded,
  }
}
