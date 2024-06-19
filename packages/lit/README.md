# @collapsed/lit

![NPM Version](https://img.shields.io/npm/v/%40collapsed%2Flit)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/%40collapsed%2Flit)

A Lit element for creating accessible expand/collapse elements. Animates the height using CSS transitions from `0` to `auto`.

## Features

- Handles the height of animations of your elements, `auto` included!
- Minimally-styled to be functional--you control the styles.
- No animation framework required! Simply powered by CSS animations.

## Installation

```bash
npm install @collapsed/lit
```

## Usage

```tsx
import { CollapsedDisclosure } from "@collapsed/lit";
import { html } from "lit";

export function App() {
  function handleClick(evt) {
    const collapse = document.querySelector("#disclosure");
    const btn = event.target;
    collapse.toggleAttribute("open");
    btn.setAttribute("aria-expanded", collapse.hasAttribute("open").toString());
  }

  return html`<div>
    <button
      aria-controls="disclosure"
      aria-expanded="false"
      @click="${handleClick}"
    >
      Toggle
    </button>
    <collapsed-disclosure id="disclosure">
      <!-- Content goes here -->
    </collapsed-disclosure>
  </div>`;
}
```
