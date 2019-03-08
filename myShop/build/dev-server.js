require('./check-versions')();

var config = require('../config');
if(!process.env.NODE_ENV){
    process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV);
}

var opn = require('opn');//一个跨平台的node-open库，打开像网站、文件、可执行文件之类的功能
/** 
  例子：
    var opn = require('opn');

    opn('www.baidu.com'); // 使用默认浏览器打开网页

    opn('www.baidu.com',{app:'chrome'}); // 使用指定浏览器打开网页 chrome firefox

    API：
    opn(target,[options])

    target: [type string] 

                你想要打开的东西。可以是一个URL、文件或可执行文件。

                在文件类型的默认应用程序中打开。例如，url在默认浏览器中打开。

                 例子：opn("E:\\Foxmail.exe"); 

     wait：[type boolean]

              true：等待打开的应用就绪后，退出，false：应用打开时立即退出

     app：[type string array] 

              打开对象的应用名，和启动应用相关的参数

              opn('www.baidu.com',{app:'chrome'}); 

              opn('www.baidu.com',{app:['chrome','--incognito']}); 
*/
var path = require('path');
var express = require('express');
var webpack = require("webpack");
var proxyMiddleware = require('http-proxy-middleware');//用于把请求代理转发到其他服务器的中间件。
/**
 * 例如：我们当前主机为http://localhost:3000/，现在我们有一个需求，如果我们请求/api，我们不希望由3000来处理这个请求，而希望由另一台服务器来处理这个请求
 */
var webpackConfig = require('./webpack.dev.conf')
