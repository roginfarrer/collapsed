// @flow
import {Component, type Node, type Ref} from 'react';
import {callAll, generateId} from './utils';
import RAF from 'raf';

// @TODO support different open and closing animations

const CLOSING = 'closing';
const OPENING = 'opening';
const WAITING = 'waiting';

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
  collapsedHeight: number,
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
    collapsedHeight: 0,
    duration: 600,
    delay: 0,
    easing: 'cubic-bezier(0.250, 0.460, 0.450, 0.940)',
    shouldUseTransitions: false
  };

  state = {
    styles: this.getIsOpen({isOpen: this.props.defaultOpen})
      ? {}
      : {display: 'none', height: '0px'},
    isOpen: this.getIsOpen({isOpen: this.props.defaultOpen}),
    transitionState: null
  };

  componentDidMount() {
    // Iterate counter to create unique IDs for each instance of this component
    // on the page. Used mainly for `aria-` relationships
    this.setState({counter: generateId()});

    if (this.getIsOpen()) {
      this.setOpen();
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const isCurrentlyOpen = this.getIsOpen();
    // if (
    //   prevState.style.height === '0px' && this.state.style.height !== '0px'
    // ) {
    //   console.log('set height to auto');
    //   this.setState({transitionState: WAITING})
    // } else if (this.state.transitionState === WAITING) {
    //   this.setState({transitionState: null, styles: {height: 'auto'}});
    // }
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

  // componentWillUnmount() {
  //   RAF.cancel(this.raf);
  // }

  setClosed = () => {
    const height = this.getCollapsibleHeight();
    return Promise.resolve().then(() => {
      return this.setStyles({height: `${height}px`}).then(() => {
        this.setState({transitionState: 'closing'});
        return RAF(() => this.setStyles({height: '0px', overflow: 'hidden'}));
      });
    });
  };

  setOpen = () => {
    const totalDuration = this.props.duration + this.props.delay;
    return Promise.resolve().then(() => {
      return this.setStyles({display: 'block', overflow: 'hidden'}).then(() => {
        const height = this.getCollapsibleHeight();
        this.setState({transitionState: 'opening'});
        return this.setStyles({height: `${height}px`});
        // .then(() => {
        //   this.timeout = setTimeout(() => {
        //     console.log('end transition');
        //   }, totalDuration);
        // });
      });
    });
  };

  getCollapsibleHeight = () => {
    if (!this.collapseEl) {
      return 'auto';
    }
    return this.collapseEl.scrollHeight;
  };

  setStyles = (newStyles: Styles) => {
    return new Promise<any>(resolve => {
      const check = () => {
        this.setState(
          ({styles}) => ({styles: {...styles, ...newStyles}}),
          () => {
            RAF(() => {
              if (
                Object.keys(newStyles).some(
                  key =>
                    !this.collapseEl ||
                    this.collapseEl.style[key] !== newStyles[key]
                )
              ) {
                console.log('returning check');
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

  handleTransitionEnd = () => {
    if (this.state.transitionState === 'opening') {
      console.log('set to auto');
      this.setState(prevState => ({
        transitionState: null,
        styles: {
          ...prevState.styles,
          display: '',
          overflow: '',
          height: 'auto'
        }
      }));
    }
    if (this.state.transitionState === 'closing') {
      this.setState(prevState => ({
        transitionState: null,
        styles: {
          ...prevState.styles,
          overflow: '',
          display: 'none'
        }
      }));
    }
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

  toggleIsOpen = () => this.setState(({isOpen}) => ({isOpen: !isOpen}));

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
    return {
      id: `CollapsePanel-${this.state.counter}`,
      'aria-hidden': Boolean(this.getIsOpen()),
      ...props,
      [ref]: callAll(this.assignCollapsibleRef, props[ref]),
      onTransitionEnd: this.handleTransitionEnd,
      style: {
        // @TODO: throw a warning if they pass in properties that might conflict with the animation
        ...props.style,
        ...this.state.styles,
        overflow: 'hidden',
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
