// @flow

import React from 'react';
import Collapse from '../src/Collapse';
import {CollapseDemo} from './components/ui-components';

export default class ControlledDemo extends React.Component<
  void,
  {isOpen: boolean}
> {
  state = {
    isOpen: true,
  };

  handleClick = () => this.setState(({isOpen}) => ({isOpen: !isOpen}));

  render() {
    const {isOpen} = this.state;
    return (
      <Collapse isOpen={isOpen}>
        {({getCollapseProps, getTogglerProps}) => (
          <React.Fragment>
            <button
              {...getTogglerProps({
                style: {marginBottom: '1em'},
                onClick: this.handleClick,
              })}
            >
              {isOpen ? 'Close' : 'Open'}
            </button>
            <div {...getCollapseProps()}>
              <CollapseDemo>
                In the morning I walked down the Boulevard to the rue Soufflot
                for coffee and brioche. It was a fine morning. The
                horse-chestnut trees in the Luxembourg gardens were in bloom.
                There was the pleasant early-morning feeling of a hot day. I
                read the papers with the coffee and then smoked a cigarette. The
                flower-women were coming up from the market and arranging their
                daily stock. Students went by going up to the law school, or
                down to the Sorbonne. The Boulevard was busy with trams and
                people going to work.
              </CollapseDemo>
            </div>
          </React.Fragment>
        )}
      </Collapse>
    );
  }
}
