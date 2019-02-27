import {getElementHeight} from '../utils';

const mockRef = {
  current: {
    scrollHeight: 400,
  },
};

test('returns scrollHeight', () => {
  expect(getElementHeight(mockRef)).toBe('400px');
});

test('returns auto when no ref provided', () => {
  expect(getElementHeight(null)).toBe('auto');
});
