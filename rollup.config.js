import svg from 'rollup-plugin-svg-import';

export default {
  input: 'src/index.js',
  output: {
		dir: 'dist',
  },
  plugins: [
    svg({
      /**
       * If `true`, instructs the plugin to import an SVG as string.
       * For example, for Server Side Rendering.
       * Otherwise, the plugin imports SVG as DOM node.
       */
       stringify: true
     }),
  ],
};