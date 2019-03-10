import {makeTransitionStyles} from '../utils';

const expandStyles = {
  transitionDuration: '300ms',
  transitionTimingFunction: 'ease-in-out',
};

const collapseStyles = {
  transitionDuration: '1000ms',
  transitionTimingFunction: 'ease-out',
};

const restingStyles = {
  transitionDuration: '200ms',
  transitionTimingFunction: 'linear',
};

test('preserves height in transition property when provided additional properties', () => {
  const result = makeTransitionStyles({
    expandStyles: {...expandStyles, transitionProperty: 'width, opacity'},
    collapseStyles: {...collapseStyles, transitionProperty: 'width, opacity'},
  });
  expect(result.expandStyles).toHaveProperty(
    'transitionProperty',
    'height, width, opacity'
  );
  expect(result.collapseStyles).toHaveProperty(
    'transitionProperty',
    'height, width, opacity'
  );
});

test('creates styles', () => {
  const result = makeTransitionStyles({
    expandStyles,
    collapseStyles,
    restingStyles,
  });
  expect(result).toEqual({
    expandStyles: {
      ...expandStyles,
      transitionProperty: 'height',
    },
    collapseStyles: {
      ...collapseStyles,
      transitionProperty: 'height',
    },
  });
});
