import {terser} from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import {sizeSnapshot} from 'rollup-plugin-size-snapshot';

import pkg from './package.json';

const NODE_ENV = process.env.NODE_ENV || 'development';
const isProd = NODE_ENV === 'production';

const baseConfig = {
  input: 'src/react-collapsed.js',
  external: ['react', 'raf'],
  output: {
    name: 'ReactCollapsed',
    sourcemap: true,
    globals: {
      react: 'React',
      raf: 'raf',
    },
  },
};

const cjsConfig = {
  ...baseConfig,
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
    }),
    peerDepsExternal(),
    resolve(),
    babel({exclude: 'node_modules/**'}),
    commonjs(),
    sizeSnapshot(),
    isProd && terser(),
  ],
  output: {
    ...baseConfig.output,
    format: 'cjs',
    file: pkg.main,
  },
};

const esmConfig = {
  ...baseConfig,
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
    }),
    peerDepsExternal(),
    resolve(),
    babel({exclude: 'node_modules/**'}),
    // sizeSnapshot(), this errors for some reason?
    isProd && terser(),
  ],
  output: {
    ...baseConfig.output,
    format: 'es',
    file: pkg.module,
  },
};

const umdConfig = {
  ...baseConfig,
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
    }),
    peerDepsExternal(),
    resolve(),
    babel({exclude: 'node_modules/**'}),
    sizeSnapshot(),
    isProd && terser(),
  ],
  output: {
    ...esmConfig.output,
    format: 'umd',
    file: 'dist/react-collapsed.umd.js',
  },
};

export default [cjsConfig, esmConfig, umdConfig];
