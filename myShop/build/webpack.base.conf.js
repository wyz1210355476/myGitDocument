var path = require('path');
var utils = require('./utils');
var config = require('../config');
var vueLoaderConfig = require('./vue-loader.conf');

function resolve(dir){//解析为当前路径的上一级路径
	return path.join(__dirname,'..',dir)
}

module.exports = {
	entry: {
		app: './src/main.js'
	},
	output: {
		/**
			JS 资源的 [chunkhash] 由 webpack 计算，Images/Fonts 的 [hash] 由 webpack/file-loader 计算，
			提取的 CSS 的 [contenthash] 由 webpack/extract-text-webpack-plugin 计算。避免冗杂，这里只写
			出了部分 webpack 2 配置：
			// production
			output: {  
			  filename: '[name].[chunkhash:8].bundle.js',
			  chunkFilename: '[name].[chunkhash:8].js'
			},
			module: {  
			  rules: [{
			    test: /\.(jpe?g|png|gif|svg)$/i,
			    loader: 'url-loader',
			    options: {
			      limit: 1000,
			      name: 'assets/imgs/[name].[hash:8].[ext]'
			    }
			  }, {
			    test: /\.(woff2?|eot|ttf|otf)$/i,
			    loader: 'url-loader',
			    options: {
			      limit: 10000,
			      name: 'assets/fonts/[name].[hash:8].[ext]'
			    }
			  }]
			},
			plugins: [  
			  new ExtractTextPlugin('[name].[contenthash:8].css')
			]
			注：不要在开发环境使用 [chunkhash]/[hash]/[contenthash]，因为不需要在开发环境做持久缓存，而且这样会增加编译时间，开发环境用 [name] 就可以了。
		*/ 
		path: config.build.assetsRoot,
		filename: '[name].js',
		publicPath: process.env.NODE_ENV === 'production'
			? config.build.assetsPublicPath
			: config.dev.assetsPublicPaht
	},
	resolve: {
		extensions: ['.js', '.vue', '.json'],//扩展路径文件类型，用户在引用时不用写扩展
		alias: {//引用别名
			'vue$': 'vue/dist/vue.esm.js',
			'@': resplve('src')
		}
	},
	module: {
		rules: [
			{
				test: /\.(js|vue)$/,
				loader: 'eslint-loader',//若要支持ESLint js规则静态检查工具，就要安装配置eslint-loader
				enforce:'pre',//在babel-loader对源码进行编译前进行lint的检查
				include: [resolve('src'), resolve('test')],//指定需要静态检查的目录
				options: {
					formatter: require('eslint-friendly-formatter')//编译后错误报告模式
				}
			},
			{
				test: /\.vue$/,
				loader: 'vue-loader',//解析.vue类型的文件，提取每个语言块，如有必要会通过其它 loader 处理，最后将他们组装成一个 CommonJS 模块，module.exports 出一个 Vue.js 组件对象。
				options:vueLoaderConfig//配置vue-loader所使用的其他loader，覆盖默认内置loader配置
			},
			{
				test: /\.js$/,
				loader: 'bable-loader',
				include: [resolve('src'), resolve('test')]//指定需要进行转译ES6目录
			},
			/**
				file-loader:webpack会将各个模块打包成一个文件，因此我们样式中的url路径是相对入口html页面的，而不是相对于原始css文件所在的路径的。
				这就会导致图片引入失败。这个问题是用file-loader解决的，file-loader可以解析项目中的url引入（不仅限于css），根据我们的配置，将图片拷贝到
				相应的路径，再根据我们的配置，修改打包后文件引用路径，使之指向正确的文件。

				url-loader:如果图片较多，会发很多http请求，会降低页面性能。这个问题可以通过url-loader解决。url-loader会将引入的图片编码，生成dataURl。
				相当于把图片数据翻译成一串字符。再把这串字符打包到文件中，最终只需要引入这个文件就能访问图片了。当然，如果图片较大，编码会消耗性能。
				因此url-loader提供了一个limit参数，小于limit字节的文件会被转为DataURl，大于limit的还会使用file-loader进行copy。

				url-loader和file-loader的关系：url-loader封装了file-loader。url-loader不依赖于file-loader，即使用url-loader时，只需要安装url-loader即可，
				不需要安装file-loader，因为url-loader内置了file-loader
			*/ 
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: utils.assetsPath('img/[name].[hash:7].[ext]')
				}
			},
			{
				test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: utils.assetsPath('media/[name].[hash:7].[ext]')
				}
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
				}
			}
		]
	}
}