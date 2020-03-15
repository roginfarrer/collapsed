import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import useCollapse from '../src';
import { CollapseConfig } from '../src/types';

const Collapse: React.FC<{ config?: CollapseConfig }> = ({ config }) => {
  const { getCollapseProps, getToggleProps, mountChildren } = useCollapse(
    config
  );

  return (
    <>
      <button {...getToggleProps()} data-testid="toggle" />
      <div {...getCollapseProps()} data-testid="collapse">
        {mountChildren && <div>content</div>}
      </div>
    </>
  );
};

test('children not rendered when mounted closed', () => {
  const { getByTestId } = render(<Collapse />);
  const collapse = getByTestId('collapse');
  expect(collapse.textContent).toBe('');
});

test('children not rendered when mounted open', () => {
  const { getByTestId } = render(<Collapse config={{ defaultOpen: true }} />);
  const collapse = getByTestId('collapse');
  expect(collapse.textContent).toBe('content');
});

// This test fails since the children is unmounted in the collapse transition end handler
// However, in jsdom, that callback is never fired (or doesn't seem to be)
test.skip('children rendered when toggle clicked', () => {
  const { getByTestId } = render(<Collapse config={{ defaultOpen: true }} />);
  const collapse = getByTestId('collapse');
  const toggle = getByTestId('toggle');
  expect(collapse.textContent).toBe('content');
  fireEvent.click(toggle);
  // console.log(collapse.style);
  expect(collapse.textContent).toBe('');
});
