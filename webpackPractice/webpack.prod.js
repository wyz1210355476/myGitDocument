const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = merge(common,{
	devtool:'source-map',
	module:{
		rules:[
			{
				test:/\.css$/,
				use:ExtractTextPlugin.extract({
					fallback:"style-loader",
					use:"css-loader"
				})
			}
		]
	},
	plugins:[
		new UglifyJSPlugin({
			sourceMap: true
		}),
		new ExtractTextPlugin("[name].[chunkhash:8].css")
	]
});