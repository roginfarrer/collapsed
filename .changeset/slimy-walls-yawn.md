---
'react-collapsed': major
---

Reintroduces `react-collapsed` with the following changes:

## BREAKING CHANGES

- **React >= 18 is now required.** Unique IDs for accessibility are now generated with `React.useId`.
- `expandStyles` and `collapseStyles` options have been removed.
- `onExpandStart`, `onExpandEnd`, `onCollapseStart`, `onCollapseEnd` options have been removed and replaced with `onAnimationStageChange`:

  ```typescript
  const useCollapse({
    onAnimationStageChange(stage) {
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

- Styles assigned to the collapse element are now assigned to the DOM element directly via a ref, and no longer require `ReactDOM.flushSync` to update styles in transition.
- Added `role="region"` to collapse.
- Added logic to handle disabling the animation if the user has the prefers reduced motion setting enabled.
- Changed collapsed element's height measurement to `offsetHeight`. Fixes #139.
- Replaced animation resolution handling to a programmatic timer, instead of the `'transitionend'` event. Should fix #103.
- Improved the types for `getCollapseProps` and `getToggleProps`, so their arguments and return type is more accurately typed. This should help catch cases when props returned by the getters are duplicated on the component (such as `ref` or `style`).
- Changes the props returned by `getToggleProps` depending on the HTML tag of the component.
