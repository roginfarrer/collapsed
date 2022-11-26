module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  globals: {
    __DEV__: true,
  },
  testMatch: ['<rootDir>/**/*.(spec|test).{ts,tsx,js,jsx}'],
}
