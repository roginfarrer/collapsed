import * as React from 'react'
import useCollapse from '..'
import { Toggle, Collapse, excerpt } from './components'
import { expect } from '@storybook/jest'
import { within, userEvent, waitFor } from '@storybook/testing-library'

export default {
  title: 'Uncontrolled Tests',
  component: useCollapse,
}

const Uncontrolled = (props: Parameters<typeof useCollapse>[0]) => {
  const { getToggleProps, getCollapseProps, isExpanded } = useCollapse({
    ...props,
    hasDisabledAnimation: true,
    duration: 0,
  })

  return (
    <div>
      <Toggle {...getToggleProps()}>{isExpanded ? 'Close' : 'Open'}</Toggle>
      <Collapse data-testid="collapse" {...getCollapseProps()}>
        {excerpt}
      </Collapse>
    </div>
  )
}

const Template = (args) => <Uncontrolled {...args} />
export const Demo = Template.bind({})
Demo.play = async ({ args, canvasElement }) => {
  const canvas = within(canvasElement)
  const collapse = canvas.getByTestId('collapse')
  await expect(collapse).not.toBeVisible()
  await userEvent.click(canvas.getByRole('button'))
  setTimeout(() => {}, 1000)
  await expect(collapse).toBeVisible()
}
