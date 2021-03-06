'use strict'

const Path = require('path')
const Merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const base = {
	entry: {
		bundle: __dirname + '/src/index.js'
	},
	output: {
		path: Path.resolve(__dirname, 'dist'),
	},
	module: {
		rules: [{
			test: /\.(js|jsx)$/,
			exclude: /node_modules/,
			use: 'babel-loader'
		  }]
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'code splitting',
			template: 'public/index.html',
			inject: true,
			filename: 'index.html'
		}),
	]
}

module.exports = function buildConfig(env) {
	let envConfig = require('./webpackCfg/webpack.config.' + env + '.js')
	return Merge(base, envConfig)
}