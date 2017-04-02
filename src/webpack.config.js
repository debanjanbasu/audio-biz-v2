'use strict';
const webpack = require('webpack'),
    UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: './index.js',
    target: 'node',
    output: {
        filename: '../dist/index.js',
        libraryTarget: 'commonjs2'
    },
    plugins: [
        new UglifyJSPlugin({
            compress: {
                warnings: false,
            },
            output: {
                comments: false,
            }
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        })
    ]
};
