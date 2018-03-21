'use strict'

const Webpack = require('webpack')
const Path = require('path')
const CleanPlugin = require('clean-webpack-plugin')

module.exports = {
    output: {
        filename: 'asserts/bundle_[hash].js',
        chunkFilename: 'asserts/[name]_[hash].js',
        publicPath: './'
	},
    module: {
        rules: [
            {
                test: /\.(css)$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader']
                })
            }
        ]
    },
    plugins: [
        new CleanPlugin(['index.html', 'asserts/*.*'], {
            root: Path.resolve(__dirname, '../dist/')
        }),
        new Webpack.optimize.OccurrenceOrderPlugin(),
        new Webpack.optimize.UglifyJsPlugin(),
        new ExtractTextPlugin('asserts/style_[contenthash:8].css'),
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
