# 2.0.0

Complete rewrite using React hooks!

* Ends support for React versions < 16.8.x
* Library now exports a custom hook in lieu of a render prop component
* Adds support for unmounting the contents of the Collapse element when closed

```js
import React from 'react';
import useCollapse from 'react-collapsed';

function Demo() {
  const {getCollapseProps, getToggleProps, isOpen} = useCollapse();

  return (
    <>
      <button {...getToggleProps()}>{isOpen ? 'Collapse' : 'Expand'}</button>
      <section {...getCollapseProps()}>Collapsed content 🙈</section>
    </>
  );
}
```

# 1.0.0

Bumped to full release! :)

* `duration`, `easing`, and `delay` now support taking an object with `in` and `out` keys to configure differing in-and-out transitions

# 0.2.0

### Breaking Changes

* `getCollapsibleProps` => `getCollapseProps`. Renamed since it's easier to spell 😅

### Other

* Slew of Flow bug fixes
* Improved documentation

# 0.1.3

* ESLINT wasn't working properly - fixed this
* Added `files` key to package.json to improve NPM load
