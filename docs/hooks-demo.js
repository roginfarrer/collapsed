import React, {useState} from 'react';
import {useCollapse} from '../src/collapse-hooks';

export default function Demo() {
  const [isOpen, setOpen] = useState(false);
  const {getCollapseProps, getTogglerProps} = useCollapse({isOpen});
  return (
    <div>
      <div {...getTogglerProps({onClick: () => setOpen(oldOpen => !oldOpen)})}>
        Toggle
      </div>
      <div {...getCollapseProps()}>
        <div style={{background: 'blue', height: 400, color: 'white'}}>
          {isOpen ? 'open' : 'closed'}
        </div>
      </div>
    </div>
  );
}
