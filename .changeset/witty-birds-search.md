---
'@collapsed/core': major
'@collapsed/react': major
---

- Package refactored into two libraries: `@collapsed/core` and `@collapsed/react`.
  - `@collapsed/core` is the main functionality that hold can be adapted to different frameworks.
  - `@collapsed/react` is the adapter for React (this replaces `react-collapsed`).
- `useCollapse` is now a named export, not default export.
- New configuration option: `onExpandedChange`.
