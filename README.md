# react-collapsed (useCollapse)

[![CI][ci-badge]][ci]
![npm bundle size (version)][minzipped-badge]
[![npm version][npm-badge]][npm-version]
[![Documentation Netlify Status][netlify-badge]][netlify]

A custom hook for creating accessible expand/collapse components in React. Animates the height using CSS transitions from `0` to `auto`.

## v3

This master branch now reflects the development of the next major release of this library. If you're looking for the latest stable source code, [head over to the v2 branch](https://github.com/roginfarrer/react-collapsed/tree/v2).

## Features

- Handles the height of animations of your elements, `auto` included!
- You control the UI - `useCollapse` provides the necessary props, you control the styles and the elements.
- Accessible out of the box - no need to worry if your collapse/expand component is accessible, since this takes care of it for you!
- No animation framework required! Simply powered by CSS animations
- Written in TypeScript

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
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();

  return (
    <div>
      <button {...getToggleProps()}>
        {isExpanded ? 'Collapse' : 'Expand'}
      </button>
      <section {...getCollapseProps()}>Collapsed content 🙈</section>
    </div>
  );
}
```

### Control it yourself

```js
import React, { useState } from 'react';
import useCollapse from 'react-collapsed';

function Demo() {
  const [isExpanded, setOpen] = useState(false);
  const { getCollapseProps, getToggleProps } = useCollapse({ isExpanded });

  return (
    <div>
      <button
        {...getToggleProps({
          onClick: () => setOpen(oldOpen => !oldOpen),
        })}
      >
        {isExpanded ? 'Collapse' : 'Expand'}
      </button>
      <section {...getCollapseProps()}>Collapsed content 🙈</section>
    </div>
  );
}
```

## API

```js
const {
  getCollapseProps,
  getToggleProps,
  isExpanded,
  toggleOpen,
  mountChildren,
} = useCollapse({
  isExpanded: boolean,
  defaultExpanded: boolean,
  expandStyles: {},
  collapseStyles: {},
  collapsedHeight: 0,
  easing: string,
  duration: number,
});
```

### `useCollapse` Config

The following are optional properties passed into `useCollapse({ })`:

| Prop            | Type    | Default                        | Description                                                                                                                                         |
| --------------- | ------- | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| isExpanded      | boolean | `undefined`                    | If true, the Collapse is expanded                                                                                                                   |
| defaultExpanded | boolean | `false`                        | If true, the Collapse will be expanded when mounted                                                                                                 |
| expandStyles    | object  | `{}`                           | Style object applied to the collapse panel when it expands                                                                                          |
| collapseStyles  | object  | `{}`                           | Style object applied to the collapse panel when it collapses                                                                                        |
| collapsedHeight | number  | `0`                            | The height of the content when collapsed                                                                                                            |
| easing          | string  | `cubic-bezier(0.4, 0, 0.2, 1)` | The transition timing function for the animation                                                                                                    |
| duration        | number  | `undefined`                    | The duration of the animation in milliseconds. By default, the duration is programmatically calculated based on the height of the collapsed element |

### What you get

| Name             | Description                                                                                                 |
| ---------------- | ----------------------------------------------------------------------------------------------------------- |
| getCollapseProps | Function that returns a prop object, which should be spread onto the collapse element                       |
| getToggleProps   | Function that returns a prop object, which should be spread onto an element that toggles the collapse panel |
| isExpanded       | Whether or not the collapse is expanded (if not controlled)                                                 |
| toggleExpanded   | Function that will toggle the expanded state of the collapse panel                                          |
| mountChildren    | Whether or not the collapse panel content should be visible                                                 |

## Alternative Solutions

- [react-spring](https://www.react-spring.io/) - JavaScript animation based library that can potentially have smoother animations. Requires a bit more work to create an accessible collapse component.
- [react-animate-height](https://github.com/Stanko/react-animate-height/) - Another library that uses CSS transitions to animate to any height. It provides components, not a hook.

## FAQ

<details>
<summary>When I apply vertical `padding` to the component that gets `getCollapseProps`, the animation is janky and it doesn't collapse all the way. What gives?</summary>

The collapse works by manipulating the `height` property. If an element has vertical padding, that padding expandes the size of the element, even if it has `height: 0; overflow: hidden`.

To avoid this, simply move that padding from the element to an element directly nested within in.

```javascript
// from
<div {...getCollapseProps({style: {padding: 20}})}
  This will do weird things
</div>

// to
<div {...getCollapseProps()}
  <div style={{padding: 20}}>
    Much better!
  </div>
</div>
```

</details>

[minzipped-badge]: https://img.shields.io/bundlephobia/minzip/react-collapsed/latest
[npm-badge]: http://img.shields.io/npm/v/react-collapsed.svg?style=flat
[npm-version]: https://npmjs.org/package/react-collapsed 'View this project on npm'
[ci-badge]: https://github.com/roginfarrer/react-collapsed/workflows/CI/badge.svg
[ci]: https://github.com/roginfarrer/react-collapsed/actions?query=workflow%3ACI+branch%3Amaster
[netlify]: https://app.netlify.com/sites/react-collapsed-next/deploys
[netlify-badge]: https://api.netlify.com/api/v1/badges/4d285ffc-aa4f-4d32-8549-eb58e00dd2d1/deploy-status
