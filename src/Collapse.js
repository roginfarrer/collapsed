// @flow
import {Component, type Node, type Ref} from 'react';
import {callAll, generateId} from './utils';
import RAF from 'raf';

// @TODO support different open and closing animations

const CLOSING = 'closing';
const OPENING = 'opening';

const TRANSITION_STATES = {
  OPEN: {
    height: 'auto'
  },
  CLOSED: {
    height: '0px',
    display: 'none'
  }
};

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

  componentWillUnmount() {
    RAF.cancel(this.raf);
  }

  setClosed = () => {
    const height = this.getCollapsibleHeight();
    console.log({height, stateHeight: this.state.styles.height});

    return Promise.resolve()
      .then(() => {
        return this.setStyles({height}).then(() => {
          this.setState({transitionState: CLOSING, heightAtTransition: height});
        });
      })
      .then(() => {
        RAF(() => this.setStyles({height: '0px', overflow: 'hidden'}));
      });

    // RAF(() =>
    //   this.setState(({styles}) => ({
    //     styles: {...styles, height: '0px', overflow: 'hidden'}
    //   }))
    // );
  };

  setOpen = () => {
    return Promise.resolve().then(() => {
      return this.setStyles({
        display: 'block',
        overflow: 'hidden'
      }).then(() => {
        const height = this.getCollapsibleHeight();
        return this.setState(
          {transitionState: OPENING, heightAtTransition: height},
          () => {
            this.setStyles({height});
          }
        );
      });
    });
  };

  // transition = direction => {
  //   debugger;
  //   return Promise.resolve()
  //     .then(() => {
  //       if (direction === 'open') {
  //         return this.setStyles({
  //           display: 'block',
  //           overflow: 'hidden'
  //         }).then(() => {
  //           const height = this.getCollapsibleHeight();
  //           return this.setState(
  //             {transitionState: OPENING, heightAtTransition: height},
  //             () => {
  //               this.setStyles({height});
  //             }
  //           );
  //         });
  //       } else {
  //         const height = this.getCollapsibleHeight();
  //         return Promise.resolve().then(() => {
  //           return this.setStyles({height}).then(() => {
  //             return this.setState(
  //               {transitionState: CLOSING, heightAtTransition: height},
  //               () => {
  //                 RAF(() =>
  //                   this.setStyles({height: '0px', overflow: 'hidden'})
  //                 );
  //               }
  //             );
  //           });
  //         });
  //       }
  //     })
  //     .then(() => {
  //       RAF(() => {
  //         this.setState(({styles}) => ({
  //           styles: {
  //             ...styles,
  //             ...(direction === 'open'
  //               ? {height: 'auto', display: ''}
  //               : {display: 'none'})
  //           }
  //         }));
  //       });
  //     });
  // };

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
                Object.keys(newStyles).some(
                  key =>
                    !this.collapseEl ||
                    this.collapseEl.style[key] !== newStyles[key]
                )
              ) {
                console.log('check');
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
    console.log('complete transition');
    // this.setState(({transitionState, styles}) => {
    //   if (transitionState === OPENING) {
    //     return {
    //       transitionState: null,
    //       styles: {
    //         ...styles,
    //         display: '',
    //         overflow: '',
    //         height: 'auto'
    //       }
    //     };
    //   }
    //   if (transitionState === CLOSING) {
    //     return {
    //       transitionState: null,
    //       styles: {...styles, overflow: '', display: 'none'}
    //     };
    //   }
    //   return null;
    // });
    if (this.state.transitionState === OPENING) {
      this.setStyles({
        display: '',
        overflow: '',
        height: 'auto'
      });
    }
    if (this.state.transitionState === CLOSING) {
      // this.setState(({styles}) => ({
      //   transitionState: null,
      //   styles: {...styles, overflow: '', display: 'none'}
      // }));
      this.setStyles({
        overflow: '',
        display: 'none'
      });
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
      console.log('reset styles on transition end');
      this.setState(({styles}) => {
        return {
          heightAtTransition: height,
          styles: {...styles, height}
        };
      });
      return;
    }

    // We have to debounce the action of stopping
    // the "transition" state, since onTransitionEnd
    // will fire more than once if there are multiple
    // properties that were transitioned.

    if (this.transitionRaf) {
      RAF.cancel(this.transitionRaf);
    }
    // if (this.closeRaf) {
    //   RAF.cancel(this.closeRaf);
    // }
    this.transitionRaf = RAF(this.completeTransition);
  };

  collapseEl: ?HTMLElement;
  transitionState: null | OPENING | CLOSING;

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
