require('./check-versions')();

process.env.NODE_ENV = 'production';//设置为生产环境

var ora = require('ora');//loading效果
var rm = require('rimraf');//包形式包装的rm -rf命令，用来删除文件和文件夹
var path = require('path');//node path模块
console.log(__dirname)
var chalk = require('chalk');//控制文字颜色
var webpack = require('webpack');
var config = require('../config');
var webpackConfig = require('./webpack.prod.conf');

var spinner = ora('building for production...');
spinner.start();

rm(path.join(config.build.assetsRoot,config.build.assetsSubDirectory),err => {
	if(err) throw err
	webpack(webpackConfig,function(err,stats){
		spinner.stop()
		if(err) throw err
		process.stdout.write(stats.toString({
			colors:true,
			modules:false,
			children:false,
			chunks:false,
			chunkModules:false
		}) + '\n\n')

		if(stats.hasErrors()){
			console.log(chalk.red('  Build failed with errors.\n'))
			process.exit(1)
		}

		console.log(chalk.cyan('  Build complete.\n'))
		console.log(chalk.yellow(
			'  Tip: built files are meant to be served over an HTTP server.\n' +
      		'  Opening index.html over file:// won\'t work.\n'
		))
	})
})
