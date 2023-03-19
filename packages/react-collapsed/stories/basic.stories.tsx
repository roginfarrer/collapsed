import * as React from 'react'
import { useCollapse } from '..'
import { Toggle, Collapse, excerpt } from './components'

export const Uncontrolled = () => {
  const { getToggleProps, getCollapseProps, isExpanded } = useCollapse()

  return (
    <div>
      <Toggle {...getToggleProps()}>{isExpanded ? 'Close' : 'Open'}</Toggle>
      <Collapse {...getCollapseProps()}>{excerpt}</Collapse>
    </div>
  )
}

export const Controlled = () => {
  const [isExpanded, setOpen] = React.useState<boolean>(true)
  const { getCollapseProps } = useCollapse({
    isExpanded,
  })

  return (
    <div>
      <Toggle onClick={() => setOpen((x) => !x)}>
        {isExpanded ? 'Close' : 'Open'}
      </Toggle>
      <Collapse {...getCollapseProps({})}>{excerpt}</Collapse>
    </div>
  )
}

export default {
  title: 'Basic Usage',
}
