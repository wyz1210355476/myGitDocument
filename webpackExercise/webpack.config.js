const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlwebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
	mode:'none',
	entry:{
		app:'./src/index.js',
		print:'./src/print.js'
	},
	output:{
		filename:'[name].[hash].bundle.js',
		path:path.resolve(__dirname,'dist'),
		chunkFilename:'[name].[chunkhash].js'
	},
	optimization:{
		splitChunks:{
			chunks:'all',
			cacheGroups:{
				default:{//在两个以上入口文件时，入口文件共享同一个文件时，对共享的文件进行单独打包处理
					name:'common',
					minChunks: 2,
					priority: -20,
					reuseExistingChunk: true,
				},
				vendors: {//将node_modules中的代码放入vendor.js中
					name:'vendor',
					test: /[\\/]node_modules[\\/]/,
					priority: -10
				}
			}
		},
		runtimeChunk:{
			name:'manifest'
		}
	},
	plugins:[
		new CleanWebpackPlugin(['dist']),
		new HtmlwebpackPlugin({
			title:'test',
			template:'./index.html'
		})
	]
}