import React from 'react'
import useCollapse from '..'
import { Toggle, Collapse, excerpt } from './components'

export default {
  title: 'Using divs',
}

export const Div = () => {
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse({
    defaultExpanded: true,
  })

  return (
    <div>
      <Toggle as="div" {...getToggleProps()}>
        {isExpanded ? 'Close' : 'Open'}
      </Toggle>
      <Collapse {...getCollapseProps()}>{excerpt}</Collapse>
    </div>
  )
}
