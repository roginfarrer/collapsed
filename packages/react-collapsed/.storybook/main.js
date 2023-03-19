module.exports = {
  stories: ['../stories/*.stories.tsx'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
  ],
  core: {
    builder: '@storybook/builder-vite',
  },
}
