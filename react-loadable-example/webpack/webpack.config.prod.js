'use strict'

const Webpack = require('webpack')

module.exports = {
    output: {
      publicPath: './',
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
