# NOTE

You're probably looking for [react-collapsed](../react-collapsed). This package (alongside [@collapsed/core](../core)) is a WIP rewrite to create a Vanilla JS core.

---

# @collapsed/react (useCollapse)

A React hook for creating accessible expand/collapse components. Animates the height using CSS transitions from `0` to `auto`.

## Features

- Handles the height of animations of your elements, `auto` included!
- You control the UI - `useCollapse` provides the necessary props, you control the styles and the elements.
- Accessible out of the box - no need to worry if your collapse/expand component is accessible, since this takes care of it for you!
- No animation framework required! Simply powered by CSS animations
- Written in TypeScript

## Demo

[See the demo site!](https://react-collapsed.netlify.app/)

[CodeSandbox demo](https://codesandbox.io/s/magical-browser-vibv2?file=/src/App.tsx)

## Installation

```bash
$ npm i @collapsed/react
```

## Usage

### Simple Usage

```js
import React from "react";
import { useCollapse } from "@collapsed/react";

function Demo() {
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();

  return (
    <div>
      <button {...getToggleProps()}>
        {isExpanded ? "Collapse" : "Expand"}
      </button>
      <section {...getCollapseProps()}>Collapsed content 🙈</section>
    </div>
  );
}
```

### Control it yourself

```js
import React, { useState } from "react";
import { useCollapse } from "@collapsed/react";

function Demo() {
  const [isExpanded, setExpanded] = useState(false);
  const { getCollapseProps, getToggleProps } = useCollapse({ isExpanded });

  return (
    <div>
      <button
        {...getToggleProps({
          onClick: () => setExpanded((prevExpanded) => !prevExpanded),
        })}
      >
        {isExpanded ? "Collapse" : "Expand"}
      </button>
      <section {...getCollapseProps()}>Collapsed content 🙈</section>
    </div>
  );
}
```

## API

`useCollapse` takes the following options:

```ts
interface UseCollapseOptions {
  /** If true, the disclosure is expanded. */
  isExpanded?: boolean;
  /**
   * If true, the disclosure is expanded when it initially mounts.
   * @default false
   */
  defaultExpanded?: boolean;
  /** Handler called when the disclosure expands or collapses */
  onExpandedChange?: (state: boolean) => void;
  /** Handler called at each stage of the animation. */
  onTransitionStateChange?: (
    state:
      | "expandStart"
      | "expanding"
      | "expandEnd"
      | "collapseStart"
      | "collapsing"
      | "collapseEnd",
  ) => void;
  /** Timing function for the transition */
  easing?: string;
  /**
   * Duration of the expand/collapse animation.
   * If 'auto', the duration will be calculated based on the height of the collapse element
   */
  duration?: "auto" | number;
  /** Height in pixels that the collapse element collapses to */
  collapsedHeight?: number;
  /**
   * Unique identifier used to for associating elements appropriately for accessibility.
   */
  id?: string;
}
```

And returns the following API:

```ts
interface CollapseAPI {
  isExpanded: boolean;
  setExpanded: (update: boolean | ((prev: boolean) => boolean)) => void;
  getToggleProps: <T extends HTMLElement>(
    props?: React.ComponentPropsWithoutRef<T> & { refKey?: string },
  ) => React.ComponentPropsWithRef<T>;
  getCollapseProps: <T extends HTMLElement>(
    props?: React.ComponentPropsWithoutRef<T> & { refKey?: string },
  ) => React.ComponentPropsWithRef<T>;
}
```

## Alternative Solutions

- [react-spring](https://www.react-spring.io/) - JavaScript animation based library that can potentially have smoother animations. Requires a bit more work to create an accessible collapse component.
- [react-animate-height](https://github.com/Stanko/react-animate-height/) - Another library that uses CSS transitions to animate to any height. It provides components, not a hook.

## FAQ

<details>
<summary>When I apply vertical <code>padding</code> to the component that gets <code>getCollapseProps</code>, the animation is janky and it doesn't collapse all the way. What gives?</summary>

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
