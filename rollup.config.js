import url from '@rollup/plugin-url';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    inlineDynamicImports: true,
    // format: 'cjs', // Or 'esm' for modern JavaScript environments
  },
  plugins: [
    url({
      include: '**/*.svg',
      limit: 0, // Forces inline SVGs as raw text
    }),
  ],
};