import ts from 'rollup-plugin-typescript';

export default {
    input: 'src/index.ts',
    output: {
        file: "./dist/index.bundle.esm.js",
        format: "es",
        banner: `
/* DoxJS version 3.2.0           */
/* Created by Double Dimos       */
/* Released under MIT license    */`
    },
    plugins: [ts()]
}
