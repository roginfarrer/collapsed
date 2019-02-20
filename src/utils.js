// @flow

import {useRef, useEffect} from 'react';
import type {TransitionProps} from './types';

let idCounter = 0;

export const noop = () => {};

/**
 * This generates a unique ID for an instance of Collapse
 * @return {String} the unique ID
 */
export function useUniqueId() {
  const firstUpdate = useRef(true);

  useEffect(() => {
    if (firstUpdate.current) {
      String(idCounter++);
      firstUpdate.current = false;
    }
  }, []);

  console.log(idCounter, firstUpdate);

  return {
    isFirstRender: firstUpdate.current,
    uniqueId: idCounter
  };
}
export const generateId = (): string => String(idCounter++);

// Helper function for render props. Sets a function to be called, plus any additional functions passed in
export const callAll = (...fns: any) => (...args: Array<*>) =>
  fns.forEach(fn => fn && fn(...args));

export const makeTransitionStyles = (
  props: TransitionProps,
  direction: 'in' | 'out'
) => {
  const {easing, delay, duration} = props;
  return {
    transitionTimingFunction:
      typeof easing === 'string' ? easing : easing[direction],
    transitionDuration: `${
      typeof duration === 'number' ? duration : duration[direction]
    }ms`,
    transitionDelay: `${typeof delay === 'number' ? delay : delay[direction]}ms`
  };
};

const STYLE_PROPERTY_BLACKLIST = [
  'height',
  'transitionDelay',
  'transitionDuration',
  'transition',
  'transitionDelay',
  'transitionTimingFunction'
];

let WARNING_CALLED = false;
export const warnBreakingStyles = (style: {}) => {
  const stylesToWarn = Object.keys(style).filter(prop =>
    STYLE_PROPERTY_BLACKLIST.includes(prop)
  );
  if (stylesToWarn.length > 0 && !WARNING_CALLED) {
    WARNING_CALLED = true;
    // eslint-disable-next-line no-console
    console.warn(
      `react-collapsed: A style property was passed to the Collapse that conflicts with the animation behavior of the component. Remove the following properties to ensure the normal behavior of the component: ${stylesToWarn.join(
        ', '
      )}`
    );
  }
};
