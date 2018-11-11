import {uglify} from 'rollup-plugin-uglify';
import babel from 'rollup-plugin-babel';

export default {
  input: 'src/Collapse.js',
  external: ['react'],
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    uglify()
  ],
  output: {
    format: 'umd',
    name: 'collapse',
    globals: {
      react: 'React',
      raf: 'RAF'
    }
  }
};
