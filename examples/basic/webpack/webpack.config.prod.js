'use strict'

const Path = require('path')
const Webpack = require('webpack')
const CleanPlugin = require('clean-webpack-plugin')

module.exports = {
    output: {
      filename: 'asserts/bundle_[hash].js',
      chunkFilename: 'asserts/[name]_[hash].js'
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
    ],
    devtool: 'source-map'
}
