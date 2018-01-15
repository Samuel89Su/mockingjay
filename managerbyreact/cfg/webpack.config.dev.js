'use strict';

const Webpack = require('webpack');

module.exports = {
    module: {
        rules: [
            {
                test: /\.(css|scss)$/,
                use: [
                  {
                    loader: 'style-loader'
                  }, {
                    loader: 'css-loader',
                  }, {
                    loader: 'postcss-loader'
                  }, {
                    loader: 'sass-loader'
                  }
                ]
            }
        ]
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
        historyApiFallback: true
    }
};
