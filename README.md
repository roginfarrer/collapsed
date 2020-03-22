# react-collapsed (useCollapse)

A custom hook for creating flexible and accessible expand/collapse components in React.

## v3

This master branch now reflects the development of the next major release of this library. If you're looking for the latest stable source code, [head over to the v2 branch](https://github.com/roginfarrer/react-collapsed/tree/v2).

## Features

- Handles the height of animations of your elements, `auto` included!
- You control the UI - `useCollapse` provides the necessary props, you control everything else.
- Built with accessibility in mind - no need to worry if your collapse/expand component is accessible, since this takes care of it for you!
- No animation framework required! Simply powered by CSS animations

## Demo

[See the demo site!](https://react-collapsed.netlify.com/)

## Installation

```bash
$ yarn add react-collapsed@next
# or
$ npm i react-collapsed@next
```

## Usage

### Simple Usage

```js
import React from 'react';
import useCollapse from 'react-collapsed';

function Demo() {
  const { getCollapseProps, getToggleProps, isOpen } = useCollapse();

  return (
    <Fragment>
      <button {...getToggleProps()}>{isOpen ? 'Collapse' : 'Expand'}</button>
      <section {...getCollapseProps()}>Collapsed content 🙈</section>
    </Fragment>
  );
}
```

### Control it yourself

```js
import React, { useState } from 'react';
import useCollapse from 'react-collapsed';

function Demo() {
  const [isOpen, setOpen] = useState(false);
  const { getCollapseProps, getToggleProps } = useCollapse({ isOpen });

  return (
    <Fragment>
      <button
        {...getToggleProps({
          onClick: () => setOpen(oldOpen => !oldOpen),
        })}
      >
        {isOpen ? 'Collapse' : 'Expand'}
      </button>
      <section {...getCollapseProps()}>Collapsed content 🙈</section>
    </Fragment>
  );
}
```

## API

```js
const {
  getCollapseProps,
  getToggleProps,
  isOpen,
  toggleOpen,
  mountChildren,
} = useCollapse({
  isOpen: boolean,
  defaultOpen: boolean,
  expandStyles: {},
  collapseStyles: {},
  collapsedHeight: 0,
});
```

### `useCollapse` Config

The following are optional properties passed into `useCollapse({ })`:

| Prop            | Type    | Default                                                                                               | Description                                                  |
| --------------- | ------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| isOpen          | boolean | `undefined`                                                                                           | If true, the Collapse is expanded                            |
| defaultOpen     | boolean | `false`                                                                                               | If true, the Collapse will be expanded when mounted          |
| expandStyles    | object  | `{transitionDuration: '500ms', transitionTimingFunction: 'cubic-bezier(0.250, 0.460, 0.450, 0.940)'}` | Style object applied to the collapse panel when it expands   |
| collapseStyles  | object  | `{transitionDuration: '500ms', transitionTimingFunction: 'cubic-bezier(0.250, 0.460, 0.450, 0.940)'}` | Style object applied to the collapse panel when it collapses |
| collapsedHeight | number  | `0`                                                                                                   | The height of the content when collapsed                     |

### What you get

| Name             | Description                                                                                                 |
| ---------------- | ----------------------------------------------------------------------------------------------------------- |
| getCollapseProps | Function that returns a prop object, which should be spread onto the collapse element                       |
| getToggleProps   | Function that returns a prop object, which should be spread onto an element that toggles the collapse panel |
| isOpen           | Whether or not the collapse is open (if not controlled)                                                     |
| toggleOpen       | Function that will toggle the state of the collapse panel                                                   |
| mountChildren    | Whether or not the collapse panel content should be visible                                                 |

## Alternative Solutions

- [react-spring](https://www.react-spring.io/) - JavaScript animation based library that can potentially have smoother animations.

## Possible Issues

- Applying padding to the collapse block (the element receiving `getCollapseProps`) can lead to infinite animations and state updates. [14](https://github.com/roginfarrer/react-collapsed/issues/14)

  **Solution:** Apply the padding to a child element instead.
