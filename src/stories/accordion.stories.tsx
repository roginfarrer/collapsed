import React, { useState, Children, cloneElement, ReactNode } from 'react'
import styled from 'styled-components'
import { excerpt } from './components'
import useCollapse from '..'

const Item = styled.li({
  all: 'unset',
  borderBottom: '2px solid #ccc',
  ':last-child': {
    borderBottom: 0,
  },
})

const Toggle = styled.button({
  all: 'unset',
  cursor: 'pointer',
  padding: 16,
  fontFamily: 'Helvetica',
  fontSize: 16,
  display: 'flex',
  alignItems: 'center',
  width: '100%',
})

const Panel = styled.div({
  padding: 16,
  fontFamily: 'Helvetica',
})

const StyledAccordion = styled.ul({
  all: 'unset',
  display: 'flex',
  flexDirection: 'column',
  background: 'white',
  padding: 12,
})

const Collapse = ({
  isActive,
  onSelect,
  title,
  children,
}: {
  isActive?: boolean
  onSelect?: () => void
  title: ReactNode
  children: ReactNode
}) => {
  const { getCollapseProps, getToggleProps } = useCollapse({
    isExpanded: isActive,
  })

  return (
    <Item>
      <Toggle
        {...getToggleProps({
          onClick: onSelect,
        })}
      >
        <span aria-hidden="true" style={{ marginRight: '8px' }}>
          {isActive ? 'v' : '>'}
        </span>
        {title}
      </Toggle>
      <div {...getCollapseProps()}>
        <Panel>{children}</Panel>
      </div>
    </Item>
  )
}

const AccordionParent = ({ children }) => {
  const [activeIndex, setActiveIndex] = useState(null)
  return (
    <StyledAccordion>
      {Children.map(children, (child, index) =>
        cloneElement(child, {
          ...child,
          isActive: activeIndex === index,
          onSelect: () => setActiveIndex(activeIndex === index ? null : index),
        })
      )}
    </StyledAccordion>
  )
}

const Background = styled.div({
  padding: 20,
  background: '#efefef',
})

export const Accordion = () => {
  return (
    <Background>
      <AccordionParent>
        <Collapse title="Collapse One">{excerpt}</Collapse>
        <Collapse title="Collapse Two">{excerpt}</Collapse>
        <Collapse title="Collapse Three">{excerpt}</Collapse>
      </AccordionParent>
    </Background>
  )
}

export default {
  title: 'Accordion',
}
