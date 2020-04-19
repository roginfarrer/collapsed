import React from 'react';
import useCollapse from '../src';
import { Toggle, Collapse, excerpt } from './components';
import { withA11y } from '@storybook/addon-a11y';

export default {
  title: 'Unmount content on collapse',
  decorators: [withA11y],
};

export function Unmount() {
  const [mountChildren, setMountChildren] = React.useState(true);
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse({
    defaultExpanded: true,
    onExpandStart() {
      setMountChildren(true);
    },
    onCollapseEnd() {
      setMountChildren(false);
    },
  });

  return (
    <React.Fragment>
      <Toggle {...getToggleProps()}>{isExpanded ? 'Close' : 'Open'}</Toggle>
      <div {...getCollapseProps()}>
        {mountChildren && <Collapse>{excerpt}</Collapse>}
      </div>
    </React.Fragment>
  );
}

Unmount.story = {
  name: 'Unmount content when closed',
};
