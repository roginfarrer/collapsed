import { useState, useRef, TransitionEvent, CSSProperties } from 'react';
import {
  noop,
  callAll,
  getElementHeight,
  getAutoHeightDuration,
} from './utils';
import {
  usePaddingWarning,
  useUniqueId,
  useEffectAfterMount,
  useControlledState,
} from './hooks';
import {
  CollapseConfig,
  CollapseAPI,
  GetCollapsePropsAPI,
  GetCollapsePropsShape,
  GetTogglePropsAPI,
  GetTogglePropsShape,
} from './types';
import raf from 'raf';

const easeInOut = 'cubic-bezier(0.4, 0, 0.2, 1)';

export default function useCollapse({
  duration,
  easing = easeInOut,
  collapseStyles = {},
  expandStyles = {},
  ...initialConfig
}: CollapseConfig = {}): CollapseAPI {
  const [isOpen, toggleOpen] = useControlledState(initialConfig);
  const uniqueId = useUniqueId();
  const el = useRef<HTMLElement | null>(null);
  usePaddingWarning(el);
  const collapsedHeight = `${initialConfig.collapsedHeight || 0}px`;
  const collapsedStyles = {
    display: collapsedHeight === '0px' ? 'none' : 'block',
    height: collapsedHeight,
    overflow: 'hidden',
  };
  const [styles, setStyles] = useState<CSSProperties>(
    isOpen ? {} : collapsedStyles
  );
  const [mountChildren, setMountChildren] = useState<boolean>(isOpen);
  const mergeStyles = (newStyles: {}): void => {
    setStyles(oldStyles => ({ ...oldStyles, ...newStyles }));
  };

  function getTransitionStyles(
    height: number | string
  ): { transition: string } {
    const _duration = duration || getAutoHeightDuration(height);
    return {
      transition: `height ${_duration}ms ${easing}`,
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
            ...getTransitionStyles(height),
            height,
          });
        });
      });
    } else {
      raf(() => {
        const height = getElementHeight(el);
        mergeStyles({
          ...collapseStyles,
          ...getTransitionStyles(height),
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
    if (e.target !== el.current || e.propertyName !== 'height') {
      return;
    }

    // The height comparisons below are a final check before
    // completing the transition
    // Sometimes this callback is run even though we've already begun
    // transitioning the other direction
    // The conditions give us the opportunity to bail out,
    // which will prevent the collapsed content from flashing on the screen
    if (isOpen) {
      const height = getElementHeight(el);

      // If the height at the end of the transition
      // matches the height we're animating to,
      if (height === styles.height) {
        setStyles({});
      } else {
        // If the heights don't match, this could be due the height
        // of the content changing mid-transition
        mergeStyles({ height });
      }

      // If the height we should be animating to matches the collapsed height,
      // it's safe to apply the collapsed overrides
    } else if (styles.height === collapsedHeight) {
      setMountChildren(false);
      setStyles(collapsedStyles);
    }
  };

  function getToggleProps({
    disabled = false,
    onClick = noop,
    ...rest
  }: GetTogglePropsShape = {}): GetTogglePropsAPI {
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

  function getCollapseProps({
    style = {},
    onTransitionEnd = noop,
    refKey = 'ref',
    ...rest
  }: GetCollapsePropsShape = {}): GetCollapsePropsAPI {
    return {
      id: `react-collapsed-panel-${uniqueId}`,
      'aria-hidden': !isOpen,
      ...rest,
      [refKey]: el,
      onTransitionEnd: callAll(handleTransitionEnd, onTransitionEnd),
      style: {
        boxSizing: 'border-box',
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
