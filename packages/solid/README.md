# @collapsed/solid

A Solid.js utility for creating accessible expand/collapse components. Animates the height using CSS transitions from `0` to `auto`.

## Features

- Handles the height of animations of your elements, `auto` included!
- You control the UI - `createCollapse` provides the necessary props, you control the styles and the elements.
- Accessible out of the box - no need to worry if your collapse/expand component is accessible, since this takes care of it for you!
- No animation framework required! Simply powered by CSS animations
- Written in TypeScript

## Installation

```bash
npm install @collapsed/solid
```

## Usage

```tsx
import { createCollapse } from "@collapsed/solid";

export default function App() {
  const collapse = createCollapse();

  return (
    <main>
      <button {...collapse.getToggleProps()}>Toggle</button>
      <div {...collapse.getCollapseProps()}>
        {/* Content to be shown/hidden here */}
      </div>
    </main>
  );
}
```

### Controlled Usage

```tsx
import { createSignal } from "solid-js";
import { createCollapse } from "@collapsed/solid";

export default function App() {
  const [open, setOpen] = createSignal(false);
  const collapse = createCollapse({
    get isExpanded() {
      return open();
    },
  });

  return (
    <main>
      <button
        {...collapse.getToggleProps({
          onClick: () => setOpen((prevOpen) => prevOpen),
        })}
      >
        Toggle
      </button>
      <div {...collapse.getCollapseProps()}>
        {/* Content to be shown/hidden here */}
      </div>
    </main>
  );
}
```

## API

`createCollapse` takes the following options:

```ts
interface CreateCollapseOptions {
  /** If true, the disclosure is expanded. */
  isExpanded?: boolean;
  /**
   * If true, the disclosure is expanded when it initially mounts.
   * @default false
   */
  initialExpanded?: boolean;
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
  getDisclosureElement: () => HTMLElement;
  /** Timing function for the transition */
  easing?: string;
  /**
   * Duration of the expand/collapse animation.
   * If 'auto', the duration will be calculated based on the height of the collapse element
   */
  duration?: "auto" | number;
  /** Height in pixels that the collapse element collapses to */
  collapsedHeight?: number;
}
```

And returns the following API:

```ts
interface CreateCollapseAPI {
  isExpanded: boolean;
  setExpanded: (updater: boolean | ((prev: boolean) => boolean)) => void;
  getToggleProps: <T extends HTMLElement>(
    props?: JSX.HTMLAttributes<T>,
  ) => JSX.HTMLAttributes<T>;
  getCollapseProps: <T extends HTMLElement>(
    props?: JSX.HTMLAttributes<T>,
  ) => JSX.HTMLAttributes<T>;
}
```
