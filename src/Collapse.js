// @flow
import {Component, type Node, type Ref} from 'react';
import RAF from 'raf';

// Helper function for render props. Sets a function to be called, plus any additional functions passed in
const callAll = (...fns) => (...args: Array<*>) =>
  fns.forEach(fn => fn && fn(...args));

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
    duration: 500,
    delay: 0,
    easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
    shouldUseTransitions: false
  };

  static counter = 0;

  state = {
    styles: {},
    isOpen: this.getIsOpen({isOpen: this.props.defaultOpen}),
    isOpening: null,
    counter: 0
  };

  componentDidMount() {
    // Iterate counter to create unique IDs for each instance of this component
    // on the page. Used mainly for `aria-` relationships
    this.setState({counter: Collapse.counter++});

    // If open by default, update the height
    // this.transition();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const isCurrentlyOpen = this.getIsOpen();
    if (
      this.collapseEl &&
      this.getIsOpen(prevState, prevProps) !== isCurrentlyOpen
    ) {
      this.startTransition();
    }
  }

  startTransition = () => {
    if (this.getIsOpen()) {
      this.setClosed();
    } else {
      this.setOpen();
    }
  };

  setClosed = () => {
    const height = this.getCollapsibleHeight();
    return Promise.resolve().then(() => {
      return this.setStyles({height: `${height}px`}).then(() => {
        this.setState({isOpening: 'closing'});
        return RAF(() => this.setStyles({height: '0px', overflow: 'hidden'}));
      });
    });
  };

  setOpen = () =>
    Promise.resolve().then(() => {
      return this.setStyles({display: 'block', overflow: 'hidden'}).then(() => {
        const height = this.getCollapsibleHeight();
        this.setState({isOpening: 'opening'});
        return this.setStyles({height: `${height}px`});
      });
    });

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
    if (this.state.isOpening === 'opening') {
      this.setState(prevState => ({
        isOpening: null,
        styles: {
          ...prevState.styles,
          display: '',
          overflow: '',
          height: 'auto'
        }
      }));
    }
    if (this.state.isOpening === 'closing') {
      this.setState(prevState => ({
        isOpening: null,
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
  getCollapsibleProps = (
    {refKey, ...props}: getCollapsibleProps = {refKey: 'ref'}
  ) => {
    const ref = props.refKey || 'ref';
    debugger;
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
        transition: `height ${this.props.duration}ms ${this.props.easing} ${
          this.props.delay
        }ms`
      }
    };
  };

  assignCollapsibleRef = (node: ?HTMLElement) => (this.collapseEl = node);

  render() {
    console.log({styles: this.state.styles, isOpen: this.state.isOpen});
    return this.props.children({
      isOpen: Boolean(this.getIsOpen()),
      getTogglerProps: this.getTogglerProps,
      getCollapsibleProps: this.getCollapsibleProps
    });
  }
}
