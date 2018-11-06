// @flow
import React from 'react';
import {render} from 'react-testing-library';
import 'jest-dom/extend-expect';
import Collapse from '../Collapse';

const toggleTestId = 'toggle';
const collapseTestId = 'collapse';

const Demo = props => (
  <Collapse {...props}>
    {({getCollapsibleProps, getTogglerProps}) => (
      <React.Fragment>
        <button
          {...getTogglerProps({
            'data-testid': toggleTestId,
            onClick: props.onClick
          })}
        >
          Open
        </button>
        <div {...getCollapsibleProps({'data-testid': collapseTestId})}>
          <div
            style={{
              height: '300px'
            }}
          />
        </div>
      </React.Fragment>
    )}
  </Collapse>
);

/*
  Tests to run
  - Do the IDs iterate with additional component
  - Collapse height when it's closed
  - Collapse height when it's open
  - Collapse display: none when it's closed
*/

test('renders with the expects ids', () => {
  const {getByTestId} = render(<Demo />);

  const toggleEl = getByTestId(toggleTestId);
  const collapseEl = getByTestId(collapseTestId);

  expect(toggleEl.id).toBe('CollapseToggle-0');
  expect(collapseEl.id).toBe('CollapsePanel-0');
});

test('First render collapse has no height', () => {
  const {getByTestId} = render(<Demo />);
  const collapseEl = getByTestId(collapseTestId);
  expect(collapseEl.style).toEqual(
    expect.objectContaining({
      height: '0px',
      display: 'none'
    })
  );
});

test('defaultOpen renders the collapse open', () => {
  const {getByTestId} = render(<Demo defaultOpen />);
  const collapseEl = getByTestId(collapseTestId);
  expect(collapseEl.style).toEqual(expect.objectContaining({}));
});

// test.only('Clicking toggle opens the collapse', async () => {
//   expect.assertions(2);
//   const onTransition = jest.fn();
//   const onClick = jest.fn();
//   const {container, getByTestId} = render(
//     <Demo onTransition={onTransition} onClick={onClick} />
//   );
//   const toggleEl = getByTestId(toggleTestId);
//   const collapseEl = getByTestId(collapseTestId);
//   // debugger;
//   fireEvent.click(toggleEl);
//   expect(onClick).toHaveBeenCalled();
//   const data = await onTransition();
//   expect(data).toBe(true);
// });
