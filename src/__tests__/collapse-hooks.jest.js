import React from 'react';
import {render, cleanup} from 'react-testing-library';
import {useCollapse} from '../collapse-hooks';
// add custom jest matchers from jest-dom
import 'jest-dom/extend-expect';

function Uncontrolled({defaultOpen} = {defaultOpen: false}) {
  const {getCollapseProps, getToggleProps} = useCollapse({defaultOpen});
  return (
    <div>
      <div {...getToggleProps()} data-testid="toggle">
        Toggle
      </div>
      <div {...getCollapseProps()} data-testid="collapse">
        <div style={{background: 'blue', height: 400, color: 'white'}} />
      </div>
    </div>
  );
}

afterEach(cleanup);

test('Toggle has expected props when closed (default)', () => {
  const {getByTestId} = render(<Uncontrolled />);
  const toggle = getByTestId('toggle');
  expect(toggle).toHaveAttribute('type', 'button');
  expect(toggle).toHaveAttribute('role', 'button');
  expect(toggle).toHaveAttribute('tabIndex', '0');
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
});

test('Toggle has expected props when collapse is open', () => {
  const {getByTestId} = render(<Uncontrolled defaultOpen />);
  const toggle = getByTestId('toggle');
  expect(toggle.getAttribute('aria-expanded')).toBe('true');
});

test('Collapse has expected props when closed (default)', () => {
  const {getByTestId} = render(<Uncontrolled />);
  const collapse = getByTestId('collapse');
  expect(collapse).toHaveAttribute('id');
  expect(collapse.getAttribute('aria-hidden')).toBe('true');
  expect(collapse.style).toEqual(
    expect.objectContaining({
      display: 'none',
      height: '0px',
    })
  );
});

test('Collapse has expected props when open', () => {
  const {getByTestId} = render(<Uncontrolled defaultOpen />);
  const collapse = getByTestId('collapse');
  expect(collapse.getAttribute('id')).toBeDefined();
  expect(collapse.getAttribute('aria-hidden')).toBe(null);
  expect(collapse.style).not.toEqual(
    expect.objectContaining({
      display: 'none',
      height: '0px',
    })
  );
});

test("Toggle's aria-controls matches Collapse's id", () => {
  const {getByTestId} = render(<Uncontrolled />);
  const toggle = getByTestId('toggle');
  const collapse = getByTestId('collapse');
  expect(toggle.getAttribute('aria-controls')).toEqual(
    collapse.getAttribute('id')
  );
});

test('Re-render does not modify id', () => {
  const {getByTestId, rerender} = render(<Uncontrolled />);
  const collapse = getByTestId('collapse');
  const collapseId = collapse.getAttribute('id');

  rerender(<Uncontrolled defaultOpen />);
  expect(collapseId).toEqual(collapse.getAttribute('id'));
});
