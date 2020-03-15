import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react-hooks';
import { mocked } from 'ts-jest/utils';
import useCollapse from '../src/';
import { getElementHeight } from '../src/utils';
import {
  GetTogglePropsShape,
  GetCollapsePropsShape,
  CollapseConfig,
} from '../src/types';

const mockedGetElementHeight = mocked(getElementHeight, true);

const Uncontrolled: React.FC<{
  toggleProps?: GetTogglePropsShape;
  collapseProps?: GetCollapsePropsShape;
  props?: CollapseConfig;
}> = ({ toggleProps, collapseProps, props }) => {
  const { getCollapseProps, getToggleProps } = useCollapse(props);
  return (
    <>
      <div {...getToggleProps(toggleProps)} data-testid="toggle">
        Toggle
      </div>
      <div {...getCollapseProps(collapseProps)} data-testid="collapse">
        <div style={{ background: 'blue', height: 400, color: 'white' }} />
      </div>
    </>
  );
};

test('does not throw', () => {
  const result = () => render(<Uncontrolled />);
  expect(result).not.toThrow();
});

test('returns expected constants', () => {
  const { result } = renderHook(useCollapse);
  const {
    isOpen,
    getToggleProps,
    getCollapseProps,
    toggleOpen,
  } = result.current;

  expect(typeof isOpen).toBe('boolean');
  expect(typeof toggleOpen).toBe('function');
  expect(typeof getToggleProps()).toBe('object');
  expect(typeof getCollapseProps()).toBe('object');
});

test('toggleOpen toggles isOpen', () => {
  const { result } = renderHook(useCollapse);
  const { toggleOpen } = result.current;
  act(() => {
    toggleOpen();
  });
  const { isOpen } = result.current;
  expect(isOpen).toBe(true);
});

test.only('Toggle has expected props when closed (default)', () => {
  const { getByTestId } = render(<Uncontrolled />);
  const toggle = getByTestId('toggle');
  expect(toggle).toHaveAttribute('type', 'button');
  expect(toggle).toHaveAttribute('role', 'button');
  expect(toggle).toHaveAttribute('tabIndex', '0');
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
});

test('Toggle has expected props when collapse is open', () => {
  const { getByTestId } = render(
    <Uncontrolled props={{ defaultOpen: true }} />
  );
  const toggle = getByTestId('toggle');
  expect(toggle.getAttribute('aria-expanded')).toBe('true');
});

test('Collapse has expected props when closed (default)', () => {
  const { getByTestId } = render(<Uncontrolled />);
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
  const { getByTestId } = render(
    <Uncontrolled props={{ defaultOpen: true }} />
  );
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
  const { getByTestId } = render(<Uncontrolled />);
  const toggle = getByTestId('toggle');
  const collapse = getByTestId('collapse');
  expect(toggle.getAttribute('aria-controls')).toEqual(
    collapse.getAttribute('id')
  );
});

test('Re-render does not modify id', () => {
  const { getByTestId, rerender } = render(<Uncontrolled />);
  const collapse = getByTestId('collapse');
  const collapseId = collapse.getAttribute('id');

  rerender(<Uncontrolled props={{ defaultOpen: true }} />);
  expect(collapseId).toEqual(collapse.getAttribute('id'));
});

test('clicking the toggle expands the collapse', () => {
  // Mocked since ref element sizes = :( in jsdom
  mockedGetElementHeight.mockReturnValue(400);

  const { getByTestId } = render(<Uncontrolled />);
  const toggle = getByTestId('toggle');
  const collapse = getByTestId('collapse');

  expect(collapse.style.height).toBe('0px');
  fireEvent.click(toggle);
  expect(collapse.style.height).toBe('400px');
});

test('clicking the toggle closes the collapse', () => {
  // Mocked since ref element sizes = :( in jsdom
  mockedGetElementHeight.mockReturnValue(0);

  const { getByTestId } = render(
    <Uncontrolled props={{ defaultOpen: true }} />
  );
  const toggle = getByTestId('toggle');
  const collapse = getByTestId('collapse');

  // No defined height when open
  expect(collapse.style.height).toBe('');
  fireEvent.click(toggle);
  expect(collapse.style.height).toBe('0px');
});

test('toggle click calls onClick argument with isOpen', () => {
  const onClick = jest.fn();
  const { getByTestId } = render(
    <Uncontrolled props={{ defaultOpen: true }} toggleProps={{ onClick }} />
  );
  const toggle = getByTestId('toggle');

  fireEvent.click(toggle);
  expect(onClick).toHaveBeenCalled();
});
