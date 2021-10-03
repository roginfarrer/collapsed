import React from 'react'
import useCollapse from '..'
import { Toggle, Collapse, excerpt } from './components'

export const Uncontrolled = () => {
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse({
    defaultExpanded: true,
  })

  return (
    <div>
      <Toggle {...getToggleProps()}>{isExpanded ? 'Close' : 'Open'}</Toggle>
      <Collapse {...getCollapseProps()}>{excerpt}</Collapse>
    </div>
  )
}

export const Controlled = () => {
  const [isExpanded, setOpen] = React.useState<boolean>(true)
  const { getCollapseProps, getToggleProps } = useCollapse({
    isExpanded,
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
