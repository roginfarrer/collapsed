import React from 'react';
import {useCollapse} from '../../src/collapsed';
import {CollapseDemo} from '../_ui-components/ui-components';

export default function NestedDemo() {
  const {
    getCollapseProps: outerCollapseProps,
    getToggleProps: outerToggleProps,
    isOpen: outerOpen,
  } = useCollapse();
  const {
    getCollapseProps: innerCollapseProps,
    getToggleProps: innerToggleProps,
    isOpen: innerOpen,
  } = useCollapse();

  return (
    <React.Fragment>
      <button {...outerToggleProps({style: {marginBottom: '1em'}})}>
        {outerOpen ? 'Close' : 'Expand'}
      </button>
      <section {...outerCollapseProps()}>
        <CollapseDemo is="div">
          <p style={{margin: 0}}>
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
            <button {...innerToggleProps({style: {display: 'block'}})}>
              Read more?
            </button>
          )}
          <p {...innerCollapseProps({style: {margin: 0}})}>
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
            <br />
            Yet Brutus says he was ambitious;
            <br />
            And Brutus is an honourable man.
            <br />
            You all did see that on the Lupercal
            <br />
            I thrice presented him a kingly crown,
            <br />
            Which he did thrice refuse: was this ambition?
            <br />
            Yet Brutus says he was ambitious;
            <br />
            And, sure, he is an honourable man.
            <br />
            I speak not to disprove what Brutus spoke,
            <br />
            But here I am to speak what I do know.
            <br />
            You all did love him once, not without cause:
            <br />
            What cause withholds you then, to mourn for him?
            <br />
            O judgment! thou art fled to brutish beasts,
            <br />
            And men have lost their reason. Bear with me;
            <br />
            My heart is in the coffin there with Caesar,
            <br />
            And I must pause till it come back to me.
          </p>
          {innerOpen && (
            <button {...innerToggleProps({style: {display: 'block'}})}>
              Click to collapse
            </button>
          )}
        </CollapseDemo>
      </section>
    </React.Fragment>
  );
}
