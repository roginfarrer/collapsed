import { getElementHeight, callAll } from '../utils';

const mockRef = {
  current: {
    scrollHeight: 400,
  },
};

test('returns scrollHeight', () => {
  expect(getElementHeight(mockRef)).toBe(400);
});

describe('callAll', () => {
  it('it calls the two functions passed into it', () => {
    const functionOne = jest.fn();
    const functionTwo = jest.fn();
    const theFunk = callAll(functionOne, functionTwo);
    theFunk();
    expect(functionOne).toHaveBeenCalled();
    expect(functionTwo).toHaveBeenCalled();
  });
});
