import { useCollapse } from '..'
import { Toggle, excerpt } from './components'

export default {
  title: 'Edge cases',
}

export const PaddingOnCollapseElement = () => {
  const { getToggleProps, getCollapseProps, isExpanded } = useCollapse()

  return (
    <div>
      <Toggle {...getToggleProps()}>{isExpanded ? 'Close' : 'Open'}</Toggle>
      <div {...getCollapseProps({ style: { padding: 10 } })}>{excerpt}</div>
    </div>
  )
}

export const PaddingOnElementInsideCollapse = () => {
  const { getToggleProps, getCollapseProps, isExpanded } = useCollapse()

  return (
    <div>
      <Toggle {...getToggleProps()}>{isExpanded ? 'Close' : 'Open'}</Toggle>
      <div {...getCollapseProps()}>
        <div style={{ padding: 20 }}>{excerpt}</div>
      </div>
    </div>
  )
}

export const MarginOnCollapseElement = () => {
  const { getToggleProps, getCollapseProps, isExpanded } = useCollapse()

  return (
    <div>
      <Toggle {...getToggleProps()}>{isExpanded ? 'Close' : 'Open'}</Toggle>
      <div {...getCollapseProps({ style: { backgroundColor: 'red' } })}>
        <div style={{ marginRight: '-15px', marginBottom: '-15px' }}>
          <div style={{ marginRight: '15px', marginBottom: '15px' }}>1</div>
          <div style={{ marginRight: '15px', marginBottom: '15px' }}>2</div>
        </div>
      </div>
    </div>
  )
}
