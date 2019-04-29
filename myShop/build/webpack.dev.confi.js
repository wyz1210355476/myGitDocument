var utils = require('./utils');
var webpack = require('webpack');
var config = require('../config');
var merge = require('webpack-merge');
var baseWebpackConfig = require('./webpack.base.conf');
var htmlWebpackPlugin = require('html-webpack-plugin');
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');//一个用于处理打包这个进程的插件，可以清除打包时候残留的控制台信息，并且可以在控制台打印出打包成功之后的文字提示，当然，对于打包错误之后的回调也是有好好工作的

// 在入口添加热重载相关代码
Object.keys(baseWebpackConfig.entry).forEach(function(name){
    baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
});

module.exports = merge(baseWebpackConfig, {
    module:{
        rules:utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
    },
});