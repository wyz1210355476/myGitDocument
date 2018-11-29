const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
var CopyWebpackPlugin = require('copy-webpack-plugin');
console.log(process.env.NODE_ENV);
  module.exports = {
  	mode:"none",
    entry:{
    	polyfills:'./src/polyfills.js',
    	index: './src/index.js'
    },
    output: {
      filename: '[name].[chunkhash].js',
      path: path.resolve(__dirname, 'dist'),
      publicPath:'./',
      chunkFilename:'my/[name].[chunkhash].js'
    },
   module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      }
    ]
   },
	plugins:[
		new CleanWebpackPlugin(['dist/my']),
		new HtmlWebpackPlugin({
			title:'Caching',
			template:'index.html'
		}),
		new ExtractTextPlugin("css/[name].[chunkhash].css"),
		new webpack.ProvidePlugin({
			_:'lodash'
		}),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, './static'),
        to: 'my',
        ignore: ['.*']
      }
    ])
	]
  };