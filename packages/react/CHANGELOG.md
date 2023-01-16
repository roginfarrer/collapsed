Changelog has been moved to [the releases tab](https://github.com/roginfarrer/react-collapsed/releases).

## 4.0.0

### Major Changes

- 1ee93e8: ## BREAKING CHANGES

  - Adopts React 18's `useId`, making the library incompatible with React <18
  - Switch to `tsup` from `microbundle` for bundling library. No longer exports a UMD version, just CJS and MJS

  ## Features & Bug fixes

  - Refactors core functionality to vanilla JS (with a React) adapter, which I think should fix #103 and fix #100
  - Added `onExpandedChange` option
  - Tries to detect if `getToggleProps` is used. If the toggle element ref can be accessed, the `aria-labelledby` attribute will be added to the collapse element
  - Added `role="region"` to collapse
  - Updated toggle props to pass the appropriate attributes to the element, whether it's a button or not

### Patch Changes

- Updated dependencies [1ee93e8]
  - @collapsed/core@4.0.0

---

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
