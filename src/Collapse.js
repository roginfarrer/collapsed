// @flow

import {Component, type Node, type Ref} from 'react';
import {callAll, generateId} from './utils';
import RAF from 'raf';

type getCollapsibleProps = {
  refKey: string
};

type Props = {
  children: ({
    isOpen: boolean,
    getTogglerProps: (*) => {},
    getCollapsibleProps: getCollapsibleProps => {},
    contentRef: Ref<*>
  }) => Node,
  isOpen: ?boolean,
  defaultOpen: boolean,
  duration: number,
  easing: string,
  delay: number
};

type Styles = {
  height?: string,
  overflow?: string,
  display?: string
};

type State = {
  styles: Styles,
  isOpen: ?boolean,
  counter: number
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
    transitionState: null
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
            this.styleCheck = RAF(() => {
              if (
                Object.keys(newStyles).some(key => {
                  return (
                    !this.collapseEl ||
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

  handleTransitionEnd = e => {
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
        console.log('hey');
        return {
          heightAtTransition: height,
          styles: {...styles, height}
        };
      });
      return;
    }

    RAF(this.completeTransition);
  };

  collapseEl: ?HTMLElement;

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

  getTogglerProps = (props: {onClick: ?() => void} = {onClick() {}}) => {
    return {
      id: `CollapseToggle-${this.state.counter}`,
      'aria-controls': `CollapsePanel-${this.state.counter}`,
      'aria-expanded': Boolean(this.getIsOpen()),
      tabIndex: 0,
      ...props,
      onClick: callAll(props.onClick, this.toggleIsOpen)
    };
  };

  // For those with a hard time reading Flow, this destructures refKey off of props,
  // and gives it a default of 'ref'
  getCollapsibleProps = (props: getCollapsibleProps = {refKey: 'ref'}) => {
    const ref = props.refKey || 'ref';
    const isOpen = this.getIsOpen();
    return {
      id: `CollapsePanel-${this.state.counter}`,
      'aria-hidden': Boolean(isOpen),
      ...props,
      [ref]: callAll(this.assignCollapsibleRef, props[ref]),
      onTransitionEnd: this.handleTransitionEnd,
      style: {
        // @TODO: throw a warning if they pass in properties that might conflict with the animation
        ...props.style,
        ...this.state.styles,
        transition: `height ${this.props.duration}ms ${this.props.easing} ${
          this.props.delay
        }ms`
      }
    };
  };

  assignCollapsibleRef = (node: ?HTMLElement) => (this.collapseEl = node);

  render() {
    return this.props.children({
      isOpen: Boolean(this.getIsOpen()),
      getTogglerProps: this.getTogglerProps,
      getCollapsibleProps: this.getCollapsibleProps
    });
  }
}
