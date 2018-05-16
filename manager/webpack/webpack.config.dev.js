'use strict'

const Path = require('path')
const Webpack = require('webpack')
const express = require('express')

module.exports = {
  output: {
    filename: 'bundle.js',
    chunkFilename: '[name].js',
    path: Path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  module: {
    rules: [{
      test: /\.(css|scss)$/,
      use: [{
        loader: 'style-loader'
      }, {
        loader: 'css-loader'
      }, {
        loader: 'postcss-loader'
      }, {
        loader: 'sass-loader'
      }]
    }]
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
    host: '127.0.0.1',
    port: 8100,
    historyApiFallback: true,
    after: function (app) {
      require('../proxy')(app, 8100)
    }
    // proxy: [{
    //   context: ['/inventory','/admin'],
    //   target: 'http://139.196.103.143'
    // }]
  }
}
