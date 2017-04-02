'use strict';
const webpack = require('webpack');

module.exports = {
    entry: './index.js',
    target: 'node',
    output: {
        filename: '../dist/index.js',
        libraryTarget: 'commonjs2'
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        })
    ]
};
