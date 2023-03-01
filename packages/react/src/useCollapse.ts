import * as React from 'react'
import { Collapse, CollapseParams } from '@collapsed/core'
import {
  callAll,
  mergeRefs,
  useControlledState,
  useLayoutEffect,
} from './utils'

export interface UseCollapseParams
  extends Omit<
    CollapseParams,
    'getToggleElement' | 'getCollapseElement' | 'styles' | 'setStyles' | 'state'
  > {
  isExpanded?: boolean
  defaultExpanded?: boolean
}

export function useCollapse(options: UseCollapseParams = {}) {
  const {
    isExpanded: propExpanded,
    defaultExpanded: propDefaultExpanded = true,
    onExpandedChange,
    ...opts
  } = options

  const [isExpanded, setExpanded] = useControlledState(
    propExpanded,
    propDefaultExpanded,
    onExpandedChange
  )

  const id = React.useId()
  const collapseRef = React.useRef<HTMLElement | null>(null)
  const toggleRef = React.useRef<HTMLElement | null>(null)
  const prevExpanded = React.useRef(isExpanded)

  const resolvedOptions: CollapseParams = {
    id,
    getCollapseElement: () => collapseRef.current,
    getToggleElement: () => toggleRef.current,
    initialExpanded: isExpanded,
    ...opts,
  }

  const instanceRef = React.useRef<Collapse>(new Collapse(resolvedOptions))

  useLayoutEffect(() => {
    const wasExpanded = prevExpanded.current
    if (wasExpanded === isExpanded) {
      return
    }

    const instance = instanceRef.current

    if (isExpanded) {
      instance.open()
    } else {
      instance.close()
    }
    prevExpanded.current = isExpanded

    return () => {
      instance.cleanup()
    }
  }, [isExpanded, onExpandedChange])

  instanceRef.current.setOptions((prev) => ({
    ...prev,
    ...resolvedOptions,
  }))

  return {
    getCollapseProps({
      refKey = 'ref',
      ...rest
    }: {
      refKey?: string
      [k: string]: unknown
    } = {}) {
      const theirRef: any = rest[refKey]

      const props = instanceRef.current.getCollapse()

      return {
        ...rest,
        ...props,
        [refKey]: mergeRefs(theirRef, collapseRef),
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

      const props = instanceRef.current.getToggle({
        disabled,
      })

      return {
        ...rest,
        ...props,
        [refKey]: mergeRefs(theirRef, toggleRef),
        onClick: callAll(() => setExpanded((x) => !x), onClick),
      }
    },
    isExpanded,
    setExpanded,
  }
}
