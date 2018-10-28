import React from 'react';
import PropTypes from 'prop-types';

const PROPS_TO_OMIT = [
  'animateOpacity',
  'animationStateClasses',
  'applyInlineTransitions',
  'children',
  'contentClassName',
  'delay',
  'duration',
  'easing',
  'height',
  'onAnimationEnd',
  'onAnimationStart'
];

// Start animation helper using nested requestAnimationFrames
function startAnimationHelper(callback) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      callback();
    });
  });
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function isPercentage(height) {
  // Percentage height
  return (
    typeof height === 'string' &&
    height.search('%') === height.length - 1 &&
    isNumber(height.substr(0, height.length - 1))
  );
}

function runCallback(callback) {
  if (callback && typeof callback === 'function') {
    callback();
  }
}

const getInitialStyle = propHeight => {
  let height = 'auto';
  let overflow = 'visible';

  if (isNumber(propHeight)) {
    height = propHeight < 0 ? 0 : propHeight;
    overflow = 'hidden';
  } else if (isPercentage(propHeight)) {
    height = propHeight;
    overflow = 'hidden';
  }
  return {height, overflow};
};

class Collapse extends React.Component {
  static propTypes = {
    animateOpacity: PropTypes.bool,
    children: PropTypes.any.isRequired,
    duration: PropTypes.number,
    delay: PropTypes.number,
    easing: PropTypes.string,
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onAnimationEnd: PropTypes.func,
    onAnimationStart: PropTypes.func
  };

  static defaultProps = {
    animateOpacity: false,
    duration: 250,
    delay: 0,
    easing: 'ease'
  };

  state = {
    height: this.props.height,
    overflow:
      typeof this.props.height === 'number' &&
      typeof this.props.height === 'string'
        ? 'hidden'
        : '',
    shouldUseTransitions: false
  };

  componentDidMount() {
    const {height} = this.state;

    // Hide content if height is 0 (to prevent tabbing into it)
    // Check for contentElement is added cause this would fail in tests (react-test-renderer)
    // Read more here: https://github.com/Stanko/react-animate-height/issues/17
    if (this.contentElement && this.contentElement.style) {
      this.hideContent(height);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {delay, duration, height} = this.props;

    // Check if 'height' prop has changed
    if (this.contentElement && height !== prevProps.height) {
      // Remove display: none from the content div
      // if it was hidden to prevent tabbing into it
      this.showContent(prevState.height);

      // Cache content height
      this.contentElement.style.overflow = 'hidden';
      const contentHeight = this.contentElement.offsetHeight;
      this.contentElement.style.overflow = '';

      // set total animation time
      const totalDuration = duration + delay;

      let newHeight = null;
      const timeoutState = {
        height: null, // it will be always set to either 'auto' or specific number
        overflow: 'hidden'
      };
      const isCurrentHeightAuto = prevState.height === 'auto';

      if (isNumber(height)) {
        // If new height is a number
        newHeight = height < 0 ? 0 : height;
        timeoutState.height = newHeight;
      } else if (isPercentage(height)) {
        newHeight = height;
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
          this.hideContent(timeoutState.height);
        }, totalDuration);
      } else {
        // Set end height, classes and remove transitions when animation is complete
        this.timeoutID = setTimeout(() => {
          timeoutState.shouldUseTransitions = false;

          this.setState(timeoutState);

          // ANIMATION ENDS
          // If height is auto, don't hide the content
          // (case when element is empty, therefore height is 0)
          if (height !== 'auto') {
            // Hide content if height is 0 (to prevent tabbing into it)
            this.hideContent(newHeight); // TODO solve newHeight = 0
          }
        }, totalDuration);
      }
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutID);
    this.timeoutID = null;
  }

  showContent = height => {
    if (height === 0) {
      this.contentElement.style.display = '';
    }
  };

  hideContent = newHeight => {
    if (newHeight === 0) {
      this.contentElement.style.display = 'none';
    }
  };

  render() {
    const {animateOpacity, children, duration, easing, delay} = this.props;
    const {height, overflow, shouldUseTransitions} = this.state;

    const componentStyle = {
      height,
      overflow
    };

    if (shouldUseTransitions) {
      componentStyle.transition = `height ${duration}ms ${easing} ${delay}ms`;

      // Add webkit vendor prefix still used by opera, blackberry...
      componentStyle.WebkitTransition = componentStyle.transition;
    }

    const contentStyle = {};

    if (animateOpacity) {
      contentStyle.transition = `opacity ${duration}ms ${easing} ${delay}ms`;
      // Add webkit vendor prefix still used by opera, blackberry...
      contentStyle.WebkitTransition = contentStyle.transition;

      if (height === 0) {
        contentStyle.opacity = 0;
      }
    }

    // return (
    //   <div
    //     {...omit(this.props, ...PROPS_TO_OMIT)}
    //     aria-hidden={height === 0}
    //     className={componentClasses}
    //     style={componentStyle}
    //   >
    //     <div
    //       className={contentClassName}
    //       style={contentStyle}
    //       ref={el => (this.contentElement = el)}
    //     >
    //       {children}
    //     </div>
    //   </div>
    // );
    console.log(this.state.height);
    return children({
      outerNode: () => ({
        style: componentStyle
      }),
      innerNode: () => ({
        style: {...contentStyle, margin: 0},
        ref: el => (this.contentElement = el)
      })
    });
  }
}

export default Collapse;
