const fs = require('fs')
const path = require('path')
const { defineConfig } = require('tsup')

function getTsupConfig(entry, { packageName, packageVersion, external = [] }) {
  entry = Array.isArray(entry) ? entry : [entry]
  external = [...new Set(['react', 'react-dom']), ...external]
  let banner = createBanner(packageName, packageVersion)
  return defineConfig([
    // cjs.dev.js
    {
      entry,
      format: 'cjs',
      sourcemap: true,
      outExtension: getOutExtension('dev'),
      external,
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
      external,
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
      external,
      banner: { js: banner },
      define: {
        'process.env.NODE_ENV': 'true',
      },
      target: 'es2020',
    },
  ])
}

/**
 * @param {"dev" | "prod"} env
 */
function getOutExtension(env) {
  return ({ format }) => ({ js: `.${format}.${env}.js` })
}

/**
 * @param {string} packageName
 * @param {string} version
 */
function createBanner(packageName, version) {
  return `/**
  * ${packageName} v${version}
  *
  * Copyright (c) 2019-${new Date().getFullYear()}, Rogin Farrer
  *
  * This source code is licensed under the MIT license found in the
  * LICENSE.md file in the root directory of this source tree.
  *
  * @license MIT
  */
`
}

function getPackageInfo(packageRoot) {
  let packageJson = fs.readFileSync(
    path.join(packageRoot, 'package.json'),
    'utf8'
  )
  let { version, name } = JSON.parse(packageJson)
  return { version, name }
}

module.exports = { getTsupConfig, getPackageInfo }
