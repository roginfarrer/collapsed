---
'react-collapsed': major
---

Reintroduces `react-collapsed` with the following changes:

- Unique IDs for accessibility are now generated with `React.useId`. **React >= 18 is now required.**
- Styles assigned to the collapse element are now assigned to the DOM element directly via a ref, and no longer require `flushSync` to update styles.
- Added `role="region"` to collapse.
