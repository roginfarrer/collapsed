import {useState, useRef, useEffect} from 'react';

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

// Unique ID implementation borrowed from React UI :)
// https://github.com/reach/reach-ui/blob/6e9dbcf716d5c9a3420e062e5bac1ac4671d01cb/packages/auto-id/src/index.js
let idCounter = 0;
const genId = () => ++idCounter;

/**
 * This generates a unique ID for an instance of Collapse
 * @return {String} the unique ID
 */
export function useUniqueId() {
  const [id, setId] = useState(null);
  useEffect(() => setId(genId()), []);
  return id;
}
