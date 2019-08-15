import {useState, useRef, useEffect, useMemo} from 'react';

export function useStateOrProps({isOpen, defaultOpen}) {
  const [open, setOpen] = useState(defaultOpen || false);
  const definedOpen = typeof isOpen !== 'undefined' ? isOpen : open;
  return [definedOpen, setOpen];
}

export function useEffectAfterMount(cb, dependencies) {
  const justMounted = useRef(true);
  useEffect(() => {
    if (!justMounted.current) {
      return cb();
    }
    justMounted.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}

function useEffectOnMount(cb) {
  const justMounted = useRef(true);
  useEffect(() => {
    if (justMounted.current) {
      return cb();
    }
    justMounted.current = false;
  });
}

let idCounter = 0;

/**
 * This generates a unique ID for an instance of Collapse
 * @return {String} the unique ID
 */
export function useUniqueId() {
  let counter = useMemo(() => idCounter++, []);
  useEffectOnMount(() => {
    counter++;
  });
  return counter;
}
