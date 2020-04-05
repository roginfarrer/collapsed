import React from 'react';
import useCollapse from '../src';
import { Toggle, Collapse } from './components';
import { withA11y } from '@storybook/addon-a11y';

export default {
  title: 'Custom Animations',
  decorators: [withA11y],
};

const collapseStyles = {
  transitionDuration: '1.5s',
  transitionTimingFunction: 'cubic-bezier(0.68, -0.55, 0.49, 0.99)',
};

const expandStyles = {
  transitionDuration: '1000ms',
  transitionTimingFunction: 'ease-out',
};

export function CustomTransition() {
  const { getCollapseProps, getToggleProps, isOpen } = useCollapse({
    defaultOpen: true,
    collapseStyles,
    expandStyles,
  });

  return (
    <React.Fragment>
      <Toggle {...getToggleProps()}>{isOpen ? 'Close' : 'Open'}</Toggle>
      <Collapse {...getCollapseProps()}>
        In the morning I walked down the Boulevard to the rue Soufflot for
        coffee and brioche. It was a fine morning. The horse-chestnut trees in
        the Luxembourg gardens were in bloom. There was the pleasant
        early-morning feeling of a hot day. I read the papers with the coffee
        and then smoked a cigarette. The flower-women were coming up from the
        market and arranging their daily stock. Students went by going up to the
        law school, or down to the Sorbonne. The Boulevard was busy with trams
        and people going to work.
      </Collapse>
    </React.Fragment>
  );
}

CustomTransition.story = {
  name: 'Custom Transition Styles',
};
