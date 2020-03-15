import { renderHook, act } from '@testing-library/react-hooks';
import { useEffectAfterMount, useStateOrProps } from '../src/hooks';

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

describe('useStateOrProps', () => {
  it('should match default snapshot', () => {
    const {
      result: { current },
    } = renderHook(() => useStateOrProps({}));

    expect(current).toMatchInlineSnapshot(`
      Array [
        false,
        [Function],
      ]
    `);
  });

  it('returns the defaultValue value', () => {
    const { result } = renderHook(() => useStateOrProps({ defaultOpen: true }));

    const [value] = result.current;

    expect(value).toBe(true);
  });

  it('setter toggles the value', () => {
    const { result } = renderHook(() => useStateOrProps({ defaultOpen: true }));

    expect(result.current[0]).toBe(true);

    act(() => {
      result.current[1]();
    });

    expect(result.current[0]).toBe(false);
  });
});
