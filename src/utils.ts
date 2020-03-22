import { RefObject } from 'react';
import warning from 'warning';

type AnyFunction = (...args: any[]) => unknown;

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = (): void => {};

export function getElementHeight(
  el: RefObject<HTMLElement> | { current?: { scrollHeight: number } }
): string | number {
  if (!el?.current) {
    warning(true, 'hey a ref is missing');
    return 'auto';
  }
  return el.current.scrollHeight;
}

// Helper function for render props. Sets a function to be called, plus any additional functions passed in
export const callAll = (...fns: AnyFunction[]) => (...args: any[]): void =>
  fns.forEach(fn => fn && fn(...args));

// export const defaultTransitionStyles: TransitionStyles = {
//   transitionTimingFunction: 'cubic-bezier(0.250, 0.460, 0.450, 0.940)',
// };

export function joinTransitionProperties(string?: string): string {
  if (string) {
    const styles = ['height'];
    styles.push(...string.split(', '));
    return styles.join(', ');
  }
  return 'height';
}

// https://github.com/mui-org/material-ui/blob/da362266f7c137bf671d7e8c44c84ad5cfc0e9e2/packages/material-ui/src/styles/transitions.js#L89-L98
export function getAutoHeightDuration(height: number | string): number {
  if (!height || typeof height === 'string') {
    return 0;
  }

  const constant = height / 36;

  // https://www.wolframalpha.com/input/?i=(4+%2B+15+*+(x+%2F+36+)+**+0.25+%2B+(x+%2F+36)+%2F+5)+*+10
  return Math.round((4 + 15 * constant ** 0.25 + constant / 5) * 10);
}
