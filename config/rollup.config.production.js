import uglify from "rollup-plugin-uglify";
import ts from 'rollup-plugin-typescript';

export default {
    entry: 'src/index.ts',
    output: {
        file: "./dist/index.bundle.min.js",
        format: "cjs",
        banner: `/* DoxJS version 3.2.0           */
/* Created by Double Dimos       */
/* Released under MIT license    */`
    },
    plugins: [ uglify(), ts() ]
}
