import { useState, useRef, TransitionEvent, CSSProperties } from 'react';
import raf from 'raf';
import {
  noop,
  callAll,
  getElementHeight,
  getAutoHeightDuration,
} from './utils';
import { useUniqueId, useEffectAfterMount, useStateOrProps } from './hooks';
import {
  CollapseConfig,
  CollapseAPI,
  GetCollapsePropsAPI,
  GetCollapsePropsShape,
  GetTogglePropsAPI,
  GetTogglePropsShape,
} from './types';

const easeInOut = 'cubic-bezier(0.4, 0, 0.2, 1)';

export default function useCollapse(
  initialConfig: CollapseConfig = {}
): CollapseAPI {
  const {
    transitionTimingFunction = easeInOut,
    collapseStyles = {},
    expandStyles = {},
  } = initialConfig;
  const uniqueId = useUniqueId();
  const el = useRef<HTMLElement | null>(null);
  const collapsedHeight = `${initialConfig.collapsedHeight || 0}px`;
  const collapsedStyles = {
    display: collapsedHeight === '0px' ? 'none' : 'block',
    height: collapsedHeight,
    overflow: 'hidden',
  };
  const [isOpen, toggleOpen] = useStateOrProps(initialConfig);
  const [styles, setStyles] = useState<CSSProperties>(
    isOpen ? {} : collapsedStyles
  );
  const [mountChildren, setMountChildren] = useState(isOpen);
  const mergeStyles = (newStyles: {}): void => {
    setStyles(oldStyles => ({ ...oldStyles, ...newStyles }));
  };

  function getTransitionStyles(
    height: number | string,
    state: 'expand' | 'collapse'
  ): { transition: string } {
    const duration = getAutoHeightDuration(height);
    let curve = transitionTimingFunction;
    if (typeof transitionTimingFunction !== 'string') {
      if (transitionTimingFunction.expand && state === 'expand') {
        curve = transitionTimingFunction.expand;
      } else if (transitionTimingFunction.collapse && state === 'collapse') {
        curve = transitionTimingFunction.collapse;
      }
    }
    return {
      transition: `height ${duration}ms ${curve}`,
    };
  }

  useEffectAfterMount(() => {
    if (isOpen) {
      raf(() => {
        setMountChildren(true);
        mergeStyles({
          ...expandStyles,
          willChange: 'height',
          display: 'block',
          overflow: 'hidden',
        });
        raf(() => {
          const height = getElementHeight(el);
          mergeStyles({
            ...getTransitionStyles(height, 'expand'),
            height,
          });
        });
      });
    } else {
      raf(() => {
        const height = getElementHeight(el);
        mergeStyles({
          ...collapseStyles,
          ...getTransitionStyles(height, 'collapse'),
          willChange: 'height',
          height,
        });
        raf(() => {
          mergeStyles({
            height: collapsedHeight,
            overflow: 'hidden',
          });
        });
      });
    }
  }, [isOpen]);

  const handleTransitionEnd = (e: TransitionEvent): void => {
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
      } else {
        // If the heights don't match, this could be due the height of the content changing mid-transition
        // If that's the case, re-trigger the animation to animate to the new height
        mergeStyles({ height });
      }
      // If the height we should be animating to matches the collapsed height,
      // it's safe to apply the collapsed overrides
    } else if (styles.height === collapsedHeight) {
      setMountChildren(false);
      setStyles(collapsedStyles);
    }
  };

  function getToggleProps(props: GetTogglePropsShape = {}): GetTogglePropsAPI {
    const { disabled = false, onClick = noop, ...rest } = props;
    return {
      type: 'button',
      role: 'button',
      id: `react-collapsed-toggle-${uniqueId}`,
      'aria-controls': `react-collapsed-panel-${uniqueId}`,
      'aria-expanded': isOpen,
      tabIndex: 0,
      disabled,
      ...rest,
      onClick: disabled ? noop : callAll(onClick, toggleOpen),
    };
  }

  function getCollapseProps(
    props: GetCollapsePropsShape = {}
  ): GetCollapsePropsAPI {
    const {
      style = {},
      onTransitionEnd = noop,
      refKey = 'ref',
      ...rest
    } = props;
    return {
      id: `react-collapsed-panel-${uniqueId}`,
      'aria-hidden': !isOpen,
      ...rest,
      [refKey]: el,
      onTransitionEnd: callAll(handleTransitionEnd, onTransitionEnd),
      style: {
        // additional styles passed, e.g. getCollapseProps({style: {}})
        ...style,
        // style overrides from state
        ...styles,
      },
    };
  }

  return {
    getToggleProps,
    getCollapseProps,
    isOpen,
    toggleOpen,
    mountChildren,
  };
}
