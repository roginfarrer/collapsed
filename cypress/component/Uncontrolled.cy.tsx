import React from 'react'
import useCollapse from '../../src'

const Collapse = (props: React.ComponentPropsWithoutRef<'div'>) => (
  <div {...props} data-testid="collapse">
    <div
      style={{
        height: 300,
        border: '2px solid red',
        backgroundColor: 'lightblue',
      }}
    >
      helloooo
    </div>
  </div>
)

const Uncontrolled = () => {
  const { getToggleProps, getCollapseProps, isExpanded, setExpanded } =
    useCollapse()

  return (
    <div>
      <button {...getToggleProps()}>{isExpanded ? 'Close' : 'Open'}</button>
      <div onClick={() => setExpanded((n) => !n)} data-testid="alt">
        Alt
      </div>
      <Collapse {...getCollapseProps()} />
    </div>
  )
}

describe('Uncontrolled', () => {
  it('opens and closes', () => {
    cy.mount(<Uncontrolled />)

    // getToggleProps
    cy.get('button').should('have.text', 'Open')
    cy.get('[data-testid="collapse"]').should('not.be.visible')
    cy.get('button').click()
    cy.get('button').should('have.text', 'Close')
    cy.get('[data-testid="collapse"]').should('be.visible')

    // setExpanded
    cy.get('[data-testid="alt"]').click()
    cy.get('[data-testid="collapse"]').should('not.be.visible')
    cy.get('[data-testid="alt"]').click()
    cy.get('[data-testid="collapse"]').should('be.visible')
  })
})
