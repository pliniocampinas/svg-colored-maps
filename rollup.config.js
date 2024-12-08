import url from '@rollup/plugin-url';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    inlineDynamicImports: true,
  },
  plugins: [
    url({
      include: '**/*.svg',
      limit: 0, // Forces inline SVGs as raw text
    }),
  ],
};