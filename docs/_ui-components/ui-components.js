// @flow
import React from 'react';
import styles from './ui-components.css';

type CollapseDemoProps = {
  is: string,
};

export const CollapseDemo = ({is: Component, ...props}: CollapseDemoProps) => (
  <Component className={styles.CollapseDemo} {...props} />
);

CollapseDemo.defaultProps = {is: 'p'};

export const DemoContainer = (props: {}) => (
  <div className={styles.DemoContainer} {...props} />
);
