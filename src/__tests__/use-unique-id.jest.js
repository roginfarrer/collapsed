import React from 'react';
import {useUniqueId} from '../utils';
import {render} from 'react-testing-library';

const UniqueId = ({children, ...props}) => children(useUniqueId(props));

const setup = props => {
  let returnVal;
  render(
    <UniqueId {...props}>
      {val => {
        returnVal = val;
        return null;
      }}
    </UniqueId>
  );
  return returnVal;
};

test('returns a value', () => {
  let value;
  const wrapper = render(
    <UniqueId>
      {val => {
        value = val;
        return null;
      }}
    </UniqueId>
  );
});
