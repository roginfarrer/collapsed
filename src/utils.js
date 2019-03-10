export const noop = () => {};

export function getElementHeight(el) {
  if (!el || !el.current) {
    return 'auto';
  }
  return el.current.scrollHeight;
}

// Helper function for render props. Sets a function to be called, plus any additional functions passed in
export const callAll = (...fns) => (...args) =>
  fns.forEach(fn => fn && fn(...args));

export const defaultTransitionStyles = {
  transitionDuration: '500ms',
  transitionTimingFunction: 'cubic-bezier(0.250, 0.460, 0.450, 0.940)',
};

export function joinTransitionProperties(string) {
  if (string) {
    const styles = ['height'];
    styles.push(...string.split(', '));
    return styles.join(', ');
  }
  return 'height';
}

export function makeTransitionStyles({
  expandStyles = defaultTransitionStyles,
  collapseStyles = defaultTransitionStyles,
}) {
  return {
    expandStyles: {
      ...expandStyles,
      transitionProperty: joinTransitionProperties(
        expandStyles.transitionProperty
      ),
    },
    collapseStyles: {
      ...collapseStyles,
      transitionProperty: joinTransitionProperties(
        collapseStyles.transitionProperty
      ),
    },
  };
}
