export const noop = () => {};

export function getElementHeight(el) {
  if (!el || !el.current) {
    return 'auto';
  }
  return `${el.current.scrollHeight}px`;
}

// Helper function for render props. Sets a function to be called, plus any additional functions passed in
export const callAll = (...fns) => (...args) =>
  fns.forEach(fn => fn && fn(...args));

const defaultTransitionStyles = {
  transitionDuration: '500ms',
  transitionTimingFunction: 'cubic-bezier(0.250, 0.460, 0.450, 0.940)',
};

export function makeTransitionStyles({
  expand = defaultTransitionStyles,
  collapse = defaultTransitionStyles,
}) {
  return {
    expandStyles: {
      ...expand,
      transitionProperty: `${
        expand.transitionProperty ? `${expand.transitionProperty}, ` : ''
      } height`,
    },
    collapseStyles: {
      ...collapse,
      transitionProperty: `${
        collapse.transitionProperty ? `${collapse.transitionProperty}, ` : ''
      } height`,
    },
  };
}
