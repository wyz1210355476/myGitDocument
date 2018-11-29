const merge = require('webpack-merge');
const common = require('./webpack.common.js');
console.log(process.env.NODE_ENV);
module.exports = merge(common,{
	devtool:'inline-source-map',
	module:{
		rules:[
			{
				test:/\.css$/,
				use:[
				'style-loader',
				'css-loader'
				]
			}
		]
	},
	devServer:{
		contentBase:'./dist'
	}
});