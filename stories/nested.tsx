import React from 'react';
import useCollapse from '../src';
import { Toggle, Collapse } from './components';

export function Nested() {
  const {
    getCollapseProps: outerCollapseProps,
    getToggleProps: outerToggleProps,
    isOpen: outerOpen,
  } = useCollapse({
    defaultOpen: true,
  });
  const {
    getCollapseProps: innerCollapseProps,
    getToggleProps: innerToggleProps,
    isOpen: innerOpen,
  } = useCollapse();

  return (
    <React.Fragment>
      <Toggle {...outerToggleProps()}>{outerOpen ? 'Close' : 'Expand'}</Toggle>
      <section {...outerCollapseProps()}>
        <Collapse style={{ display: 'inline-block' }}>
          <p style={{ margin: 0 }}>
            Friends, Romans, countrymen, lend me your ears;
            <br />
            I come to bury Caesar, not to praise him.
            <br />
            The evil that men do lives after them;
            <br />
            The good is oft interred with their bones;
            <br />
            So let it be with Caesar. The noble Brutus
            <br />
            Hath told you Caesar was ambitious:
            <br />
            If it were so, it was a grievous fault,
            <br />
            And grievously hath Caesar answer’d it.
            <br />
            Here, under leave of Brutus and the rest–
            <br />
            For Brutus is an honourable man;
            <br />
            So are they all, all honourable men–
            <br />
            Come I to speak in Caesar’s funeral.
          </p>
          {!innerOpen && (
            <Toggle {...innerToggleProps({ style: { display: 'block' } })}>
              Read more?
            </Toggle>
          )}
          <p {...innerCollapseProps({ style: { margin: 0 } })}>
            He was my friend, faithful and just to me:
            <br />
            But Brutus says he was ambitious;
            <br />
            And Brutus is an honourable man.
            <br />
            He hath brought many captives home to Rome
            <br />
            Whose ransoms did the general coffers fill:
            <br />
            Did this in Caesar seem ambitious?
            <br />
            When that the poor have cried, Caesar hath wept:
            <br />
            Ambition should be made of sterner stuff:
          </p>
          {innerOpen && (
            <Toggle {...innerToggleProps({ style: { display: 'block' } })}>
              Click to collapse
            </Toggle>
          )}
        </Collapse>
      </section>
    </React.Fragment>
  );
}
