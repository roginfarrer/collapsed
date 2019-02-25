import React from 'react';
import {useCollapse} from '../../src/collapsed';
import {CollapseDemo} from '../_ui-components/ui-components';

// const expand = {
//   transitionDuration: 300,
//   transitionTimingFunction: 'ease-in-out',
// };

// const collapse = {
//   transitionDuration: 1000,
//   transitionTimingFunction: 'ease-out',
// };

export default function Demo() {
  const {getCollapseProps, getToggleProps, isOpen} = useCollapse();

  return (
    <React.Fragment>
      <button {...getToggleProps()}>{isOpen ? 'Close' : 'Open'}</button>
      <div {...getCollapseProps()}>
        <CollapseDemo>
          In the morning I walked down the Boulevard to the rue Soufflot for
          coffee and brioche. It was a fine morning. The horse-chestnut trees in
          the Luxembourg gardens were in bloom. There was the pleasant
          early-morning feeling of a hot day. I read the papers with the coffee
          and then smoked a cigarette. The flower-women were coming up from the
          market and arranging their daily stock. Students went by going up to
          the law school, or down to the Sorbonne. The Boulevard was busy with
          trams and people going to work.
        </CollapseDemo>
      </div>
    </React.Fragment>
  );
}
