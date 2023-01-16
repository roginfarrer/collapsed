import * as React from 'react'
import { Collapse, CollapseParams } from '@collapsed/core'
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

  const id = React.useId()
  const collapseEl = React.useRef<HTMLElement | null>(null)
  const [toggleEl, setToggleEl] = React.useState<HTMLElement | null>(null)
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

  const [instance] = React.useState(() => new Collapse(resolvedOptions))

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
      onTransitionEnd = () => {},
      ...rest
    }: {
      refKey?: string
      onTransitionEnd?: React.TransitionEventHandler
      [k: string]: unknown
    } = {}) {
      const theirRef: any = rest[refKey]
      if (!instance) {
        return { [refKey]: mergeRefs(theirRef, assignRef) }
      }

      const { onTransitionEndHandler, ...props } = instance.getCollapse()

      return {
        ...rest,
        ...props,
        [refKey]: mergeRefs(theirRef, assignRef),
        onTransitionEnd: callAll(
          onTransitionEndHandler as unknown as React.TransitionEventHandler,
          onTransitionEnd
        ),
      }
    },
    getToggleProps({
      disabled,
      onClick = () => {},
      refKey = 'ref',
      ...rest
    }: {
      disabled?: boolean
      onClick?: React.MouseEventHandler<any>
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
