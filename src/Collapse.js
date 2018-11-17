// @flow

import {Component, type Node} from 'react';
import {
  callAll,
  generateId,
  noop,
  makeTransitionStyles,
  warnBreakingStyles
} from './utils';
import type {TransitionProps} from './types';
import RAF from 'raf';

type GetCollapseProps = {
  refKey?: string,
  ref?: string,
  style?: {}
};

type GetTogglerProps = {
  onClick?: () => void,
  disabled?: boolean
};

type Props = TransitionProps & {
  children: ({
    isOpen: boolean,
    getTogglerProps: (*) => {},
    getCollapseProps: (void | GetCollapseProps) => {}
  }) => Node,
  isOpen: ?boolean,
  defaultOpen: boolean
};

type Styles = {
  height?: string,
  overflow?: string,
  display?: string
};

type State = {
  styles: Styles,
  isOpen: ?boolean,
  heightAtTransition: string,
  counter: string
};

export default class Collapse extends Component<Props, State> {
  static defaultProps = {
    isOpen: null,
    defaultOpen: false,
    duration: 500,
    delay: 0,
    easing: 'cubic-bezier(0.250, 0.460, 0.450, 0.940)'
  };

  state = {
    styles: this.getIsOpen({isOpen: this.props.defaultOpen})
      ? {height: 'auto'}
      : {display: 'none', height: '0px'},
    isOpen: this.getIsOpen({isOpen: this.props.defaultOpen}),
    heightAtTransition: '0',
    counter: '0'
  };

  componentDidMount() {
    // Iterate counter to create unique IDs for each instance of this component
    // on the page. Used mainly for `aria-` relationships
    this.setState({counter: generateId()});
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const isCurrentlyOpen = this.getIsOpen();
    if (
      this.collapseEl &&
      this.getIsOpen(prevState, prevProps) !== isCurrentlyOpen
    ) {
      if (isCurrentlyOpen) {
        this.setOpen();
      } else {
        this.setClosed();
      }
    }
  }

  setClosed = () => {
    const height = this.getCollapsibleHeight();
    return Promise.resolve().then(() => {
      return this.setStyles({height}).then(() => {
        return RAF(() => {
          this.setState(({styles}) => ({
            heightAtTransition: height,
            styles: {...styles, height: '0px', overflow: 'hidden'}
          }));
        });
      });
    });
  };

  setOpen = () => {
    return Promise.resolve().then(() => {
      return this.setStyles({
        display: 'block',
        overflow: 'hidden'
      }).then(() => {
        const height = this.getCollapsibleHeight();
        this.setState({heightAtTransition: height});
        return this.setStyles({height});
      });
    });
  };

  getCollapsibleHeight = () => {
    if (!this.collapseEl) {
      return 'auto';
    }
    return `${this.collapseEl.scrollHeight}px`;
  };

  setStyles = (newStyles: Styles) => {
    return new Promise<any>(resolve => {
      const check = () => {
        this.setState(
          ({styles}) => ({styles: {...styles, ...newStyles}}),
          () => {
            RAF(() => {
              if (
                Object.keys(newStyles).some(key => {
                  return (
                    !this.collapseEl ||
                    // $FlowFixMe Not sure why this error is happening?
                    this.collapseEl.style[key] !== newStyles[key]
                  );
                })
              ) {
                return check();
              }
              resolve();
            });
          }
        );
      };
      check();
    });
  };

  completeTransition = () => {
    if (this.getIsOpen()) {
      this.setState(({styles}) => ({
        styles: {...styles, display: '', overflow: '', height: 'auto'}
      }));
    } else {
      this.setState(({styles}) => ({
        styles: {...styles, display: 'none', overflow: ''}
      }));
    }
  };

  handleTransitionEnd = (e: SyntheticEvent<HTMLElement>) => {
    if (e) {
      e.persist();

      // Only handle transitionEnd for this element
      if (e.target !== this.collapseEl) {
        return;
      }
    }

    const height = this.getCollapsibleHeight();
    const isCurrentlyOpen = this.getIsOpen();
    if (isCurrentlyOpen && height !== this.state.heightAtTransition) {
      this.setState(({styles}) => {
        return {
          heightAtTransition: height,
          styles: {...styles, height}
        };
      });
      return;
    }

    if (this.transitionRAF) {
      RAF.cancel(this.transitionRAF);
    }
    this.transitionRAF = RAF(this.completeTransition);
  };

  makeTransitionProperty = () => {
    if (this.getIsOpen()) {
      return makeTransitionStyles(this.props, 'in');
    }
    return makeTransitionStyles(this.props, 'out');
  };

  collapseEl: ?HTMLElement;
  transitionRAF: ?TimeoutID;

  /**
   * Returns the state of the isOpen prop.
   * If it is controlled, return the prop value.
   * If is isn't, use internal state
   */
  getIsOpen(
    state: $Shape<State> = this.state,
    props: $Shape<Props> = this.props
  ) {
    return props.isOpen !== null ? props.isOpen : state.isOpen;
  }

  toggleIsOpen = () => {
    this.setState(({isOpen}) => ({isOpen: !isOpen}));
  };

  getTogglerProps = (
    props: GetTogglerProps = {
      onClick() {},
      disabled: false
    }
  ) => {
    return {
      type: 'button',
      role: 'button',
      id: `CollapseToggle-${this.state.counter}`,
      'aria-controls': `CollapsePanel-${this.state.counter}`,
      'aria-expanded': Boolean(this.getIsOpen()),
      tabIndex: 0,
      ...props,
      onClick: props.disabled ? noop : callAll(props.onClick, this.toggleIsOpen)
    };
  };

  // For those with a hard time reading Flow, this destructures refKey off of props,
  // and gives it a default of 'ref'
  getCollapseProps = (
    {refKey, ...props}: GetCollapseProps = {refKey: 'ref'}
  ) => {
    const ref = refKey || 'ref';
    const isOpen = this.getIsOpen();

    if (process.env.NODE_ENV !== 'production' && props.style) {
      warnBreakingStyles(props.style);
    }

    return {
      id: `CollapsePanel-${this.state.counter}`,
      'aria-hidden': !isOpen,
      ...props,
      [ref]: callAll(this.assignCollapsibleRef, props[ref]),
      onTransitionEnd: this.handleTransitionEnd,
      style: {
        ...props.style,
        ...this.state.styles,
        ...this.makeTransitionProperty(),
        transitionProperty: 'height'
      }
    };
  };

  assignCollapsibleRef = (node: ?HTMLElement) => (this.collapseEl = node);

  render() {
    return this.props.children({
      isOpen: Boolean(this.getIsOpen()),
      getTogglerProps: this.getTogglerProps,
      getCollapseProps: this.getCollapseProps
    });
  }
}
