# react-collapsed

## 4.1.1

### Patch Changes

- a12f2e4: Do not call window.matchMedia if it does not exist. Fixes errors thrown in environments like JSDOM.

## 4.1.0

### Minor Changes

- 3c86a81: Added support for overriding `id`.

## 4.0.4

### Patch Changes

- 2a098e1: Account for different signatures of addEventListener and addListener, fix #152

## 4.0.3

### Patch Changes

- 6bb5507: Fixed crashing errors from MatchMedia in Safari <= 13. Thanks @kostia1st!

## 4.0.2

### Patch Changes

- 980b971: Fixed mismatched logic for prefer-reduced-motion

## 4.0.1

### Major Changes

- 5e427ec: This is a big refactor of `react-collapsed`, enough I wanted to denote it with a new major version.

  ## BREAKING CHANGES

  - `expandStyles` and `collapseStyles` options have been removed.
  - `onExpandStart`, `onExpandEnd`, `onCollapseStart`, `onCollapseEnd` options have been removed and replaced with `onTransitionStateChange`:

    ```typescript
    const useCollapse({
      onTransitionStateChange(stage) {
        switch (stage) {
          case 'expandStart':
          case 'expandEnd':
          case 'expanding':
          case 'collapseStart':
          case 'collapseEnd':
          case 'collapsing':
            // do thing
          default:
            break;
        }
      }
    })
    ```

  ## Other changes

  - Unique IDs for accessibility are now generated with `React.useId` if it's available.
  - Styles assigned to the collapse element are now assigned to the DOM element directly via a ref, and no longer require `ReactDOM.flushSync` to update styles in transition.
  - Added `role="region"` to collapse.
  - Added logic to handle disabling the animation if the user has the prefers reduced motion setting enabled.
  - Replaced animation resolution handling to a programmatic timer, instead of the `'transitionend'` event. Should fix #103.
  - Improved the types for `getCollapseProps` and `getToggleProps`, so their arguments and return type is more accurately typed. This should help catch cases when props returned by the getters are duplicated on the component (such as `ref` or `style`).
  - Changes the props returned by `getToggleProps` depending on the HTML tag of the component.

# 2.0.0

Complete rewrite using React hooks!

- Ends support for React versions < 16.8.x
- Library now exports a custom hook in lieu of a render prop component
- Adds support for unmounting the contents of the Collapse element when closed

```js
import React from 'react'
import useCollapse from 'react-collapsed'

function Demo() {
  const { getCollapseProps, getToggleProps, isOpen } = useCollapse()

  return (
    <>
      <button {...getToggleProps()}>{isOpen ? 'Collapse' : 'Expand'}</button>
      <section {...getCollapseProps()}>Collapsed content 🙈</section>
    </>
  )
}
```

# 1.0.0

Bumped to full release! :)

- `duration`, `easing`, and `delay` now support taking an object with `in` and `out` keys to configure differing in-and-out transitions

# 0.2.0

### Breaking Changes

- `getCollapsibleProps` => `getCollapseProps`. Renamed since it's easier to spell 😅

### Other

- Slew of Flow bug fixes
- Improved documentation

# 0.1.3

- ESLINT wasn't working properly - fixed this
- Added `files` key to package.json to improve NPM load
