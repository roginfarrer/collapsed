// @flow

import {PureComponent, type Node, type Ref} from 'react';
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
  height?: number | string,
  overflow?: string,
  display?: string
};

type State = {
  styles: Styles,
  isOpen: ?boolean,
  counter: number
};

// Start animation helper using nested requestAnimationFrames
const startAnimationHelper = (callback: () => {}) => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      callback();
    });
  });
};

export default class Collapse extends PureComponent<Props, State> {
  static defaultProps = {
    isOpen: null,
    defaultOpen: false,
    collapsedHeight: 0,
    duration: 1000,
    delay: 0,
    easing: 'linear',
    shouldUseTransitions: false
  };

  static counter = 0;

  state = {
    // height: this.props.collapsedHeight,
    // overflow: this.getIsOpen({isOpen: this.props.defaultOpen}) ? '' : 'hidden',
    styles: {
      // display: 'block',
      // height: 'auto',
      // overflow: 'visible'
    },
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

  // componentDidUpdate(prevProps: Props, prevState: State) {
  //   const {delay, duration} = this.props;
  //   const isCurrentlyOpen = this.getIsOpen();
  //   // Check if 'height' prop has changed
  //   if (
  //     this.content &&
  //     this.getIsOpen(prevState, prevProps) !== isCurrentlyOpen
  //   ) {
  //     // Cache content height
  //     var style = window.getComputedStyle(this.content);
  //     var marginTop = style.getPropertyValue('margin-top');
  //     var marginBottom = style.getPropertyValue('margin-bottom');
  //     const contentHeight =
  //       this.content.offsetHeight +
  //       parseInt(marginTop.split('p')[0], 10) +
  //       parseInt(marginBottom.split('p')[0], 10);

  //     // set total animation time
  //     const totalDuration = duration + delay;

  //     let newHeight = null;
  //     const timeoutState = {
  //       height: null // it will be always set to either 'auto' or specific number
  //     };
  //     const isCurrentHeightAuto = prevState.height === 'auto';

  //     if (isCurrentlyOpen) {
  //       // If new height is a number
  //       newHeight = 0;
  //       timeoutState.height = newHeight;
  //     } else {
  //       // If not, animate to content height
  //       // and then reset to auto
  //       newHeight = contentHeight;
  //       timeoutState.height = 'auto';
  //     }

  //     if (isCurrentHeightAuto) {
  //       // This is the height to be animated to
  //       timeoutState.height = newHeight;

  //       // If previous height was 'auto'
  //       // set starting height explicitly to be able to use transition
  //       newHeight = contentHeight;
  //     }

  //     RAF(() =>
  //       this.setState({
  //         height: newHeight
  //       })
  //     );

  //     // Clear timeouts
  //     console.log(timeoutState);

  //     if (isCurrentHeightAuto) {
  //       RAF(() => {
  //         this.setState(timeoutState);
  //       });
  //     } else {
  //       clearTimeout(this.timeoutID);
  //       this.timeoutID = setTimeout(() => {
  //         RAF(() => this.setState(timeoutState));
  //       }, totalDuration);
  //     }
  //   }
  // }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const isCurrentlyOpen = this.getIsOpen();
    // Check if 'height' prop has changed
    // if (
    //   this.collapsible &&
    //   this.getIsOpen(prevState, prevProps) !== isCurrentlyOpen
    // ) {
    //   debugger;
    //   this.setState({isOpening: 'opening'});
    // } else {
    //   debugger;
    //   this.setState({isOpening: 'closing'});
    // }
    if (
      this.collapsible &&
      this.getIsOpen(prevState, prevProps) !== isCurrentlyOpen
    ) {
      this.transition();
    }
  }

  // getTransitionDimensions = () => {
  //   // Cache content height
  //   const style = window.getComputedStyle(this.content);
  //   const marginTop = style.getPropertyValue('margin-top');
  //   const marginBottom = style.getPropertyValue('margin-bottom');
  //   const contentHeight =
  //     this.content.offsetHeight +
  //     parseInt(marginTop.split('p')[0], 10) +
  //     parseInt(marginBottom.split('p')[0], 10);

  //   return {
  //     contentHeight,
  //     totalDuration: this.props.delay + this.props.duration
  //   };
  // };

  transition = () => {
    // Determine current state - closing or opening
    // If opening to 'auto'
    const {delay, duration} = this.props;
    const isCurrentlyOpen = this.getIsOpen();

    if (isCurrentlyOpen) {
      // Animate closed
      const height = this.getCollapsibleHeight();
      return Promise.resolve().then(() => {
        return this.setStyles({height}).then(() => {
          this.setState({isOpening: 'closing'});
          debugger;
          return RAF(() => this.setStyles({height: 0, overflow: 'hidden'}));
        });
      });
    } else {
      // Animate open
      return Promise.resolve().then(() => {
        return this.setStyles({display: 'block', overflow: 'hidden'}).then(
          () => {
            const height = this.getCollapsibleHeight();
            this.setState({isOpening: 'opening'});
            return this.setStyles({height});
          }
        );
      });
    }
  };

  getCollapsibleHeight = () => {
    if (!this.collapsible) {
      return 'auto';
    }
    return this.collapsible.scrollHeight;
  };

  measure = () => {
    const isCurrentlyOpen = this.getIsOpen();
    // If closed, styles should be {overflow: 'hidden', display: 'none', height: 0}
    if (!isCurrentlyOpen) {
      this.setStyles({display: 'block', overflow: 'hidden'}).then(() => {
        const height = this.getCollapsibleHeight();
        this.setStyles({height});
      });
    }
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
                  let newStyle = newStyles[key];
                  if (
                    this.collapsible &&
                    this.collapsible.style[key].includes('px')
                  ) {
                    newStyle =
                      newStyles[key] || newStyles[key] === 0
                        ? `${newStyles[key]}px`
                        : '';
                  }
                  return (
                    !this.collapsible ||
                    this.collapsible.style[key] !== newStyle
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

  handleTransitionEnd = () => {
    if (this.state.isOpening === 'opening') {
      debugger;
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
      debugger;
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

  collapsible: ?HTMLElement;
  content: ?HTMLElement;
  timeoutID: TimeoutID;

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

  assignCollapsibleRef = (node: ?HTMLElement) => (this.collapsible = node);

  assignContentRef = (node: ?HTMLElement) => (this.content = node);

  render() {
    console.log(this.state.styles);
    return this.props.children({
      isOpen: Boolean(this.getIsOpen()),
      getTogglerProps: this.getTogglerProps,
      getCollapsibleProps: this.getCollapsibleProps
    });
  }
}
