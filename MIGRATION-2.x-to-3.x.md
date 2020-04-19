# Migrating from 2.x to 3.x

## BREAKING CHANGES

- `useCollapse` has been completely rewritten in TypeScript, and now exports types.
- `useCollapse` configuration has changed:
  - `isOpen` -> `isExpanded`
  - `defaultOpen` -> `defaultExpanded`
  - `expandStyles.transitionDuration` and `collapseStyles.transitionDuration` have been moved to a single `duration` property
  - `expandStyles.transitionTimingFunction` and `collapseStyles.transitionTimingFunction` have been moved to a single `easing` property
- `useCollapse` output has changed:
  - `isOpen` -> `isExpanded`
  - `mountChildren` has been removed. Event hooks are now provided to recreate this feature. [See below for more](#mountChildren)
  - `toggleOpen` has been replaced with `setExpanded`, which requires a boolean that sets the expanded state, or a callback that returns a boolean.
- The default transition duration has been changed from `500ms` to being calculated based on the height of the collapsed content. Encouraged to leave this default since it will provide more natural animations.
- The default transition curve has been changed from `cubic-bezier(0.250, 0.460, 0.450, 0.940)` to `ease-in-out`, or `cubic-bezier(0.4, 0, 0.2, 1)`

See below for more detail on the above changes.

## Input

The hook's property names have been changed for clarity:

- `isOpen` -> `isExpanded`
- `defaultOpen` -> `defaultExpanded`

In 2.x, the customizing the transition duration and easing was done by setting `transitionDuration` and `transitionTimingFunction` in `expandStyles` or `collapseStyles`. Those have been both pulled out and promoted to top-level settings via `duration` and `easing`, respectively.

The default value for `duration` is also no longer a fixed value. Instead, the duration is calculated based on the height of the collapsed content to create more natural transitions.

The transition easing was also updated from a custom curve to a more basic `ease-in-out` curve.

In summary:

```diff
const collapse = useCollaspse({
  collapseStyles: {},
  expandStyles: {},
  collapsedHeight: number,
- isOpen: boolean,
- defaultOpen: boolean,
+ duration: number,
+ easing: string,
+ isExpanded: boolean,
+ defaultExpanded: boolean,
+ onCollapseStart() {},
+ onCollapseEnd() {},
+ onExpandStart() {},
+ onExpandEnd() {},
})
```

## Output

- `isOpen` -> `isExpanded`
- `toggleOpen` -> `setExpanded`
- `mountChildren` has been removed.

`setExpanded` now also supports an argument to set the expanded state. Previously, to toggle the expanded state, you would just call the `toggleOpen` function:

```javascript
<button onClick={() => toggleOpen()}>Toggle</button>
```

Now, you must provide a boolean or a function that returns a boolean:

```javascript
<button onClick={() => setExpanded((prevExpanded) => !prevExpanded)}>
  Toggle
</button>
```

### `mountChildren`

`mountChildren` has been removed. In order to recreate the same functionality, you can hook into the `onExpandStart` and `onCollapseEnd` hooks:

```javascript
function Collapse() {
  const [mountChildren, setMountChildren] = useState(false);
  const { getToggleProps, getCollapseProps } = useCollapse({
    onCollapseEnd() {
      setMountChildren(false);
    },
    onExpandStart() {
      setMountChildren(true);
    },
  });

  return (
    <div>
      <button {...getToggleProps()}>Toggle</button>
      <div {...getCollapseProps()}>
        {mountChildren && <p>I will only render when expanded!</p>}
      </div>
    </div>
  );
}
```

