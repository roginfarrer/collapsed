import { useState, useRef, TransitionEvent, CSSProperties } from 'react';
import {
  noop,
  callAll,
  getElementHeight,
  getAutoHeightDuration,
  warnPadding,
  rAF,
} from './utils';
import { useUniqueId, useEffectAfterMount, useControlledState } from './hooks';
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
    duration = null,
    easing = easeInOut,
    collapseStyles = {},
    expandStyles = {},
  } = initialConfig;
  const uniqueId = useUniqueId();
  const el = useRef<HTMLElement | null>(null);
  const rafRef = useRef<number>(0);
  const collapsedHeight = `${initialConfig.collapsedHeight || 0}px`;
  const collapsedStyles = {
    display: collapsedHeight === '0px' ? 'none' : 'block',
    height: collapsedHeight,
    overflow: 'hidden',
  };
  const [isOpen, toggleOpen] = useControlledState(initialConfig);
  const [styles, setStyles] = useState<CSSProperties>(
    isOpen ? {} : collapsedStyles
  );
  const [mountChildren, setMountChildren] = useState(isOpen);
  const mergeStyles = (newStyles: {}): void => {
    setStyles(oldStyles => ({ ...oldStyles, ...newStyles }));
  };

  warnPadding(el);

  function getTransitionStyles(
    height: number | string,
    state: 'expand' | 'collapse'
  ): { transition: string } {
    const _duration = duration || getAutoHeightDuration(height);
    let _easing = easing;
    if (typeof easing !== 'string') {
      if (easing.expand && state === 'expand') {
        _easing = easing.expand;
      } else if (easing.collapse && state === 'collapse') {
        _easing = easing.collapse;
      }
    }
    return {
      transition: `height ${_duration}ms ${_easing}`,
    };
  }

  useEffectAfterMount(() => {
    if (isOpen) {
      rafRef.current = rAF(() => {
        setMountChildren(true);
        mergeStyles({
          ...expandStyles,
          willChange: 'height',
          display: 'block',
          overflow: 'hidden',
        });
        const height = getElementHeight(el);
        mergeStyles({
          ...getTransitionStyles(height, 'expand'),
          height,
        });
      });
    } else {
      rafRef.current = rAF(() => {
        const height = getElementHeight(el);
        mergeStyles({
          ...collapseStyles,
          ...getTransitionStyles(height, 'collapse'),
          willChange: 'height',
          height,
        });
        mergeStyles({
          height: collapsedHeight,
          overflow: 'hidden',
        });
      });
    }
    return () => {
      rAF.cancel(rafRef.current);
    };
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
      if (height === styles.height) {
        setStyles({});
      } else {
        // If the heights don't match, this could be due the height of the content changing mid-transition
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
