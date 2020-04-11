import React from 'react';
import useCollapse from '../src';
import { Toggle, Collapse, excerpt } from './components';
import { withA11y } from '@storybook/addon-a11y';

export default {
  title: 'Using divs',
  decorators: [withA11y],
};

export const Div = () => {
  const { getCollapseProps, getToggleProps, isOpen } = useCollapse({
    defaultOpen: true,
  });

  return (
    <div>
      <Toggle as="div" {...getToggleProps()}>
        {isOpen ? 'Close' : 'Open'}
      </Toggle>
      <Collapse {...getCollapseProps()}>{excerpt}</Collapse>
    </div>
  );
};
