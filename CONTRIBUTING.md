# Contributing

Thanks for wanting to make this component better!

### Project setup

1. Fork and clone the repo
2. `yarn install` and `yarn dev` to install dependencies and spin up the demo site locally
3. Create a branch for your PR

**Tip:** Keep your master branch pointing at the original repository and make pull requests from branches on your fork. To do this, run:

```bash
git remote add upstream https://github.com/roginfarrer/react-collapsed.git
git fetch upstream
git branch --set-upstream-to=upstream/master master
```

This will add the original repository as a "remote" called "upstream," Then fetch the git information from that remote, then set your local master branch to use the upstream master branch whenever you run git pull. Then you can make all of your pull request branches based on this master branch. Whenever you want to update your version of master, do a regular git pull.

### Committing and Pushing changes

Please make sure to run the tests before you commit your changes. You can run `yarn test` to run them (or `yarn test:watch`). Make sure to add new tests for any new features or changes. All tests must pass for a pull request to be accepted.
