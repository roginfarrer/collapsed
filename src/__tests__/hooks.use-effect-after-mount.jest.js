import {renderHook, cleanup} from 'react-hooks-testing-library';
import {useEffectAfterMount} from '../hooks';
// add custom jest matchers from jest-dom
import 'jest-dom/extend-expect';

afterEach(cleanup);

test('', () => {
  const cb = jest.fn();

  // Provide a dependency that changes, so it re-renders
  let x = 0;
  const {rerender} = renderHook(() => {
    x++;
    return useEffectAfterMount(cb, [x]);
  });

  expect(cb).not.toHaveBeenCalled();
  rerender();
  expect(cb).toHaveBeenCalled();
});
