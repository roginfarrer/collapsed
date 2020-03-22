import React from 'react';
import useCollapse from '../src';
import { Toggle, Collapse } from './components';

export const Div = () => {
  const { getCollapseProps, getToggleProps, isOpen } = useCollapse({
    defaultOpen: true,
  });

  return (
    <div>
      <Toggle as="div" {...getToggleProps()}>
        {isOpen ? 'Close' : 'Open'}
      </Toggle>
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
    </div>
  );
};
