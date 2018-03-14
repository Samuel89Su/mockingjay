'use strict'

const Webpack = require('webpack')
const Path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CleanPlugin = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
    output: {
        filename: 'asserts/bundle_[hash].js',
        publicPath: '/'
	},
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
        new CleanPlugin(['index.html', 'asserts/*.*'], {
            // exclude: ['images'],
            root: Path.resolve(__dirname, '../dist/')
        }),
        new CopyPlugin([
        ]),
        new Webpack.optimize.OccurrenceOrderPlugin(),
        new Webpack.optimize.UglifyJsPlugin(),
        new ExtractTextPlugin('asserts/style_[contenthash:8].css'),
        new Webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new Webpack.NoEmitOnErrorsPlugin()
    ],
    devtool: 'source-map'
}
