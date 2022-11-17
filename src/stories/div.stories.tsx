import React from 'react'
import { useCollapse } from '..'
import { Toggle, Collapse, excerpt } from './components'

export default {
  title: 'Using divs',
}

export const Div = () => {
  const { collapse, toggle, isExpanded } = useCollapse({
    defaultExpanded: true,
  })

  return (
    <div>
      <Toggle as="div" ref={toggle}>
        {isExpanded ? 'Close' : 'Open'}
      </Toggle>
      <Collapse ref={collapse}>{excerpt}</Collapse>
    </div>
  )
}
