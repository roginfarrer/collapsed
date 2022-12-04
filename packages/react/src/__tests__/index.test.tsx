import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import useCollapse from '..'

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
  const { getCollapseProps, getToggleProps } = useCollapse({
    ...props,
    id: 'test',
  })
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
  expect(toggle).toHaveAttribute('role', 'button')
  expect(toggle).toHaveAttribute('tabIndex', '0')
  expect(toggle).toHaveAttribute('aria-expanded', 'false')
  expect(toggle).toHaveAttribute('aria-controls', 'test')

  rerender(<Collapse toggleElement="button" />)
  const toggle2 = screen.getByRole('button')
  expect(toggle2).toHaveAttribute('type', 'button')
  expect(toggle2).toHaveAttribute('aria-expanded', 'false')
  expect(toggle2).toHaveAttribute('aria-controls', 'test')
})

test('Toggle has expected props when collapse is open', () => {
  const { rerender } = render(<Collapse toggleElement="div" isExpanded />)
  const toggle = screen.getByRole('button')
  expect(toggle).toHaveAttribute('role', 'button')
  expect(toggle).toHaveAttribute('tabIndex', '0')
  expect(toggle).toHaveAttribute('aria-expanded', 'true')
  expect(toggle).toHaveAttribute('aria-controls', 'test')

  rerender(<Collapse toggleElement="button" isExpanded />)
  const toggle2 = screen.getByRole('button')
  expect(toggle2).toHaveAttribute('type', 'button')
  expect(toggle2).toHaveAttribute('aria-expanded', 'true')
  expect(toggle2).toHaveAttribute('aria-controls', 'test')
})

test('Toggle has expected props when disabled', () => {
  const { rerender } = render(
    <Collapse toggleElement="div" toggleProps={{ disabled: true }} />
  )
  const toggle = screen.getByRole('button')
  expect(toggle).toHaveAttribute('role', 'button')
  expect(toggle).toHaveAttribute('tabIndex', '-1')
  expect(toggle).toHaveAttribute('aria-expanded', 'false')
  expect(toggle).toHaveAttribute('aria-controls', 'test')
  expect(toggle).toHaveAttribute('aria-disabled')

  rerender(<Collapse toggleElement="button" toggleProps={{ disabled: true }} />)
  const toggle2 = screen.getByRole('button')
  expect(toggle2).toHaveAttribute('type', 'button')
  expect(toggle2).toHaveAttribute('aria-expanded', 'false')
  expect(toggle2).toHaveAttribute('aria-controls', 'test')
  expect(toggle2).toHaveAttribute('disabled')
})

test('Collapse has expected props when closed (default)', () => {
  render(<Collapse />)
  const collapse = screen.getByTestId('collapse')
  expect(collapse).toHaveAttribute('id', 'test')
  expect(collapse.getAttribute('aria-hidden')).toBe('true')
  expect(collapse).toHaveStyle({ display: 'none', height: '0px' })
})

test('Collapse has expected props when open', () => {
  render(<Collapse isExpanded />)
  const collapse = screen.getByTestId('collapse')
  expect(collapse).toHaveAttribute('id', 'test')
  expect(collapse).not.toHaveAttribute('aria-hidden')
  expect(collapse.style).not.toContain(
    expect.objectContaining({
      display: 'none',
      height: '0px',
    })
  )
})

test("Toggle's aria-controls matches Collapse's id", () => {
  render(<Collapse />)
  const toggle = screen.getByRole('button')
  const collapse = screen.getByTestId('collapse')
  expect(toggle.getAttribute('aria-controls')).toEqual(
    collapse.getAttribute('id')
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
