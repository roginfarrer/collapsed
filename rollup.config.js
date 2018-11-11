import {uglify} from 'rollup-plugin-uglify';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/Collapse.js',
  external: ['react', 'raf'],
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    commonjs(),
    production && uglify()
  ],
  output: {
    format: 'umd',
    name: 'ReactCollapsed',
    sourcemap: true,
    globals: {
      react: 'React',
      raf: 'RAF'
    }
  }
};
