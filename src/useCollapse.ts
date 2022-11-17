import {
  useId,
  useState,
  useRef,
  MouseEventHandler,
  useLayoutEffect,
  useEffect,
} from 'react'
import { Collapse, CollapseParams } from './Collapse'
import { callAll, mergeRefs, useControlledState } from './utils'

export interface UseCollapseParams
  extends Omit<CollapseParams, 'toggleElement' | 'collapseElement'> {
  isExpanded?: boolean
  defaultExpanded?: boolean
}

export function useCollapse(
  options: Omit<UseCollapseParams, 'getCollapseElement'> = {}
) {
  const {
    isExpanded: propExpanded,
    defaultExpanded: propDefaultExpanded,
    onExpandedChange,
    ...opts
  } = options

  const id = useId()
  const collapseEl = useRef<HTMLElement | null>(null)
  const [toggleEl, setToggleEl] = useState<HTMLElement | null>(null)
  const [isExpanded, setExpanded] = useControlledState(
    propExpanded,
    propDefaultExpanded,
    onExpandedChange
  )
  const isMounted = useRef(false)

  useEffect(() => {
    isMounted.current = true
  })

  const resolvedOptions: CollapseParams = {
    id,
    ...opts,
    getCollapseElement: () => collapseEl.current,
    defaultExpanded: isExpanded,
    onExpandedChange: setExpanded,
  }

  const [instance] = useState<Collapse>(() => new Collapse(resolvedOptions))

  instance.setOptions(resolvedOptions)

  useLayoutEffect(() => {
    if (isMounted.current) {
      if (isExpanded) {
        instance.open()
      } else {
        instance.close()
      }
    }
  }, [isExpanded, instance])

  const assignRef = (node: HTMLElement | null) => {
    if (node && collapseEl.current !== node) {
      collapseEl.current = node
      instance.init()
    }
  }

  return {
    getCollapseProps({
      refKey = 'ref',
      ...rest
    }: { refKey?: string; [k: string]: unknown } = {}) {
      const theirRef: any = rest[refKey]
      if (!instance) {
        return { [refKey]: mergeRefs(theirRef, assignRef) }
      }

      const { onTransitionEndHandler, ...props } = instance.getCollapse()

      return {
        ...props,
        [refKey]: mergeRefs(theirRef, assignRef),
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
    setExpanded,
  }
}
