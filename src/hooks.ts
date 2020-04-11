import { useState, useRef, useEffect, useCallback } from 'react';
import warning from 'tiny-warning';

export function useControlledState({
  isOpen,
  defaultOpen,
}: {
  isOpen?: boolean;
  defaultOpen?: boolean;
}): [boolean, () => void] {
  const [stateIsOpen, setStateIsOpen] = useState<boolean>(defaultOpen || false);
  const initiallyControlled = useRef<boolean>(isOpen != null);
  const open = initiallyControlled.current ? isOpen || false : stateIsOpen;
  const toggleOpen = useCallback(() => {
    if (!initiallyControlled.current) {
      setStateIsOpen(oldOpen => !oldOpen);
    }
  }, []);

  useEffect(() => {
    warning(
      !(initiallyControlled.current && isOpen == null),
      'useCollapse is changing from controlled to uncontrolled. useCollapse should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled collapse for the lifetime of the component. Check the `isOpen` prop.'
    );
    warning(
      !(!initiallyControlled.current && isOpen != null),
      'useCollapse is changing from uncontrolled to controlled. useCollapse should not switch from uncontrolled to controlled (or vice versa). Decide between using a controlled or uncontrolled collapse for the lifetime of the component. Check the `isOpen` prop.'
    );
  }, [isOpen]);

  return [open, toggleOpen];
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
