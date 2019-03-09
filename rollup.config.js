import {terser} from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from 'rollup-plugin-node-resolve';

import pkg from './package.json';

const baseConfig = {
  input: 'src/collapsed.js',
  external: ['react', 'raf'],
};

const cjsConfig = {
  ...baseConfig,
  plugins: [
    peerDepsExternal(),
    resolve(),
    babel({exclude: 'node_modules/**'}),
    commonjs(),
    terser(),
  ],
  output: {
    format: 'cjs',
    file: pkg.main,
    name: 'ReactCollapsed',
    sourcemap: true,
  },
};

const esmConfig = {
  ...baseConfig,
  plugins: [
    peerDepsExternal(),
    resolve(),
    babel({exclude: 'node_modules/**'}),
    terser(),
  ],
  output: {
    format: 'esm',
    file: pkg.module,
    name: 'ReactCollapsed',
    sourcemap: true,
  },
};

const umdConfig = {
  ...esmConfig,
  output: {
    ...esmConfig.output,
    format: 'umd',
    file: 'dist/react-collapsed.umd.js',
  },
};

export default [cjsConfig, esmConfig, umdConfig];
