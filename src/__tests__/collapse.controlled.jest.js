import React from 'react';
import {render, cleanup} from 'react-testing-library';
import useCollapse from '../../src/react-collapsed';
// add custom jest matchers from jest-dom
import 'jest-dom/extend-expect';

function Controlled({isOpen} = {isOpen: false}) {
  const [open, setOpen] = React.useState({isOpen});
  const {getCollapseProps, getToggleProps} = useCollapse(open);

  return (
    <div>
      <div
        {...getToggleProps({onClick: () => setOpen(oldOpen => !oldOpen)})}
        data-testid="toggle"
      >
        Toggle
      </div>
      <div {...getCollapseProps()} data-testid="collapse">
        <div style={{background: 'blue', height: 400, color: 'white'}} />
      </div>
    </div>
  );
}

afterEach(cleanup);

test('is closed when isOpen argument is false', () => {
  const {getByTestId} = render(<Controlled />);
  const collapse = getByTestId('collapse');

  expect(collapse.style).toEqual(expect.objectContaining({display: 'none'}));
});

test('is closed when isOpen argument is true', () => {
  const {getByTestId} = render(<Controlled isOpen />);
  const collapse = getByTestId('collapse');

  expect(collapse.style).not.toEqual(
    expect.objectContaining({display: 'none'})
  );
});
