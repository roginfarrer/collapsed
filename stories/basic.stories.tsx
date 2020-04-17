import React from 'react';
import useCollapse from '../src';
import { Toggle, Collapse, excerpt } from './components';
import { withA11y } from '@storybook/addon-a11y';

export const Uncontrolled = () => {
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse({
    defaultExpanded: true,
  });

  return (
    <div>
      <Toggle {...getToggleProps()}>{isExpanded ? 'Close' : 'Open'}</Toggle>
      <Collapse {...getCollapseProps()}>{excerpt}</Collapse>
    </div>
  );
};

export const Controlled = () => {
  const [isExpanded, setOpen] = React.useState<boolean>(true);
  const { getCollapseProps, getToggleProps } = useCollapse({
    isExpanded,
  });

  return (
    <div>
      <Toggle {...getToggleProps({ onClick: () => setOpen((old) => !old) })}>
        {isExpanded ? 'Close' : 'Open'}
      </Toggle>
      <Collapse {...getCollapseProps()}>{excerpt}</Collapse>
    </div>
  );
};

export default {
  title: 'Basic Usage',
  decorators: [withA11y],
};
