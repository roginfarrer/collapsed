// @flow
import React from 'react';
import styles from './ui-components.css';

type CollapseDemoProps = {
  is: string
};

export const CollapseDemo = ({
  is: Component = 'p',
  ...props
}: CollapseDemoProps) => (
  <Component className={styles.CollapseDemo} {...props} />
);

export const DemoContainer = props => (
  <div className={styles.DemoContainer} {...props} />
);
