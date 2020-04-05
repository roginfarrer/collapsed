import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { render } from '@testing-library/react';
import { useEffectAfterMount, useControlledState } from '../src/hooks';

describe('useEffectAfterMount', () => {
  it('does not run callback on first render', () => {
    const cb = jest.fn();

    // Provide a dependency that changes, so it re-renders
    let x = 0;
    const { rerender } = renderHook(() => {
      x++;
      return useEffectAfterMount(cb, [x]);
    });

    expect(cb).not.toHaveBeenCalled();
    rerender();
    expect(cb).toHaveBeenCalled();
  });
});

describe('useControlledState', () => {
  it('should match default snapshot', () => {
    const {
      result: { current },
    } = renderHook(() => useControlledState({}));

    expect(current).toMatchInlineSnapshot(`
      Array [
        false,
        [Function],
      ]
    `);
  });

  it('returns the defaultValue value', () => {
    const { result } = renderHook(() =>
      useControlledState({ defaultOpen: true })
    );

    const [value] = result.current;

    expect(value).toBe(true);
  });

  it('setter toggles the value', () => {
    const { result } = renderHook(() =>
      useControlledState({ defaultOpen: true })
    );

    expect(result.current[0]).toBe(true);

    act(() => {
      result.current[1]();
    });

    expect(result.current[0]).toBe(false);
  });

  describe('dev feedback', () => {
    // Mocking console.warn so it does not log to the console,
    // but we can still intercept the message
    const originalWarn = console.warn;
    let consoleOutput: string[] = [];
    const mockWarn = (output: any) => consoleOutput.push(output);
    console.warn = jest.fn(mockWarn);

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
