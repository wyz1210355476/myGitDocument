const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
process.env.NODE_ENV = "dev";
module.exports = {
	entry:{
		app:'./src/index.js',
		test:'./src/print.js'
	},
	plugins:[
		new CleanWebpackPlugin(['dist']),
		new HtmlWebpackPlugin({
			title:'Production'
		})
	],
	output:{
		filename:'[name].bundle.js',
		path:path.resolve(__dirname,'dist')
	}
}