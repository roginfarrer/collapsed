import {renderHook, cleanup, act} from 'react-hooks-testing-library';
import {useCollapse} from '../collapse-hooks';
// add custom jest matchers from jest-dom
import 'jest-dom/extend-expect';

afterEach(cleanup);

test('returns expected constants', () => {
  const {result} = renderHook(useCollapse);
  const {isOpen, getToggleProps, getCollapseProps, toggleOpen} = result.current;

  expect(typeof isOpen).toBe('boolean');
  expect(typeof toggleOpen).toBe('function');
  expect(typeof getToggleProps()).toBe('object');
  expect(typeof getCollapseProps()).toBe('object');
});

test('toggleOpen toggles isOpen', () => {
  const {result} = renderHook(useCollapse);
  const {toggleOpen} = result.current;
  act(toggleOpen);
  const {isOpen} = result.current;
  expect(isOpen).toBe(true);
});
