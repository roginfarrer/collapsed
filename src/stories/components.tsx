import React from 'react'
import styled from 'styled-components'

export const Toggle = styled.button`
  box-sizing: border-box;
  background: white;
  display: inline-block;
  text-align: center;
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
  width: 100%;

  @media (min-width: 640px) {
    width: auto;
  }

  &:hover,
  &:focus {
    background: rgba(225, 225, 225, 0.8);
  }
  &:active {
    background: black;
    color: white;
    box-shadow: none;
  }
`

export const Content = styled.div`
  box-sizing: border-box;
  border: 2px solid black;
  color: #212121;
  font-family: Helvetica;
  padding: 12px;
  font-size: 16px;
  line-height: 1.5;
`

const CollapseContainer = styled.div`
  margin-top: 8px;
`

type CollapseProps = {
  children: React.ReactNode
  style?: {}
}

export const Collapse = React.forwardRef(
  (props: CollapseProps, ref?: React.Ref<HTMLDivElement>) => (
    <CollapseContainer {...props} ref={ref}>
      <Content>{props.children}</Content>
    </CollapseContainer>
  )
)

export const excerpt =
  'In the morning I walked down the Boulevard to the rue Soufflot for coffee and brioche. It was a fine morning. The horse-chestnut trees in the Luxembourg gardens were in bloom. There was the pleasant early-morning feeling of a hot day. I read the papers with the coffee and then smoked a cigarette. The flower-women were coming up from the market and arranging their daily stock. Students went by going up to the law school, or down to the Sorbonne. The Boulevard was busy with trams and people going to work.'
