import React, {useState} from 'react';
import {useCollapse} from '../src/collapse-hooks';

function Collapse() {
  const {getCollapseProps, getTogglerProps, isOpen} = useCollapse();
  return (
    <div>
      <button {...getTogglerProps()}>Toggle</button>
      <div {...getCollapseProps()}>
        <div style={{background: 'blue', height: 400, color: 'white'}}>
          {isOpen ? 'open' : 'closed'}
        </div>
      </div>
    </div>
  );
}

export default function NestedDemo() {
  const {getCollapseProps, getTogglerProps, isOpen} = useCollapse();
  return (
    <div>
      <button {...getTogglerProps()}>Toggle</button>
      <div {...getCollapseProps()}>
        <div style={{background: 'yellow', height: 400, color: 'white'}}>
          {isOpen ? 'open' : 'closed'}
          <Collapse />
        </div>
      </div>
    </div>
  );
}
