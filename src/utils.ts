import { RefObject, useState, useRef, useEffect, useCallback } from 'react';
import warning from 'tiny-warning';
import { AssignableRef } from './types';

type AnyFunction = (...args: any[]) => unknown;

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = (): void => {};

export function getElementHeight(
  el: RefObject<HTMLElement> | { current?: { scrollHeight: number } }
): string | number {
  if (!el?.current) {
    warning(
      true,
      `useCollapse was not able to find a ref to the collapse element via \`getCollapseProps\`. Ensure that the element exposes its \`ref\` prop. If it exposes the ref prop under a different name (like \`innerRef\`), use the \`refKey\` property to change it. Example:

{...getCollapseProps({refKey: 'innerRef'})}`
    );
    return 'auto';
  }
  return el.current.scrollHeight;
}

// Helper function for render props. Sets a function to be called, plus any additional functions passed in
export const callAll = (...fns: AnyFunction[]) => (...args: any[]): void =>
  fns.forEach((fn) => fn && fn(...args));

// https://github.com/mui-org/material-ui/blob/da362266f7c137bf671d7e8c44c84ad5cfc0e9e2/packages/material-ui/src/styles/transitions.js#L89-L98
export function getAutoHeightDuration(height: number | string): number {
  if (!height || typeof height === 'string') {
    return 0;
  }

  const constant = height / 36;

  // https://www.wolframalpha.com/input/?i=(4+%2B+15+*+(x+%2F+36+)+**+0.25+%2B+(x+%2F+36)+%2F+5)+*+10
  return Math.round((4 + 15 * constant ** 0.25 + constant / 5) * 10);
}

export function assignRef<RefValueType = any>(
  ref: AssignableRef<RefValueType> | null | undefined,
  value: any
) {
  if (ref == null) return;
  if (typeof ref === 'function') {
    ref(value);
  } else {
    try {
      ref.current = value;
    } catch (error) {
      throw new Error(`Cannot assign value "${value}" to ref "${ref}"`);
    }
  }
}

/**
 * Passes or assigns a value to multiple refs (typically a DOM node). Useful for
 * dealing with components that need an explicit ref for DOM calculations but
 * also forwards refs assigned by an app.
 *
 * @param refs Refs to fork
 */
export function mergeRefs<RefValueType = any>(
  ...refs: (AssignableRef<RefValueType> | null | undefined)[]
) {
  if (refs.every((ref) => ref == null)) {
    return null;
  }
  return (node: any) => {
    refs.forEach((ref) => {
      assignRef(ref, node);
    });
  };
}

export function useControlledState(
  isExpanded?: boolean,
  defaultExpanded?: boolean
): [boolean, React.Dispatch<React.SetStateAction<boolean>>] {
  const [stateExpanded, setStateExpanded] = useState(defaultExpanded || false);
  const initiallyControlled = useRef(isExpanded != null);
  const expanded = initiallyControlled.current
    ? (isExpanded as boolean)
    : stateExpanded;
  const toggleExpanded = useCallback((n) => {
    if (!initiallyControlled.current) {
      setStateExpanded(n);
    }
  }, []);

  useEffect(() => {
    warning(
      !(initiallyControlled.current && isExpanded == null),
      'useCollapse is changing from controlled to uncontrolled. useCollapse should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled collapse for the lifetime of the component. Check the `isExpanded` prop.'
    );
    warning(
      !(!initiallyControlled.current && isExpanded != null),
      'useCollapse is changing from uncontrolled to controlled. useCollapse should not switch from uncontrolled to controlled (or vice versa). Decide between using a controlled or uncontrolled collapse for the lifetime of the component. Check the `isExpanded` prop.'
    );
  }, [isExpanded]);

  return [expanded, toggleExpanded];
}

export function useEffectAfterMount(
  cb: () => void,
  dependencies: unknown[]
): void {
  const justMounted = useRef(true);
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (!justMounted.current) {
      return cb();
    }
    justMounted.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}

// Unique ID implementation borrowed from React UI :)
// https://github.com/reach/reach-ui/blob/6e9dbcf716d5c9a3420e062e5bac1ac4671d01cb/packages/auto-id/src/index.js
let idCounter = 0;
const genId = (): number => ++idCounter;

/**
 * This generates a unique ID for an instance of Collapse
 * @return {String} the unique ID
 */
export function useUniqueId(): number {
  const [id, setId] = useState(0);
  useEffect(() => setId(genId()), []);
  return id;
}

export function usePaddingWarning(element: RefObject<HTMLElement>): void {
  // @ts-ignore
  let warn = (el?: RefObject<HTMLElement>): void => {};

  if (__DEV__) {
    warn = (el) => {
      if (!el?.current) {
        return;
      }
      const { paddingTop, paddingBottom } = window.getComputedStyle(el.current);
      const hasPadding =
        (paddingTop && paddingTop !== '0px') ||
        (paddingBottom && paddingBottom !== '0px');

      warning(
        !hasPadding,
        'react-collapsed: Padding applied to the collapse element will cause the animation to break and not perform as expected. To fix, apply equivalent padding to the direct descendent of the collapse element.'
      );
    };
  }

  useEffect(() => {
    warn(element);
  }, [element]);
}
