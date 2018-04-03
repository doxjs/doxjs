const path = require('path');
const html = require('html-webpack-plugin');
const clean = require('clean-webpack-plugin');

module.exports = {
    entry: {
        index: './index.ts',
    },
    devtool: 'inline-source-map',
    plugins: [
        new clean(['dist']),
        new html({
            title: "test"
        })
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: '/node_modules/'
            }
        ]
    },
    mode: 'development',
    resolve: {
        extensions: ['.ts', '.js']
    },
    devServer: {
        contentBase: './dist'
    }
}