'use strict';

const Path = require('path');
const Merge = require('webpack-merge');

const base = {
	entry: __dirname + '/src/index.js',
	output: {
		path: Path.resolve(__dirname, 'dist'),
		// filename: 'bundle_[hash].js'
	},
	module: {
		rules: [
            {
            	enforce: 'pre',
              test: /\.(js|jsx)$/,
				      exclude: /node_modules/,
              use: 'eslint-loader'
            },{
              test: /\.(js|jsx)$/,
              exclude: /node_modules/,
              use: 'babel-loader'
            }, {
              test: /\.(png|jpg|woff|woff2|eot|ttf|svg)$/,
              use: [
					      {
						      loader: 'url-loader',
						      options: {
							      limit: 8192
						      }
					      }
				      ]
			      }
    ]
	}
};

module.exports = function buildConfig(env, argv) {
    let envConfig = require('./cfg/webpack.config.' + env + '.js');
    return Merge(base, envConfig);
};
