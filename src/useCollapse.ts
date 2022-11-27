import { useId, useState, MouseEventHandler, useRef } from 'react'
import { Collapse, CollapseParams } from './Collapse'
import {
  callAll,
  mergeRefs,
  useControlledState,
  useLayoutEffect,
} from './utils'

export interface UseCollapseParams
  extends Omit<CollapseParams, 'getToggleElement' | 'getCollapseElement'> {
  isExpanded?: boolean
}

export function useCollapse(options: UseCollapseParams = {}) {
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

  const resolvedOptions: CollapseParams = {
    id,
    ...opts,
    getCollapseElement: () => collapseEl.current,
    getToggleElement: () => toggleEl,
    defaultExpanded: isExpanded,
    onExpandedChange: setExpanded,
  }

  const [instance] = useState(() => new Collapse(resolvedOptions))

  instance.setOptions(resolvedOptions)

  useLayoutEffect(() => {
    if (isExpanded) {
      instance.open()
    } else {
      instance.close()
    }
  }, [isExpanded, instance])

  const assignRef = (node: HTMLElement | null) => {
    if (collapseEl.current !== node) {
      collapseEl.current = node
      if (!!node) {
        instance.init()
      }
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
        ...rest,
        ...props,
        [refKey]: mergeRefs(theirRef, assignRef),
        onTransitionEnd:
          onTransitionEndHandler as unknown as React.TransitionEventHandler,
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
        ...rest,
        ...props,
        [refKey]: mergeRefs(theirRef, setToggleEl),
        onClick: callAll(onClickHandler, onClick),
      }
    },
    isExpanded,
    setExpanded,
  }
}
