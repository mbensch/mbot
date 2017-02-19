const path = require('path');
const webpack = require('webpack');

const config = {
    entry: './src/index.js',
    output: {
        filename: 'bot.js',
        path: path.resolve(__dirname, 'bin'),
    },
    target: 'node',
    resolve: {
        modules: ["./node_modules"],
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
                exclude: /(node_modules)/,
                loader: 'babel-loader',
            }
        ],
    }
};

module.exports = config;