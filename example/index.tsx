import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import { useCollapse } from '@collapsed/react'

const collapseStyles = { background: 'blue', color: 'white' }

export const Uncontrolled = () => {
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse({
    defaultExpanded: true,
  })

  return (
    <div>
      <h2>Uncontrolled</h2>
      <button {...getToggleProps({ style: { marginRight: 4 } })}>
        {isExpanded ? 'Close' : 'Open'}
      </button>
      <div
        {...getCollapseProps({
          style: collapseStyles,
        })}
      >
        In the morning I walked down the Boulevard to the rue Soufflot for
        coffee and brioche. It was a fine morning. The horse-chestnut trees in
        the Luxembourg gardens were in bloom. There was the pleasant
        early-morning feeling of a hot day. I read the papers with the coffee
        and then smoked a cigarette. The flower-women were coming up from the
        market and arranging their daily stock. Students went by going up to the
        law school, or down to the Sorbonne. The Boulevard was busy with trams
        and people going to work.
      </div>
    </div>
  )
}

const Sidebar = () => {
  const [showExample, setShowExample] = React.useState(false)
  const { getToggleProps, getCollapseProps, isExpanded } = useCollapse({
    axis: 'horizontal',
    collapsedDimension: 75,
  })

  let content: JSX.Element
  if (!showExample) {
    content = <button onClick={() => setShowExample(true)}>Show Example</button>
  } else {
    content = (
      <div>
        <div
          {...getCollapseProps()}
          style={{ position: 'fixed', inset: 0, maxWidth: 300 }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              backgroundColor: 'cyan',
            }}
          >
            <button {...getToggleProps()}>
              {isExpanded ? 'Close' : 'Open'}
            </button>
            <button onClick={() => setShowExample(false)}>
              Disable example
            </button>
            <div style={{ marginTop: 'auto' }}>sit at the bottom</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2>Sidebar</h2>
      {content}
    </div>
  )
}

const App = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
      <Uncontrolled />
      <Sidebar />
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(<App />)
