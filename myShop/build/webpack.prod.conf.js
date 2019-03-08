var path = require('path');
var utils = require('./utils');
var webpack = require('webpack');
var config = require('../config');
var merge = require('webpack-merge');
var baseWebpackConfig = require('./webpack.base.conf');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');

// 获取当前的环境
var env = process.env.NODE_ENV === 'testing'
	? require('../config/test.env')
	: config.build.env

// 合并基础和生产环境的配置
var webpackConfig = merge(baseWebpackConfig,{
	module: {
		rules: utils.styleLoaders({
			sourceMap: config.build.productionSourceMap,
			extract: true
		})
	},
	devtool: config.build.productionSourceMap ? '#source-map' : false,
	output: {
		path: config.build.assetsRoot,
		filename: utils.assetsPath('js/[name].[chunkhash].js'),//入口文件代码，node_modules中的代码，manifest代码
		chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')//符合条件的需要单独打包的代码或者需要懒加载的代码木块
	},
	plugins: [
		new webpack.DefinePlugin({//设置全局变量
			'process.env': env
		}),
		new webpack.optimize.UglifyJsplugin({//压缩js，不能压缩ES6语法
			compress: {
				warnings: false
			},
			sourceMap: true
		}),
		new ExtractTextPlugin({//提取css为单独的文件
			filename: utils.assetsPath('css/[name].[contenthash].css')
		}),
		new OptimizeCSSPlugin({//压缩css文件
			cssProcessorOptions: {//传递给css预处理器的选项，可以通过cssProcessorOptions.cssProcessor = require('cssnano')，引入cssnano压缩
				safe: true
			}
		}),
		new HtmlWebpackPlugin({
			filename: process.env.NODE_ENV === 'testing'//输出的文件名
				? 'index.html'
				: config.build.index,
				template: 'index.html',//生成的文件所依赖哪一个html文件模板，模板类型可以是html、jade、ejs等。但是要注意的是，如果想使用自定义的模板文件的时候，需要安装对应的loader
				/**
					inject有四个值： true body head false
					true 默认值，script标签位于html文件的 body 底部
					body script标签位于html文件的 body 底部
					head script标签位于html文件的 head中
					false 不插入生成的js文件，这个几乎不会用到的
				*/ 
				inject: true,
				/**
					使用minify会对生成的html文件进行压缩。默认是false
				*/ 
				minify: {
					removeComments: true,
					collapseWhitespace: true,
					removeAttributeQuotes: true
				},
				/**
					script的顺序，默认四个选项： none auto dependency {function}

					'dependency' 不用说，按照不同文件的依赖关系来排序。

					'auto' 默认值，插件的内置的排序方式，具体顺序....

					'none' 无序？

					{function} 提供一个函数？
				*/ 
				chunksSortMode: 'dependency'
		}),
		/**
			NamedModulesPlugin 
			这个模块可以将依赖模块的正整数 ID 替换为相对路径（如：将 4 替换为 ./node_modules/es6-promise/dist/es6-promise.js）。

			开发模式，它可以让 webpack-dev-server 和 HMR 进行热更新时在控制台输出模块名字而不是纯数字；
			生产构建环境，它可以避免因修改内容导致的 ID 变化，从而实现持久化缓存。
			但是有两个缺点：

			递增 ID 替换为模块相对路径，构建出来的 chunk 会充满各种路径，使文件增大；
			模块（npm 和自己的模块）路径会泄露，可能导致安全问题。
			
			HashedModuleIdsPlugin 
			这是 NamedModulesPlugin 的进阶模块，它在其基础上对模块路径进行 MD5 摘要，不仅可以实现持久化缓存，同时还避免了它引起的两个问题（文件增大，路径泄露）。用 HashedModuleIdsPlugin 可以轻松地实现 chunkhash 的稳定化！

			不过这个插件只被添加到了 webpack 2 中，可能是因为 webpack 2 正式版还没有发布，HashedModuleIdsPlugin 一直没有文档，所以这里有必要指明如何使用：

			new webpack.HashedModuleIdsPlugin()
			如果使用了 HashedModuleIdsPlugin，NamedModulesPlugin 就不要再添加了。
		*/ 
		new webpack.HashedModuleIdsPlugin(),
		/**
		CommonsChunkPlugin:
			https://segmentfault.com/q/1010000009070061
			https://segmentfault.com/a/1190000012828879#articleHeader0
		*/ 
		new webpack.optimize.CommonsChunkPlugin({//提取node_modules中的js公共库和webpack运行时的js合并到vendor.js中
			name: 'vendor',//可以是已经存在的chunk（一般指入口文件）对应的name，那么就会把公共模块代码合并到这个chunk上；否则，会创建名字为name的commons chunk进行合并
			minChunks: function (module, count) {
			        return (
			        	module.resource &&
			        	/\.js$/.test(module.resource) &&
			        	module.resource.indexOf(
			        		path.join(__dirname, '../node_modules')
			        		) === 0
			        	)
			    }
			}),
		    new webpack.optimize.CommonsChunkPlugin({//从vendor.js中提取出webpack运行时的js文件到manifest.js中
		    	name: 'manifest',
		    	chunks: ['vendor']//指定source chunk，即指定从哪些chunk当中去找公共模块，省略该选项的时候，默认就是entry chunks
		    }),
		    new CopyWebpackPlugin([//将静态资源复制到指定的目录下
		    		{
		    			from: path.resovel(__dirname,'../static'),
		    			to: config.build.assetsSubDirectory,
		    			ignore: ['.*']
		    		}
		    	])
	]
})

if(config.build.productionGzip){
	/**
		将指定资源压缩
		http://www.css88.com/doc/webpack2/plugins/compression-webpack-plugin/
	*/ 
	var CompressionWebpackPlugin = require('compression-webpack-plugin');

	webpackConfig.plugins.push(
		new CompressionWebpackPlugin({
			asset: '[path].gz[query]',
			algorithm: 'gzip',
			test: new RegExp(
				'\\.(' +
				config.build.productionGzipExtensions.jion('|') +
				')$'
			),
			threshold: 10240,
			minRatio: 0.8
		})
	)
}

if(config.build.bundleAnalyzerReport){
	
}