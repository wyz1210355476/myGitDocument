var path = require('path');
var config = require('../config');
var ExtarctTextPlugin = require('extract-text-webpack-plugin');//提取css插件

// 选择存放静态资源路径策略
exports.assetsPath = function(_path){
	var assetsSubDirectory = process.env.NODE_ENV == 'production'
		? config.build.assetsSubDirectory
		: config.dev.assetsSubDirectory
	return path.posix.jion(assetsSubDirectory,_path)
}

// 使用css loader的策略
exports.cssLoaders = function(options){
	options = options || {}

	// 策略合并css-loader配置项
	var cssLoader = {
		loader: 'css-loader',
		options: {
			minimize: process.env.NODW_ENV === 'production',
			sourceMap: options.sourceMap
		}
	}

	//策略合并 .css 文件使用的loader的配置项方法
	function generateLoaders(loader,loaderOptions){
		var loaders = [cssLoader]
		if(loader){//还有其他loader时进行配置项合并
			loaders.push({
				loader:loader + '-loader',
				options:Object.assign({},loaderOptions,{
					sourceMap: options.sourceMap
				})
			})
		}

		if(options.extract){//需要提取css
			return ExtarctTextPlugin.extract({
				use:loaders,//指需要什么样的loader去编译文件
				fallback:'vue-style-loader'//编译后用什么loader来提取css文件
			})
		}else{//不需要提取css
			return ['vue-style-loader'].concat(loaders)
		}
	}
	// 返回策略loader配置对象
	return {
		css:generateLoaders(),//.css文件
		postcss:generateLoaders(),//postcss,为css添加作用域和浏览器兼容（还需要安装autoprefixer插件）前缀（即利用pcstcss为dom添加属性，进而使用属性选择器）
		less:generateLoaders('less'),//less
		sass:generateLoaders('sass',{ indentedSyntax: true }),//sass
		scss:generateLoaders('sass'),//scss
		stylus:generateLoaders('stylus'),//stylus
		styl:generateLoaders('stylus')//styl
	}
}

// 输出所有使用的loader
exports.styleLoaders = function (options){
	var output = [];
	var loaders = exports.cssLoaders(options);
	for(var extension in loaders){
		var loader = loaders[extension];
		output.push({
			test: new RegExp('\\.' + extension+'$'),
			use:loader
		})
	}
	return output;
}