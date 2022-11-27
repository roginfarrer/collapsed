import { defineConfig } from 'tsup'

const entry = ['./src/index.ts']
const banner = `/**
  * react-collapsed
  *
  * Copyright (c) 2019-${new Date().getFullYear()}, Rogin Farrer
  *
  * This source code is licensed under the MIT license found in the
  * LICENSE.md file in the root directory of this source tree.
  *
  * @license MIT
  */
`

export default defineConfig([
  // cjs.dev.js
  {
    entry,
    format: 'cjs',
    sourcemap: true,
    outExtension: getOutExtension('dev'),
    banner: { js: banner },
    define: {
      'process.env.NODE_ENV': 'true',
    },
    target: 'es2016',
  },

  // cjs.prod.js
  {
    entry,
    format: 'cjs',
    minify: true,
    minifySyntax: true,
    outExtension: getOutExtension('prod'),
    define: {
      'process.env.NODE_ENV': 'false',
    },
    target: 'es2016',
  },

  // esm
  {
    entry,
    dts: { banner },
    format: 'esm',
    banner: { js: banner },
    define: {
      'process.env.NODE_ENV': 'true',
    },
    target: 'es2020',
  },
])

function getOutExtension(env: string) {
  return ({ format }) => ({ js: `.${format}.${env}.js` })
}
