import * as React from 'react'
import { useCollapse } from '..'
import { Toggle, Collapse, excerpt } from './components'

export const Uncontrolled = ({ id }) => {
  const { getToggleProps, getCollapseProps, isExpanded } = useCollapse({
    id,
    defaultExpanded: true,
  })
  const [collapse, setCollapse] = React.useState(false)

  return (
    <div>
      <button onClick={() => setCollapse((x) => !x)}>change collapse</button>
      <Toggle {...getToggleProps()}>{isExpanded ? 'Close' : 'Open'}</Toggle>
      {collapse ? (
        <Collapse {...getCollapseProps()}>{excerpt}</Collapse>
      ) : (
        <div {...getCollapseProps()} style={{ background: 'lightblue' }}>
          {excerpt}
        </div>
      )}
    </div>
  )
}

export const Foo = () => {
  const [mount, setMount] = React.useState(true)
  const [id, setId] = React.useState('foo')
  return (
    <div>
      <button onClick={() => setMount((x) => !x)}>Toggle</button>
      <input value={id} onChange={(e) => setId(e.target.value)} />
      {mount && <Uncontrolled id={id} />}
    </div>
  )
}

export const Controlled = () => {
  const [isExpanded, setOpen] = React.useState<boolean>(true)
  const { getToggleProps, getCollapseProps, setExpanded } = useCollapse({
    isExpanded,
  })

  return (
    <div>
      <button onClick={() => setOpen((x) => !x)}>
        {isExpanded ? 'Close' : 'Open'}
      </button>
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
