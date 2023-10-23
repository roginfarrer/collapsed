---
'react-collapsed': patch
---

Do not call window.matchMedia if it does not exist. Fixes errors thrown in environments like JSDOM.
