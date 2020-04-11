import React from 'react';
import useCollapse from '../src';
import { Toggle, Collapse, excerpt } from './components';
import { withA11y } from '@storybook/addon-a11y';

export const Uncontrolled = () => {
  const { getCollapseProps, getToggleProps, isOpen } = useCollapse({
    defaultOpen: true,
  });

  return (
    <div>
      <Toggle {...getToggleProps()}>{isOpen ? 'Close' : 'Open'}</Toggle>
      <Collapse {...getCollapseProps()}>{excerpt}</Collapse>
    </div>
  );
};

export const Controlled = () => {
  const [isOpen, setOpen] = React.useState<boolean>(true);
  const { getCollapseProps, getToggleProps } = useCollapse({
    isOpen,
  });

  return (
    <div>
      <Toggle {...getToggleProps({ onClick: () => setOpen(old => !old) })}>
        {isOpen ? 'Close' : 'Open'}
      </Toggle>
      <Collapse {...getCollapseProps()}>{excerpt}</Collapse>
    </div>
  );
};

export default {
  title: 'Basic Usage',
  decorators: [withA11y],
};
