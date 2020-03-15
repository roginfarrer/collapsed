import React from 'react';
import styled from 'styled-components';

export const Toggle = styled.button`
  background: #1484e8;
  box-shadow: -1px 3px 4px #88aed0;
  border-radius: 8px;
  cursor: pointer;
  padding: 8px 24px;
  font-family: Helvetica;
  color: white;
  border: 0;
  font-size: 16px;
  transition: background-color 0.15s ease, box-shadow 0.15s ease;

  &:hover,
  &:focus {
    background: #178ffb;
  }
  &:active {
    background: #3782c6;
    box-shadow: none;
  }
`;

export const Content = styled.div`
  background: #eef0f7;
  border-radius: 8px;
  border: 2px solid lightgray;
  color: #212121;
  font-family: Helvetica;
  padding: 12px;
  font-size: 16px;
  line-height: 1.5;
`;

const CollapseContainer = styled.div`
  margin-top: 8px;
`;

export const Collapse = React.forwardRef(
  (props, ref: React.Ref<HTMLDivElement>) => (
    <CollapseContainer {...props} ref={ref}>
      <Content>{props.children}</Content>
    </CollapseContainer>
  )
);

