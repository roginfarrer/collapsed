import {useState, useRef, useCallback, useMemo} from 'react';
import raf from 'raf';
import {callAll, noop, getElementHeight, makeTransitionStyles} from './utils';
import {useUniqueId, useLayoutEffectAfterMount, useStateOrProps} from './hooks';

export default function useCollapse(initialConfig = {}) {
  const uniqueId = useUniqueId();
  const el = useRef(null);
  const [isOpen, setOpen] = useStateOrProps(initialConfig);
  const [shouldAnimateOpen, setShouldAnimateOpen] = useState(null);
  const [heightAtTransition, setHeightAtTransition] = useState(0);
  const {expandStyles, collapseStyles, restingStyles} = useMemo(
    () => makeTransitionStyles(initialConfig),
    [initialConfig]
  );
  const [styles, setStyles] = useState(
    isOpen ? restingStyles : {display: 'none', height: '0px'}
  );
  const [mountChildren, setMountChildren] = useState(isOpen);

  const toggleOpen = useCallback(() => setOpen(oldOpen => !oldOpen), []);

  useLayoutEffectAfterMount(() => {
    if (isOpen) {
      setMountChildren(true);
      setStyles(oldStyles => ({
        ...oldStyles,
        ...expandStyles,
        display: 'block',
        overflow: 'hidden',
      }));
      setShouldAnimateOpen(true);
    } else {
      const height = getElementHeight(el);
      setStyles(oldStyles => ({...oldStyles, ...collapseStyles, height}));
      setShouldAnimateOpen(false);
    }
  }, [isOpen]);

  useLayoutEffectAfterMount(() => {
    const height = getElementHeight(el);
    if (shouldAnimateOpen) {
      setStyles(oldStyles => ({...oldStyles, height}));
      setHeightAtTransition(height);
    } else {
      // requstAnimationFrame required to transition, otherwise will flash closed
      raf(() => {
        setStyles(oldStyles => ({
          ...oldStyles,
          height: '0px',
          overflow: 'hidden',
        }));
        setHeightAtTransition(height);
      });
    }
  }, [shouldAnimateOpen]);

  const handleTransitionEnd = e => {
    // Sometimes onTransitionEnd is triggered by another transition,
    // such as a nested collapse panel transitioning. But we only
    // want to handle this if this component's element is transitioning
    if (e.target !== el.current) {
      return;
    }

    const height = getElementHeight(el);
    if (isOpen && height !== heightAtTransition) {
      setHeightAtTransition(height);
      setStyles(oldStyles => ({...oldStyles, height}));
      return;
    }

    if (isOpen) {
      setStyles(restingStyles);
    } else {
      setMountChildren(false);
      setStyles({
        display: 'none',
        height: '0px',
      });
    }
  };

  return {
    getToggleProps(
      {disabled, onClick, ...rest} = {
        disabled: false,
        onClick: noop,
      }
    ) {
      return {
        type: 'button',
        role: 'button',
        id: `react-collapsed-toggle-${uniqueId}`,
        'aria-controls': `react-collapsed-panel-${uniqueId}`,
        'aria-expanded': isOpen ? 'true' : 'false',
        tabIndex: 0,
        ...rest,
        onClick: disabled ? noop : callAll(onClick, toggleOpen),
      };
    },
    getCollapseProps(
      {style, onTransitionEnd, ...rest} = {style: {}, onTransitionEnd: noop}
    ) {
      return {
        id: `react-collapsed-panel-${uniqueId}`,
        'aria-hidden': isOpen ? null : 'true',
        ...rest,
        ref: el,
        onTransitionEnd: callAll(handleTransitionEnd, onTransitionEnd),
        style: {
          // style from argument
          ...style,
          // styles from state
          ...styles,
        },
      };
    },
    isOpen,
    toggleOpen,
    mountChildren,
  };
}
