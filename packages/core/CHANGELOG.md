# @collapsed/core

## 4.0.1

### Patch Changes

- cd21fd4: Remove package.json exports

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
