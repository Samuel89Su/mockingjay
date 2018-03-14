'use strict'

const Webpack = require('webpack')
const Path = require('path')
const CleanPlugin = require('clean-webpack-plugin')

module.exports = {
    output: {
        filename: 'asserts/bundle_[hash].js',
        publicPath: './',
        chunkFilename: 'asserts/[name].bundle.js'
	},
    plugins: [
        new CleanPlugin(['index.html', 'asserts/*.*'], {
            root: Path.resolve(__dirname, '../dist/')
        }),
        new Webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new Webpack.NoEmitOnErrorsPlugin()
        // , new Webpack.optimize.CommonsChunkPlugin({
        //     name: 'common'
        // })
    ],
    devtool: 'source-map'
}
