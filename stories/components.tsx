import React from 'react';
import styled from 'styled-components';

export const Toggle = styled.button`
  background: white;
  display: inline-block;
  // box-shadow: -1px 3px 4px #88aed0;
  box-shadow: 5px 5px 0 black;
  border: 1px solid black;
  color: black;
  cursor: pointer;
  padding: 12px 24px;
  font-family: Helvetica;
  font-size: 16px;
  transition-timing-function: ease;
  transition-duration: 150ms;
  transition-property: all;
  min-width: 150px;

  &:hover,
  &:focus {
    background: rgba(225, 225, 225, 0.8);
  }
  &:active {
    background: black;
    color: white;
    box-shadow: none;
  }
`;

export const Content = styled.div`
  border: 2px solid black;
  color: #212121;
  font-family: Helvetica;
  padding: 12px;
  font-size: 16px;
  line-height: 1.5;
`;

const CollapseContainer = styled.div`
  margin-top: 8px;
`;

type CollapseProps = {
  children: React.ReactNode;
  style?: {};
};

export const Collapse = React.forwardRef(
  (props: CollapseProps, ref?: React.Ref<HTMLDivElement>) => (
    <CollapseContainer {...props} ref={ref}>
      <Content>{props.children}</Content>
    </CollapseContainer>
  )
);
