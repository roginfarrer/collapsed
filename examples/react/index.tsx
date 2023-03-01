import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import { useCollapse } from '@collapsed/react'

const collapseStyles = { background: 'blue', color: 'white' }

export const Uncontrolled = () => {
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse({
    defaultExpanded: true,
  })

  return (
    <div style={{ maxWidth: 250, margin: '0 auto' }}>
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

const App = () => {
  return (
    <div>
      <Uncontrolled />
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(<App />)
