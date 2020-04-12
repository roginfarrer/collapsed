import React from 'react';
import { render, act } from '@testing-library/react';
import { useEffectAfterMount, useControlledState } from '../hooks';

describe('useEffectAfterMount', () => {
  it('does not run callback on first render', () => {
    // Provide a dependency that changes, so it re-renders
    let x = 0;
    const cb = jest.fn();

    function UseEffectAfterMount() {
      x++;
      useEffectAfterMount(cb, [x]);
      return null;
    }

    const { rerender } = render(<UseEffectAfterMount />);

    expect(cb).not.toHaveBeenCalled();
    rerender(<UseEffectAfterMount />);
    expect(cb).toHaveBeenCalled();
  });
});

describe('useControlledState', () => {
  let hookReturn: [boolean, () => void];

  function UseControlledState({
    defaultOpen,
    isOpen,
  }: {
    defaultOpen?: boolean;
    isOpen?: boolean;
  }) {
    const result = useControlledState({ defaultOpen, isOpen });

    hookReturn = result;

    return null;
  }

  it('returns a boolean and a function', () => {
    render(<UseControlledState />);

    expect(hookReturn[0]).toBe(false);
    expect(typeof hookReturn[1]).toBe('function');
  });

  it('returns the defaultValue value', () => {
    render(<UseControlledState defaultOpen />);

    expect(hookReturn[0]).toBe(true);
  });

  it('setter toggles the value', () => {
    render(<UseControlledState defaultOpen />);

    expect(hookReturn[0]).toBe(true);

    act(() => {
      hookReturn[1]();
    });

    expect(hookReturn[0]).toBe(false);
  });

  describe('dev feedback', () => {
    // Mocking console.warn so it does not log to the console,
    // but we can still intercept the message
    const originalWarn = console.warn;
    let consoleOutput: string[] = [];
    const mockWarn = (output: any) => consoleOutput.push(output);

    beforeEach(() => (console.warn = mockWarn));
    afterEach(() => {
      console.warn = originalWarn;
      consoleOutput = [];
    });

    function Foo({ isOpen }: { isOpen?: boolean }) {
      useControlledState({ isOpen });
      return <div />;
    }

    it('warns about changing from uncontrolled to controlled', () => {
      const { rerender } = render(<Foo />);
      rerender(<Foo isOpen />);

      expect(consoleOutput[0]).toMatchInlineSnapshot(
        `"Warning: useCollapse is changing from uncontrolled to controlled. useCollapse should not switch from uncontrolled to controlled (or vice versa). Decide between using a controlled or uncontrolled collapse for the lifetime of the component. Check the \`isOpen\` prop."`
      );
      expect(consoleOutput.length).toBe(1);
    });

    it('warns about changing from controlled to uncontrolled', () => {
      // Initially control the value
      const { rerender } = render(<Foo isOpen={true} />);
      // Then re-render without controlling it
      rerender(<Foo isOpen={undefined} />);

      expect(consoleOutput[0]).toMatchInlineSnapshot(
        `"Warning: useCollapse is changing from controlled to uncontrolled. useCollapse should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled collapse for the lifetime of the component. Check the \`isOpen\` prop."`
      );
      expect(consoleOutput.length).toBe(1);
    });
  });
});
