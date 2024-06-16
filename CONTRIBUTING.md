# Contributing

Thanks for wanting to make this component better!

Before proceeding with development, ensure you match one of the following criteria:

- Fixing a small bug
- Fixing a larger issue that has been previously discussed and agreed-upon by maintainers
- Adding a new feature that has been previously discussed and agreed-upon by maintainers

## Development

For [react-collapsed](/packages/react-collapsed):

1.  Fork and clone the repo.
1.  `pnpm install` to install dependencies.
1.  `cd packages/react-collapsed` to get into the package directory.
1.  `pnpm storybook` to spin up the storybook.
1.  Implement your changes and tests.
    a. Run tests with `pnpm test` and lints with `pnpm lint`
    b. Add cypress tests with any behavior that's difficult to capture in JSDOM.
1.  Commit your work and submit a pull request for review.

It's also a good idea to test server-side rendering behavior with the [next-app](/packages/next-app).

### Other packages

The framework-agnostic core and its adapters have varying development environments. It's best to check the packages `package.json` to see if they have a storybook or application for development.

**Tip:** Keep your main branch pointing at the original repository and make pull requests from branches on your fork. To do this, run:

```bash
git remote add upstream https://github.com/roginfarrer/collapsed.git
git fetch upstream
git branch --set-upstream-to=upstream/main main
```

This will add the original repository as a "remote" called "upstream," Then fetch the git information from that remote, then set your local main branch to use the upstream main branch whenever you run git pull. Then you can make all of your pull request branches based on this main branch. Whenever you want to update your version of main, do a regular git pull.

### Committing and Pushing changes

Please make sure to run the tests before you commit your changes. You can run `pnpm test` to run them. Make sure to add new tests for any new features or changes. All tests must pass for a pull request to be accepted.
