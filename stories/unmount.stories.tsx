import React from 'react';
import useCollapse from '../src';
import { Toggle, Collapse } from './components';
import { withA11y } from '@storybook/addon-a11y';

export default {
  title: 'Unmount content on collapse',
  decorators: [withA11y],
};

export function Unmount() {
  const {
    getCollapseProps,
    getToggleProps,
    isOpen,
    mountChildren,
  } = useCollapse({
    defaultOpen: true,
  });

  return (
    <React.Fragment>
      <Toggle {...getToggleProps()}>{isOpen ? 'Close' : 'Open'}</Toggle>
      <div {...getCollapseProps()}>
        {mountChildren && (
          <Collapse>
            In the morning I walked down the Boulevard to the rue Soufflot for
            coffee and brioche. It was a fine morning. The horse-chestnut trees
            in the Luxembourg gardens were in bloom. There was the pleasant
            early-morning feeling of a hot day. I read the papers with the
            coffee and then smoked a cigarette. The flower-women were coming up
            from the market and arranging their daily stock. Students went by
            going up to the law school, or down to the Sorbonne. The Boulevard
            was busy with trams and people going to work.
          </Collapse>
        )}
      </div>
    </React.Fragment>
  );
}

Unmount.story = {
  name: 'Unmount content when closed',
};
