import {useState, useRef, useCallback, useMemo} from 'react';
import raf from 'raf';
import {
  callAll,
  noop,
  getElementHeight,
  makeTransitionStyles,
  joinTransitionProperties,
  defaultTransitionStyles,
} from './utils';
import {useUniqueId, useEffectAfterMount, useStateOrProps} from './hooks';

export default function useCollapse(initialConfig = {}) {
  const uniqueId = useUniqueId();
  const el = useRef(null);
  const [isOpen, setOpen] = useStateOrProps(initialConfig);
  const collapsedHeight = `${initialConfig.collapsedHeight || 0}px`;
  const {expandStyles, collapseStyles} = useMemo(
    () => makeTransitionStyles(initialConfig),
    [initialConfig]
  );
  const [styles, setStyles] = useState(
    isOpen
      ? null
      : {
          display: collapsedHeight === '0px' ? 'none' : 'block',
          height: collapsedHeight,
          overflow: 'hidden',
        }
  );
  const [mountChildren, setMountChildren] = useState(isOpen);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const toggleOpen = useCallback(() => setOpen(oldOpen => !oldOpen), []);

  useEffectAfterMount(() => {
    if (isOpen) {
      raf(() => {
        setMountChildren(true);
        setStyles(oldStyles => ({
          ...oldStyles,
          ...expandStyles,
          willChange: 'height',
          display: 'block',
          overflow: 'hidden',
        }));
        raf(() => {
          const height = getElementHeight(el);
          setStyles(oldStyles => ({...oldStyles, height}));
        });
      });
    } else {
      raf(() => {
        const height = getElementHeight(el);
        setStyles(oldStyles => ({
          ...oldStyles,
          ...collapseStyles,
          willChange: 'height',
          height,
        }));
        raf(() => {
          setStyles(oldStyles => ({
            ...oldStyles,
            height: collapsedHeight,
            overflow: 'hidden',
          }));
        });
      });
    }
  }, [isOpen]);

  const handleTransitionEnd = e => {
    // Sometimes onTransitionEnd is triggered by another transition,
    // such as a nested collapse panel transitioning. But we only
    // want to handle this if this component's element is transitioning
    if (e.target !== el.current) {
      return;
    }

    // The height comparisons below are a final check before completing the transition
    // Sometimes this callback is run even though we've already begun transitioning the other direction
    // The conditions give us the opportunity to bail out, which will prevent the collapsed content from flashing on the screen
    if (isOpen) {
      const height = getElementHeight(el);
      // If the height at the end of the transition matches the height we're animating to,
      // it's safe to clear all style overrides
      if (height === styles.height) {
        setStyles({});
      }
      // If the height we should be animating to matches the collapsed height,
      // it's safe to apply the collapsed overrides
    } else if (styles.height === collapsedHeight) {
      setMountChildren(false);
      setStyles({
        willChange: '',
        overflow: 'hidden',
        display: collapsedHeight === '0px' ? 'none' : 'block',
        height: collapsedHeight,
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
          // Default transition duration and timing function, so height will transition
          // when resting and the height of the collapse changes
          ...defaultTransitionStyles,
          // additional styles passed, e.g. getCollapseProps({style: {}})
          ...style,
          // combine any additional transition properties with height
          transitionProperty: joinTransitionProperties(
            style.transitionProperty
          ),
          // style overrides from state
          ...styles,
        },
      };
    },
    isOpen,
    toggleOpen,
    mountChildren,
  };
}
