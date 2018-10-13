/** @flow */

import {PureComponent, type Node, type Ref} from 'react';

// Helper function for render props. Sets a function to be called, plus any additional functions passed in
const callAll = (...fns) => (...args: Array<*>) =>
  fns.forEach(fn => fn && fn(...args));

type CollapsePropType = {
  children: ({
    isOpen: boolean,
    isPartiallyOpen: boolean,
    getTogglerProps: (*) => {},
    getCollapsibleProps: (*) => {},
    getPartialCollapsibleProps: (*) => {},
    getPartialTogglerProps: (*) => {},
    contentRef: Ref<*>
  }) => Node,
  isOpen: ?boolean,
  defaultOpen: boolean,
  isPartiallyOpen: ?boolean,
  collapsedHeight: number
};

type CollapseStateType = {
  height: number | string,
  isOpen: ?boolean,
  isPartiallyOpen: ?boolean,
  counter: number
};

class Collapse extends PureComponent<CollapsePropType, CollapseStateType> {
  static defaultProps = {
    isOpen: null,
    defaultOpen: false,
    isPartiallyOpen: null,
    collapsedHeight: 0
  };

  static counter = 0;

  state = {
    height: this.props.collapsedHeight,
    isOpen: this.getIsOpen({isOpen: this.props.defaultOpen}),
    isPartiallyOpen: this.getIsPartiallyOpen({
      isPartiallyOpen: this.props.isPartiallyOpen
    }),
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

  componentDidUpdate(
    prevProps: CollapsePropType,
    prevState: CollapseStateType
  ) {
    const isCurrentlyOpen = this.getIsOpen();

    if (this.getIsOpen(prevState, prevProps) !== isCurrentlyOpen) {
      if (isCurrentlyOpen) {
        this.setState(this.setOpen());
      } else {
        // reset height from 'auto' to pixel height for smooth collapse animation
        this.setState(this.setOpen(), () => {
          // Collapse frame, with a timeout hack to prevent jumps
          setTimeout(() => this.setState(this.setClosed()), 0);
        });
      }
    }

    if (isCurrentlyOpen) {
      if (
        this.getIsPartiallyOpen(prevState, prevProps) !==
        this.getIsPartiallyOpen()
      ) {
        this.setState(this.setOpen());
      }
    }
  }

  collapsible: ?HTMLElement;
  content: ?HTMLElement;

  /**
   * Returns the state of the isPartiallyOpen prop.
   * If it is controlled, return the prop value.
   * If is isn't, use internal state
   */
  getIsPartiallyOpen(
    state: $Shape<CollapseStateType> = this.state,
    props: $Shape<CollapsePropType> = this.props
  ) {
    return props.isPartiallyOpen !== null
      ? props.isPartiallyOpen
      : state.isPartiallyOpen;
  }

  /**
   * Returns the state of the isOpen prop.
   * If it is controlled, return the prop value.
   * If is isn't, use internal state
   */
  getIsOpen(
    state: $Shape<CollapseStateType> = this.state,
    props: $Shape<CollapsePropType> = this.props
  ) {
    return props.isOpen !== null ? props.isOpen : state.isOpen;
  }

  setOpen = () => ({height: this.content ? this.content.clientHeight : 'auto'});

  setClosed = () => ({height: this.props.collapsedHeight});

  toggleIsOpen = () => this.setState(({isOpen}) => ({isOpen: !isOpen}));

  toggleIsPartiallyOpen = () =>
    this.setState(({isPartiallyOpen}) => ({isPartiallyOpen: !isPartiallyOpen}));

  /**
   * At the end of the transition open, make the height of the collapible 'auto'.
   * This will prevent overflow and height issues if the content of the collapsible
   * changes while the panel is open
   */
  handleCollapsibleTransitionEnd = () => {
    if (this.collapsible && this.collapsible.clientHeight !== 0) {
      this.setState({height: 'auto'});
    }
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

  getCollapsibleProps = (props: {refKey: string} = {refKey: 'ref'}) => {
    return {
      id: `CollapsePanel-${this.state.counter}`,
      'aria-hidden': Boolean(this.getIsOpen()),
      onTransitionEnd: this.handleCollapsibleTransitionEnd,
      ...props,
      [props.refKey]: callAll(this.assignCollapsibleRef, props[props.refKey]),
      style: {
        height: this.state.height,
        overflow: 'hidden',
        willChange: 'height',
        transition: 'height 300ms cubic-bezier(0.09, 1.03, 0.57, 0.97)'
      }
    };
  };

  getPartialTogglerProps = (props: {onClick: () => void} = {onClick() {}}) => {
    return {
      ...props,
      onClick: callAll(props.onClick, this.toggleIsPartiallyOpen)
    };
  };

  getPartialCollapsibleProps = (props: {} = {}) => {
    return {
      ...props,
      style: {
        willChange: 'height',
        height: this.getIsPartiallyOpen() ? 'auto' : 0
      }
    };
  };

  assignCollapsibleRef = (node: ?HTMLElement) => (this.collapsible = node);

  assignContentRef = (node: ?HTMLElement) => (this.content = node);

  render() {
    return this.props.children({
      isOpen: Boolean(this.getIsOpen()),
      isPartiallyOpen: Boolean(this.getIsPartiallyOpen()),
      getTogglerProps: this.getTogglerProps,
      getCollapsibleProps: this.getCollapsibleProps,
      getPartialCollapsibleProps: this.getPartialCollapsibleProps,
      getPartialTogglerProps: this.getPartialTogglerProps,
      contentRef: this.assignContentRef
    });
  }
}

export default Collapse;
