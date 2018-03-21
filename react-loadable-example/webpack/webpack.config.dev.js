'use strict'

const Webpack = require('webpack')

module.exports = {
  output: {
    filename: 'bundle.js',
    chunkFilename: '[name].js'
  },
  plugins: [
    new Webpack.HotModuleReplacementPlugin(),
    new Webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    })
  ],
  devtool: 'source-map',
  devServer: {
    contentBase: './src',
    inline: true,
    hot: true,
    port: 8100,
    historyApiFallback: true
  }
}
