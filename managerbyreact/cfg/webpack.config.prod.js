'use strict';

const Webpack = require('webpack');
const Path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    module: {
        rules: [
            {
                test: /\.(css|scss)$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'postcss-loader', 'sass-loader']
                })
            }
        ]
    },
    plugins: [
        new CleanPlugin(['index.html', 'bundle.js', 'style.css'], {
            exclude: ['images'],
            root: Path.resolve(__dirname, '../dist/')
        }),
        new CopyPlugin([
            { from: 'src/images', to: 'images' }
        ]),
        new Webpack.optimize.OccurrenceOrderPlugin(),
        new Webpack.optimize.UglifyJsPlugin(),
        new ExtractTextPlugin('style.css'),
        new HtmlWebpackPlugin({
            template: 'public/index.html',
            inject: true,
            filename: 'index.html'
        }),
        new Webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new Webpack.NoEmitOnErrorsPlugin()
    ],
    devtool: 'source-map'
};
