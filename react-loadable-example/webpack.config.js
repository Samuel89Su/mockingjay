'use strict'

const Path = require('path')
const Merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanPlugin = require('clean-webpack-plugin')

const base = {
  entry: './src/index.js',
  output: {
    path: Path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      options: {
        babelrc: false,
        presets: ['react'],
        plugins: ['syntax-dynamic-import']
      }
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      inject: true,
      filename: 'index.html'
    }),
  ]
}

module.exports = function buildConfig(env) {
  let envConfig = require('./webpack/webpack.config.' + env + '.js')
  return Merge(base, envConfig)
}