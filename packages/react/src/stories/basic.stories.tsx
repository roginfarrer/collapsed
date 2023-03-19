import * as React from 'react'
import { useCollapse } from '..'
import { AssignableRef } from '../utils'
import { Toggle, Collapse, excerpt } from './components'

export const Uncontrolled = () => {
  const { getToggleProps, getCollapseProps, isExpanded } = useCollapse()

  const tp = getToggleProps({ refKey: 'innerRef' })
  return (
    <div>
      <Toggle {...getToggleProps()}>{isExpanded ? 'Close' : 'Open'}</Toggle>
      <Collapse {...getCollapseProps()}>{excerpt}</Collapse>
    </div>
  )
}

declare function test<
  Args extends {
    onClick?: React.MouseEventHandler
    disabled?: boolean
    [k: string]: unknown
  },
  IsButton extends boolean | undefined = true,
  T extends string | undefined = 'ref'
>(
  rest?: Args & {
    refKey?: T
    isButton?: IsButton
  }
): { [K in T extends string ? T : 'ref']: AssignableRef<any> } & {
  onClick: React.MouseEventHandler
  id: string
  'aria-controls': string
  'aria-expanded'?: boolean
} & Omit<Args, 'refKey' | 'isButton'> &
  (IsButton extends true
    ? { type: 'button'; disabled?: boolean }
    : { 'aria-disabled'?: boolean; role: 'button'; tabIndex: number })

const foo = test({ refKey: 'innerRef', isButton: false })

export const Controlled = () => {
  const [isExpanded, setOpen] = React.useState<boolean>(true)
  const { getToggleProps, getCollapseProps } = useCollapse({
    isExpanded,
  })

  return (
    <div>
      <Toggle {...getToggleProps({ onClick: () => setOpen((x) => !x) })}>
        {isExpanded ? 'Close' : 'Open'}
      </Toggle>
      <Collapse {...getCollapseProps({})}>{excerpt}</Collapse>
    </div>
  )
}

function useReduceMotion() {
  const [matches, setMatch] = React.useState(
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = () => {
      setMatch(mq.matches)
    }
    handleChange()
    mq.addEventListener('change', handleChange)
    return () => {
      mq.removeEventListener('change', handleChange)
    }
  }, [])
  return matches
}

export const PrefersReducedMotion = () => {
  const reduceMotion = useReduceMotion()
  const [isExpanded, setOpen] = React.useState<boolean>(true)
  const { getToggleProps, getCollapseProps } = useCollapse({
    isExpanded,
    hasDisabledAnimation: reduceMotion,
  })

  return (
    <div>
      <Toggle {...getToggleProps({ onClick: () => setOpen((old) => !old) })}>
        {isExpanded ? 'Close' : 'Open'}
      </Toggle>
      <Collapse {...getCollapseProps()}>{excerpt}</Collapse>
    </div>
  )
}

export default {
  title: 'Basic Usage',
}
