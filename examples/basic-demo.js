import React from 'react';
import Collapse from '../src/Collapse';

export default function BasicDemo() {
  return (
    <Collapse>
      {({getCollapsibleProps, getTogglerProps}) => (
        <React.Fragment>
          <button {...getTogglerProps()}>Open</button>
          <div
            {...getCollapsibleProps({
              style: {
                borderRadius: 3,
                border: '1px solid paleviolet',
                background: 'lightblue'
              }
            })}
          >
            <div
              style={{
                borderRadius: '50%',
                background: 'blue',
                height: '300px',
                width: '100%'
              }}
            />
          </div>
        </React.Fragment>
      )}
    </Collapse>
  );
}
