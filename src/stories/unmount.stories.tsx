import React from 'react'
import useCollapse from '..'
import { Collapse, excerpt, Toggle } from './components'

export default {
  title: 'Unmount content on collapse',
  component: useCollapse,
}

export function Unmount() {
  const [mountChildren, setMountChildren] = React.useState(true)
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse({
    defaultExpanded: true,
    onExpandStart() {
      setMountChildren(true)
    },
    onCollapseEnd() {
      setMountChildren(false)
    },
  })

  return (
    <>
      <Toggle {...getToggleProps()}>{isExpanded ? 'Close' : 'Open'}</Toggle>
      <div {...getCollapseProps()}>
        {mountChildren && <Collapse>{excerpt}</Collapse>}
      </div>
    </>
  )
}

Unmount.story = {
  name: 'Unmount content when closed',
}
