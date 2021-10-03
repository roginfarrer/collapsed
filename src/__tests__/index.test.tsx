import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import useCollapse from '..'
import { getElementHeight } from '../utils'
import {
  GetTogglePropsInput,
  GetCollapsePropsInput,
  UseCollapseInput,
} from '../types'

const mockedGetElementHeight = mocked(getElementHeight, true)

const Collapse: React.FC<{
  toggleProps?: GetTogglePropsInput
  collapseProps?: GetCollapsePropsInput
  props?: UseCollapseInput
}> = ({ toggleProps, collapseProps, props }) => {
  const { getCollapseProps, getToggleProps } = useCollapse(props)
  return (
    <>
      <div {...getToggleProps(toggleProps)} data-testid="toggle">
        Toggle
      </div>
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
  const { getByTestId } = render(<Collapse />)
  const toggle = getByTestId('toggle')
  expect(toggle).toHaveAttribute('type', 'button')
  expect(toggle).toHaveAttribute('role', 'button')
  expect(toggle).toHaveAttribute('tabIndex', '0')
  expect(toggle).toHaveAttribute('aria-expanded', 'false')
})

test('Toggle has expected props when collapse is open', () => {
  const { getByTestId } = render(<Collapse props={{ defaultExpanded: true }} />)
  const toggle = getByTestId('toggle')
  expect(toggle.getAttribute('aria-expanded')).toBe('true')
})

test('Collapse has expected props when closed (default)', () => {
  const { getByTestId } = render(<Collapse />)
  const collapse = getByTestId('collapse')
  expect(collapse).toHaveAttribute('id')
  expect(collapse.getAttribute('aria-hidden')).toBe('true')
  expect(collapse.style).toEqual(
    expect.objectContaining({
      display: 'none',
      height: '0px',
    })
  )
})

test('Collapse has expected props when open', () => {
  const { getByTestId } = render(<Collapse props={{ defaultExpanded: true }} />)
  const collapse = getByTestId('collapse')
  expect(collapse).toHaveAttribute('id')
  expect(collapse).toHaveAttribute('aria-hidden', 'false')
  expect(collapse.style).not.toContain(
    expect.objectContaining({
      display: 'none',
      height: '0px',
    })
  )
})

test("Toggle's aria-controls matches Collapse's id", () => {
  const { getByTestId } = render(<Collapse />)
  const toggle = getByTestId('toggle')
  const collapse = getByTestId('collapse')
  expect(toggle.getAttribute('aria-controls')).toEqual(
    collapse.getAttribute('id')
  )
})

test('Re-render does not modify id', () => {
  const { getByTestId, rerender } = render(<Collapse />)
  const collapse = getByTestId('collapse')
  const collapseId = collapse.getAttribute('id')

  rerender(<Collapse props={{ defaultExpanded: true }} />)
  expect(collapseId).toEqual(collapse.getAttribute('id'))
})

test.skip('clicking the toggle expands the collapse', () => {
  // Mocked since ref element sizes = :( in jsdom
  mockedGetElementHeight.mockReturnValue(400)

  const { getByTestId } = render(<Collapse />)
  const toggle = getByTestId('toggle')
  const collapse = getByTestId('collapse')

  expect(collapse.style.height).toBe('0px')
  fireEvent.click(toggle)
  expect(collapse.style.height).toBe('400px')
})

test.skip('clicking the toggle closes the collapse', () => {
  // Mocked since ref element sizes = :( in jsdom
  mockedGetElementHeight.mockReturnValue(0)

  const { getByTestId } = render(<Collapse props={{ defaultExpanded: true }} />)
  const toggle = getByTestId('toggle')
  const collapse = getByTestId('collapse')

  // No defined height when open
  expect(collapse.style.height).toBe('')
  fireEvent.click(toggle)
  expect(collapse.style.height).toBe('0px')
})

test('toggle click calls onClick argument with isExpanded', () => {
  const onClick = jest.fn()
  const { getByTestId } = render(
    <Collapse props={{ defaultExpanded: true }} toggleProps={{ onClick }} />
  )
  const toggle = getByTestId('toggle')

  fireEvent.click(toggle)
  expect(onClick).toHaveBeenCalled()
})

test('warns if using padding on collapse', () => {
  // Mocking console.warn so it does not log to the console,
  // but we can still intercept the message
  const originalWarn = console.warn
  let consoleOutput = ''
  const mockWarn = (output: any) => (consoleOutput = output)
  console.warn = jest.fn(mockWarn)

  render(
    <Collapse
      props={{ defaultExpanded: true }}
      collapseProps={{ style: { padding: 20 } }}
    />
  )

  expect(consoleOutput).toMatchInlineSnapshot(
    `"Warning: react-collapsed: Padding applied to the collapse element will cause the animation to break and not perform as expected. To fix, apply equivalent padding to the direct descendent of the collapse element."`
  )

  console.warn = originalWarn
})

test('permits access to the collapse ref', () => {
  const cb = jest.fn()
  const { queryByTestId } = render(<Collapse collapseProps={{ ref: cb }} />)
  expect(cb).toHaveBeenCalledWith(queryByTestId('collapse'))
})
