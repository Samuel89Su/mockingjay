'use strict';

const Webpack = require('webpack');

module.exports = {
  output: {
    filename: 'bundle.js'
  },
  module: {
    rules: [{
      test: /\.(css|scss)$/,
      use: [{
        loader: 'style-loader'
      }, {
        loader: 'css-loader',
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
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './src',
    inline: true,
    hot: true,
    port: 8100,
    historyApiFallback: true,
    proxy:
      // {
      // '/inventory': {
      //     target: 'http://localhost:3000',
      //     // pathRewrite: { '^/api':'/inventory' }
      // }
      [{
        context: [
          '**', '!/', '!**/index.html','!**/bundle.js'
        ],
        target: 'http://localhost:3000',
        router: {
          '/inventory': 'http://localhost:3000',
          '/jquery.min.js': 'http://localhost:3100'
        }
      }
    //   ,
    //   {
    //       context: ['**', '!**/', '!**/bundle.js'],
    //       target: 'http://localhost:3000',
    //       router: {

    //       }
    //   }
    ]
  }
};
