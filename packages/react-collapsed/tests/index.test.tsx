import * as React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import { useCollapse } from '../src'

// https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

const Collapse = ({
  toggleElement: Toggle = 'div',
  collapseProps = {},
  toggleProps = {},
  ...props
}: Parameters<typeof useCollapse>[0] & {
  toggleElement?: React.ElementType
  collapseProps?: any
  toggleProps?: any
}) => {
  const { getCollapseProps, getToggleProps } = useCollapse(props)
  return (
    <>
      <Toggle {...getToggleProps(toggleProps)} data-testid="toggle">
        Toggle
      </Toggle>
      <div {...getCollapseProps(collapseProps)} data-testid="collapse">
        <div style={{ height: 400 }}>content</div>
      </div>
    </>
  )
}

test('does not throw', () => {
  const result = () => render(<Collapse />)
  expect(result).not.toThrow()
})

test('Toggle has expected props when closed (default)', () => {
  const { rerender } = render(<Collapse toggleElement="div" />)
  const toggle = screen.getByRole('button')
  const collapse = screen.getByTestId('collapse')
  expect(toggle).toHaveAttribute('role', 'button')
  expect(toggle).toHaveAttribute('tabIndex', '0')
  expect(toggle).toHaveAttribute('aria-expanded', 'false')
  expect(toggle).toHaveAttribute('aria-controls', collapse.id)

  rerender(<Collapse toggleElement="button" />)
  const toggle2 = screen.getByRole('button')
  const collapse2 = screen.getByTestId('collapse')
  expect(toggle2).toHaveAttribute('type', 'button')
  expect(toggle2).toHaveAttribute('aria-expanded', 'false')
  expect(toggle2).toHaveAttribute('aria-controls', collapse2.id)
})

test('Toggle has expected props when collapse is open', () => {
  const { rerender } = render(<Collapse toggleElement="div" isExpanded />)
  const toggle = screen.getByRole('button')
  const collapse = screen.getByTestId('collapse')
  expect(toggle).toHaveAttribute('role', 'button')
  expect(toggle).toHaveAttribute('tabIndex', '0')
  expect(toggle).toHaveAttribute('aria-expanded', 'true')
  expect(toggle).toHaveAttribute('aria-controls', collapse.id)

  rerender(<Collapse toggleElement="button" isExpanded />)
  const toggle2 = screen.getByRole('button')
  const collapse2 = screen.getByTestId('collapse')
  expect(toggle2).toHaveAttribute('type', 'button')
  expect(toggle2).toHaveAttribute('aria-expanded', 'true')
  expect(toggle2).toHaveAttribute('aria-controls', collapse2.id)
})

test('Toggle has expected props when disabled', () => {
  const { rerender } = render(
    <Collapse toggleElement="div" toggleProps={{ disabled: true }} />
  )
  const toggle = screen.getByRole('button')
  const collapse = screen.getByTestId('collapse')
  expect(toggle).toHaveAttribute('role', 'button')
  expect(toggle).toHaveAttribute('tabIndex', '-1')
  expect(toggle).toHaveAttribute('aria-expanded', 'false')
  expect(toggle).toHaveAttribute('aria-controls', collapse.id)
  expect(toggle).toHaveAttribute('aria-disabled')

  rerender(<Collapse toggleElement="button" toggleProps={{ disabled: true }} />)
  const toggle2 = screen.getByRole('button')
  const collapse2 = screen.getByTestId('collapse')
  expect(toggle2).toHaveAttribute('type', 'button')
  expect(toggle2).toHaveAttribute('aria-expanded', 'false')
  expect(toggle2).toHaveAttribute('aria-controls', collapse2.id)
  expect(toggle2).toHaveAttribute('disabled')
})

test('Collapse has expected props when closed (default)', () => {
  render(<Collapse />)
  const collapse = screen.getByTestId('collapse')
  expect(collapse).toHaveAttribute('id')
  expect(collapse.getAttribute('aria-hidden')).toBe('true')
  expect(collapse).toHaveStyle({ display: 'none', height: '0px' })
})

test('Collapse has expected props when open', () => {
  render(<Collapse isExpanded />)
  const collapse = screen.getByTestId('collapse')
  expect(collapse).toHaveAttribute('id')
  expect(collapse).toHaveAttribute('aria-hidden', 'false')
  expect(collapse.style).not.toContain(
    expect.objectContaining({
      display: 'none',
      height: '0px',
    })
  )
})

test('Re-render does not modify id', () => {
  const { rerender } = render(<Collapse />)
  const collapse = screen.getByTestId('collapse')
  const collapseId = collapse.getAttribute('id')

  rerender(<Collapse defaultExpanded />)
  expect(collapseId).toEqual(collapse.getAttribute('id'))
})

test('toggle click calls onClick argument with isExpanded', () => {
  const onClick = jest.fn()
  render(<Collapse defaultExpanded toggleProps={{ onClick }} />)
  const toggle = screen.getByRole('button')

  fireEvent.click(toggle)
  expect(onClick).toHaveBeenCalled()
})

test('permits access to the collapse ref', () => {
  const cb = jest.fn()
  const { queryByTestId } = render(<Collapse collapseProps={{ ref: cb }} />)
  expect(cb).toHaveBeenCalledWith(queryByTestId('collapse'))
})

test('id argument modifies all rendered elements', () => {
  const {container} = render(<Collapse id="foo" />)
  expect(container.querySelector('#react-collapsed-toggle-foo')).toBeInTheDocument()
  expect(container.querySelector('#react-collapsed-panel-foo')).toBeInTheDocument()
})

test('id will be overridden by prop getters', () => {
  const {container} = render(<Collapse id="foo" collapseProps={{id: 'bar'}} toggleProps={{id: 'baz'}} />)
  expect(container.querySelector('#react-collapsed-toggle-foo')).not.toBeInTheDocument()
  expect(container.querySelector('#react-collapsed-panel-foo')).not.toBeInTheDocument()
  expect(container.querySelector('#baz')).toBeInTheDocument()
  expect(container.querySelector('#bar')).toBeInTheDocument()
})
