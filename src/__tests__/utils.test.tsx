import React from 'react'
import { render, act } from '@testing-library/react'
import {
  useEffectAfterMount,
  useControlledState,
  callAll,
  useUniqueId,
} from '../utils'

describe('useUniqueId', () => {
  it('should generate a unique ID value', () => {
    function Comp() {
      const justNull = null
      const randId = useUniqueId(justNull)
      const randId2 = useUniqueId()
      return (
        <div>
          <div id={randId}>Wow</div>
          <div id={randId2}>Ok</div>
        </div>
      )
    }
    const { getByText } = render(<Comp />)
    const id1 = Number(getByText('Wow').id)
    const id2 = Number(getByText('Ok').id)
    expect(id2).not.toEqual(id1)
  })

  it('uses a fallback ID', () => {
    function Comp() {
      const newId = useUniqueId('awesome')
      return <div id={newId}>Ok</div>
    }
    const { getByText } = render(<Comp />)
    expect(getByText('Ok').id).toEqual('awesome')
  })
})

describe('callAll', () => {
  it('it calls the two functions passed into it', () => {
    const functionOne = jest.fn()
    const functionTwo = jest.fn()
    const theFunk = callAll(functionOne, functionTwo)
    theFunk()
    expect(functionOne).toHaveBeenCalled()
    expect(functionTwo).toHaveBeenCalled()
  })
})

describe('useEffectAfterMount', () => {
  it('does not run callback on first render', () => {
    // Provide a dependency that changes, so it re-renders
    let x = 0
    const cb = jest.fn()

    function UseEffectAfterMount() {
      x++
      useEffectAfterMount(cb, [x])
      return null
    }

    const { rerender } = render(<UseEffectAfterMount />)

    expect(cb).not.toHaveBeenCalled()
    rerender(<UseEffectAfterMount />)
    expect(cb).toHaveBeenCalled()
  })
})

describe('useControlledState', () => {
  let hookReturn: [boolean, React.Dispatch<React.SetStateAction<boolean>>]

  function UseControlledState({
    defaultExpanded,
    isExpanded,
  }: {
    defaultExpanded?: boolean
    isExpanded?: boolean
  }) {
    const result = useControlledState(isExpanded, defaultExpanded)

    hookReturn = result

    return null
  }

  it('returns a boolean and a function', () => {
    render(<UseControlledState />)

    expect(hookReturn[0]).toBe(false)
    expect(typeof hookReturn[1]).toBe('function')
  })

  it('returns the defaultValue value', () => {
    render(<UseControlledState defaultExpanded />)

    expect(hookReturn[0]).toBe(true)
  })

  it('setter toggles the value', () => {
    render(<UseControlledState defaultExpanded />)

    expect(hookReturn[0]).toBe(true)

    act(() => {
      hookReturn[1]((n) => !n)
    })

    expect(hookReturn[0]).toBe(false)
  })

  describe('dev feedback', () => {
    // Mocking console.warn so it does not log to the console,
    // but we can still intercept the message
    const originalWarn = console.warn
    let consoleOutput: string[] = []
    const mockWarn = (output: any) => consoleOutput.push(output)

    beforeEach(() => (console.warn = mockWarn))
    afterEach(() => {
      console.warn = originalWarn
      consoleOutput = []
    })

    function Foo({ isExpanded }: { isExpanded?: boolean }) {
      useControlledState(isExpanded)
      return <div />
    }

    it('warns about changing from uncontrolled to controlled', () => {
      const { rerender } = render(<Foo />)
      rerender(<Foo isExpanded />)

      expect(consoleOutput[0]).toMatchInlineSnapshot(
        `"Warning: useCollapse is changing from uncontrolled to controlled. useCollapse should not switch from uncontrolled to controlled (or vice versa). Decide between using a controlled or uncontrolled collapse for the lifetime of the component. Check the \`isExpanded\` prop."`
      )
      expect(consoleOutput.length).toBe(1)
    })

    it('warns about changing from controlled to uncontrolled', () => {
      // Initially control the value
      const { rerender } = render(<Foo isExpanded />)
      // Then re-render without controlling it
      rerender(<Foo isExpanded={undefined} />)

      expect(consoleOutput[0]).toMatchInlineSnapshot(
        `"Warning: useCollapse is changing from controlled to uncontrolled. useCollapse should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled collapse for the lifetime of the component. Check the \`isExpanded\` prop."`
      )
      expect(consoleOutput.length).toBe(1)
    })
  })
})
