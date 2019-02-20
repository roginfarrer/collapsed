import React, {useState} from 'react';
import {useCollapse} from '../src/Collapse';

export default function Demo() {
  // const [isOpen, setOpen] = useState(null);
  const {getCollapseProps, getTogglerProps, isOpen} = useCollapse();
  return (
    <div>
      <button
        // onClick={() => setOpen(!isOpen)}
        {...getTogglerProps()}
      >
        Toggle
      </button>
      <div {...getCollapseProps()}>
        <div style={{background: 'blue', height: 400, color: 'white'}}>
          {isOpen ? 'open' : 'closed'}
        </div>
      </div>
    </div>
  );
}
