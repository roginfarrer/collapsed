# 🙈 Collapsed

![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/roginfarrer/collapsed/main.yml)
![npm bundle size (version)][minzipped-badge]
[![npm version][npm-badge]][npm-version]
[![Netlify Status](https://api.netlify.com/api/v1/badges/5a5b0e80-d15e-4983-976d-37fe6bdada7a/deploy-status)](https://app.netlify.com/sites/react-collapsed/deploys)

Headless UI for building flexible and accessible animating expand/collapse sections or disclosures. Animates the height of elements to `auto`.

```bash
npm install react-collapsed
```

[View installation and usage docs here!](/packages/react-collapsed)

## Experimental Framework Adapters

[react-collapsed][react-collapsed] is stable and ready to use. I've also been exploring a rewrite with a framework-agnostic core that's also available with a few different framework adapters (indicated with the `@collapsed/` namespace). Here's a breakdown to clarify what's available and their stability:

| Package                            | Stable |
| ---------------------------------- | ------ |
| [react-collapsed][react-collapsed] | ✅     |
| [@collapsed/core](packages/core)   | 🚧     |
| [@collapsed/react](packages/react) | 🚧     |
| [@collapsed/solid](packages/solid) | 🚧     |
| [@collapsed/lit](packages/lit)     | 🚧     |

[react-collapsed]: /packages/react-collapsed
[minzipped-badge]: https://img.shields.io/bundlephobia/minzip/react-collapsed/latest
[npm-badge]: http://img.shields.io/npm/v/react-collapsed.svg?style=flat
[npm-version]: https://npmjs.org/package/react-collapsed "View this project on npm"
[netlify]: https://app.netlify.com/sites/react-collapsed/deploys
[netlify-badge]: https://api.netlify.com/api/v1/badges/4d285ffc-aa4f-4d32-8549-eb58e00dd2d1/deploy-status
