# React-Collapsed (useCollapse) 🙈

A tiny (< 2kb) custom hook for creating flexible and accessible expand/collapse components in React.

## Features

* Handles the height of animations of your elements, `auto` included!
* You control the UI - `useCollapse` provides the necessary props, you control everything else.
* Built with accessibility in mind - no need to worry if your collapse/expand component is accessible, since this takes care of it for you!
* Small footprint (< 2kb gzipped)
* No animation framework required! Simply powered by CSS animations

## Demo

[See the demo site!](https://react-collapsed.netlify.com/)

## Installation

```bash
$ yarn add react-collapsed
# or
$ npm i react-collapsed
```

## Usage

### Simple Usage

```js
import React from 'react';
import useCollapse from 'react-collapsed';

function Demo() {
  const {getCollapseProps, getToggleProps, isOpen} = useCollapse();

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
import React, {useState} from 'react';
import useCollapse from 'react-collapsed';

function Demo() {
  const [isOpen, setOpen] = useState(false);
  const {getCollapseProps, getToggleProps} = useCollapse({isOpen});

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
