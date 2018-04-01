'use strict'

const Path = require('path')
const Merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const base = {
  entry: {
    bundle: __dirname + '/src/index.js'
  },
  output: {
    path: Path.resolve(__dirname, 'dist')
    //,publicPath: '/'
  },
  module: {
    rules: [{
      enforce: 'pre',
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: 'eslint-loader'
    }, {
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: 'babel-loader'
    }, {
      test: /\.(png|jpg|woff|woff2|eot|ttf|svg)$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 8192
        }
      }]
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      inject: true,
      filename: 'index.html'
    })
  ]
}

module.exports = function buildConfig(env) {
  let envConfig = require('./webpack/webpack.config.' + env + '.js')
  return Merge(base, envConfig)
}
