// @flow

import {PureComponent, type Node, type Ref} from 'react';

// Helper function for render props. Sets a function to be called, plus any additional functions passed in
const callAll = (...fns) => (...args: Array<*>) =>
  fns.forEach(fn => fn && fn(...args));

type Props = {
  children: ({
    isOpen: boolean,
    getTogglerProps: (*) => {},
    getCollapsibleProps: (*) => {},
    contentRef: Ref<*>
  }) => Node,
  isOpen: ?boolean,
  defaultOpen: boolean,
  collapsedHeight: number,
  duration: number,
  easing: string,
  delay: number
};

type State = {
  height: number | string,
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
    easing: 'ease',
    shouldUseTransitions: false
  };

  static counter = 0;

  state = {
    height: this.props.collapsedHeight,
    overflow: this.getIsOpen({isOpen: this.props.defaultOpen}) ? '' : 'hidden',
    isOpen: this.getIsOpen({isOpen: this.props.defaultOpen}),
    counter: 0
  };

  componentDidMount() {
    // Iterate counter to create unique IDs for each instance of this component
    // on the page. Used mainly for `aria-` relationships
    this.setState({counter: Collapse.counter++});

    // If open by default, update the height
    if (this.getIsOpen()) {
      this.setState(this.setOpen());
    }
  }

  // componentDidUpdate(prevProps: Props, prevState: State) {
  //   const isCurrentlyOpen = this.getIsOpen();

  //   if (this.getIsOpen(prevState, prevProps) !== isCurrentlyOpen) {
  //     if (isCurrentlyOpen) {
  //       this.setOpen();
  //     } else {
  //       this.setClosed();
  //     }
  //   }
  // }

  componentDidUpdate(prevProps, prevState) {
    const {delay, duration} = this.props;
    const isCurrentlyOpen = this.getIsOpen();
    // Check if 'height' prop has changed
    if (
      this.content &&
      this.getIsOpen(prevState, prevProps) !== isCurrentlyOpen
    ) {
      // Cache content height
      this.content.style.overflow = 'hidden';
      var style = window.getComputedStyle(this.content);
      var marginTop = style.getPropertyValue('margin-top');
      var marginBottom = style.getPropertyValue('margin-bottom');
      const contentHeight =
        this.content.offsetHeight +
        parseInt(marginTop.split('p')[0], 10) +
        parseInt(marginBottom.split('p')[0], 10);
      this.content.style.overflow = '';

      // set total animation time
      const totalDuration = duration + delay;

      let newHeight = null;
      const timeoutState = {
        height: null, // it will be always set to either 'auto' or specific number
        overflow: 'hidden'
      };
      const isCurrentHeightAuto = prevState.height === 'auto';

      if (isCurrentlyOpen) {
        // If new height is a number
        newHeight = 0;
        timeoutState.height = newHeight;
      } else {
        // If not, animate to content height
        // and then reset to auto
        newHeight = contentHeight;
        timeoutState.height = 'auto';
        timeoutState.overflow = null;
      }

      if (isCurrentHeightAuto) {
        // This is the height to be animated to
        timeoutState.height = newHeight;

        // If previous height was 'auto'
        // set starting height explicitly to be able to use transition
        newHeight = contentHeight;
      }

      debugger;

      // Set starting height and animating classes
      // We are safe to call set state as it will not trigger infinite loop
      // because of the "height !== prevProps.height" check
      this.setState({
        height: newHeight,
        overflow: 'hidden',
        // When animating from 'auto' we first need to set fixed height
        // that change should be animated
        shouldUseTransitions: !isCurrentHeightAuto
      });

      // Clear timeouts
      clearTimeout(this.timeoutID);

      if (isCurrentHeightAuto) {
        // When animating from 'auto' we use a short timeout to start animation
        // after setting fixed height above
        timeoutState.shouldUseTransitions = true;

        startAnimationHelper(() => {
          this.setState(timeoutState);
        });

        // Set static classes and remove transitions when animation ends
        this.timeoutID = setTimeout(() => {
          this.setState({
            shouldUseTransitions: false
          });

          // ANIMATION ENDS
          // Hide content if height is 0 (to prevent tabbing into it)
          // this.hideContent(timeoutState.height);
        }, totalDuration);
      } else {
        // Set end height, classes and remove transitions when animation is complete
        this.timeoutID = setTimeout(() => {
          timeoutState.shouldUseTransitions = false;

          this.setState(timeoutState);

          // ANIMATION ENDS
          // If height is auto, don't hide the content
          // (case when element is empty, therefore height is 0)
          // if (height !== 'auto') {
          //   // Hide content if height is 0 (to prevent tabbing into it)
          //   this.hideContent(newHeight); // TODO solve newHeight = 0
          // }
        }, totalDuration);
      }
    }
  }

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

  // setOpen = () => ({
  //   height: this.content ? this.content.clientHeight : 'auto'
  // });

  // setOpen = () => {
  //   // Clear timeouts
  //   clearTimeout(this.timeoutID);
  //   const contentHeight = this.content.offsetHeight;
  //   const totalDuration = this.props.duration + this.props.delay;
  //   this.setState({height: contentHeight});

  //   // Set static classes and remove transitions when animation ends
  //   this.timeoutID = setTimeout(() => {
  //     debugger;
  //     this.setState({height: 'auto'});
  //   }, totalDuration + 1000);
  // };

  // setClosed = () => ({height: this.props.collapsedHeight});

  // setClosed = () => {
  //   // Clear timeouts
  //   debugger;
  //   const contentHeight = this.content.offsetHeight;
  //   const totalDuration = this.props.duration + this.props.delay;
  //   this.setState({height: contentHeight}, () => this.setState({height: 0}));
  //   // startAnimationHelper(() => {
  //   //   this.setState({height: contentHeight});
  //   // });

  //   // Set static classes and remove transitions when animation ends
  //   // this.timeoutID = setTimeout(() => {
  //   //   return {height: 0};
  //   // }, totalDuration);
  // };

  toggleIsOpen = () => this.setState(({isOpen}) => ({isOpen: !isOpen}));

  /**
   * At the end of the transition open, make the height of the collapible 'auto'.
   * This will prevent overflow and height issues if the content of the collapsible
   * changes while the panel is open
   */
  // handleCollapsibleTransitionEnd = () => {
  //   if (this.collapsible && this.collapsible.clientHeight !== 0) {
  //     startAnimationHelper(this.setState({height: 'auto'}));
  //   }
  // };

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

  getCollapsibleProps = (props: {refKey: string} = {refKey: 'ref'}) => {
    return {
      id: `CollapsePanel-${this.state.counter}`,
      'aria-hidden': Boolean(this.getIsOpen()),
      ...props,
      [props.refKey]: callAll(this.assignCollapsibleRef, props[props.refKey]),
      style: {
        height: this.state.height,
        overflow: this.state.overflow,
        willChange: 'height',
        transition: `height ${this.props.duration}ms ${this.props.easing} ${
          this.props.delay
        }ms`
      }
    };
  };

  assignCollapsibleRef = (node: ?HTMLElement) => (this.collapsible = node);

  assignContentRef = (node: ?HTMLElement) => (this.content = node);

  render() {
    console.log(this.state.height);
    return this.props.children({
      isOpen: Boolean(this.getIsOpen()),
      getTogglerProps: this.getTogglerProps,
      getCollapsibleProps: this.getCollapsibleProps,
      contentRef: this.assignContentRef
    });
  }
}
