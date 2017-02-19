const path = require('path');
const webpack = require('webpack');

const config = {
    entry: './src/index.js',
    output: {
        filename: 'bot.js',
        path: path.resolve(__dirname),
    },
    node: {
        __dirname: true,
        __filename: true,
    },
    target: 'node',
    resolve: {
        alias: {
            core: path.resolve(__dirname, 'src/core'),
            skills: path.resolve(__dirname, 'src/skills'),
            middleware: path.resolve(__dirname, 'src/middleware'),
        },
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, 'src'),
                ],
                loader: 'babel-loader',
            }
        ],
    }
};

module.exports = config;