import {useState, useRef, useCallback, useMemo} from 'react';
import {callAll, useUniqueId, noop, useLayoutEffectAfterMount} from './utils';
import RAF from 'raf';

function getElHeight(el) {
  if (!el || !el.current) {
    return 'auto';
  }
  return `${el.current.scrollHeight}px`;
}

function maybeUseState(
  {isOpen, initialOpen} = {
    initialOpen: false
  }
) {
  const [open, setOpen] = useState(initialOpen);
  const definedOpen = typeof isOpen !== 'undefined' ? isOpen : open;
  return [definedOpen, setOpen];
}

const defaultTransitionStyles = {
  transitionDuration: '500ms',
  transitionTimingFunction: 'cubic-bezier(0.250, 0.460, 0.450, 0.940)'
};

function makeTransitionStyles({
  expand = defaultTransitionStyles,
  collapse = defaultTransitionStyles
}) {
  return {
    expandStyles: {
      ...expand,
      transitionProperty: `${expand.transitionProperty || ''} height`
    },
    collapseStyles: {
      ...collapse,
      transitionProperty: `${collapse.transitionProperty || ''} height`
    }
  };
}

// config will be transition styles
export function useCollapse(initialOpen = false, config = {}) {
  const uniqueId = useUniqueId();
  const el = useRef(null);
  const [isOpen, setOpen] = maybeUseState(initialOpen);
  const [shouldAnimateOpen, setShouldAnimateOpen] = useState(null);
  const [heightAtTransition, setHeightAtTransition] = useState('0');
  const [styles, setStyles] = useState(
    isOpen ? null : {display: 'none', height: '0px'}
  );

  const {expandStyles, collapseStyles} = useMemo(
    () => makeTransitionStyles(config),
    [config]
  );

  useLayoutEffectAfterMount(() => {
    if (isOpen) {
      setStyles(styles => ({
        ...styles,
        ...expandStyles,
        display: 'block',
        overflow: 'hidden'
      }));
      setShouldAnimateOpen(true);
    } else {
      const height = getElHeight(el);
      setStyles(styles => ({...styles, ...collapseStyles, height}));
      setShouldAnimateOpen(false);
    }
  }, [isOpen]);

  useLayoutEffectAfterMount(() => {
    if (shouldAnimateOpen) {
      const height = getElHeight(el);
      setStyles(styles => ({...styles, height}));
      setHeightAtTransition(height);
    } else {
      // RAF required to transition, otherwise will flash closed
      RAF(() => {
        const height = getElHeight(el);
        setHeightAtTransition(height);
        setStyles(styles => ({
          ...styles,
          height: '0px',
          overflow: 'hidden'
        }));
      });
    }
  }, [shouldAnimateOpen]);

  const handleTransitionEnd = useCallback(
    e => {
      if (e) {
        e.persist();

        // Only handle transitionEnd for this element
        if (e.target !== el.current) {
          return;
        }
      }

      const height = getElHeight(el);
      if (isOpen && height !== heightAtTransition) {
        setHeightAtTransition(height);
        setStyles(styles => ({...styles, height}));
        return;
      }

      if (isOpen) {
        setStyles({});
      } else {
        setStyles({
          display: 'none',
          height: '0px'
        });
      }
    },
    [shouldAnimateOpen]
  );

  const toggleOpen = useCallback(() => setOpen(oldOpen => !oldOpen), []);

  return {
    getTogglerProps(
      {disabled, onClick, ...rest} = {
        disabled: false,
        onClick: noop
      }
    ) {
      return {
        type: 'button',
        role: 'button',
        id: `react-collapsed-toggle-${uniqueId}`,
        'aria-controls': `react-collapsed-panel-${uniqueId}`,
        'aria-expanded': isOpen,
        tabIndex: 0,
        ...rest,
        onClick: disabled ? noop : callAll(onClick, toggleOpen)
      };
    },
    getCollapseProps({style, ...rest} = {style: {}}) {
      return {
        id: `react-collapsed-panel-${uniqueId}`,
        'aria-hidden': isOpen ? null : 'true',
        ...rest,
        ref: el,
        onTransitionEnd: handleTransitionEnd,
        style: {
          // style from argument
          ...style,
          // styles from state
          ...styles
        }
      };
    },
    isOpen,
    toggleOpen
  };
}
