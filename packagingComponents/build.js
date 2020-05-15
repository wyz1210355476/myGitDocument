var chileProcess = require('child_process');
var shell = require('shelljs');
var path = require('path');
var fs = require('fs');
var chalk = require('chalk');//控制文字颜色
var copyFile = require('./public').copyFile;
var config = require('./config');
var curDirectory = path.resolve();
// 先pull git文件后在派发文件
shell.cd(config.pcParam.rootDirectory);
var msg = shell.exec('git pull');
// console.log("wei",msg);
shell.cd(curDirectory);

config.pcParam.outRoute = config.pcParam.outRoute + "c_";

config.moParam.outRoute = config.moParam.outRoute + "c_";

if(config.pcParam.names && config.pcParam.names.length > 0){
    copy(config.pcParam);
}

if(config.moParam.names && config.moParam.names.length > 0){
    copy(config.moParam);
}

function copy(obj){
	// 生成输出文件的地址路径
	var folderAry = obj.outRoute.split("\\");
	var routerFolder = obj.outRoute.replace('\c_','');
	fs.mkdir(routerFolder, { recursive: true },(err) => {
		if(err&&err.code !== "EEXIST"){
			return console.log(chalk.red(err));
		}
		copying();
	})
	// 复制文件的公共方法
	// function copyFile(fromRouter,makeFolder,toRouter,callBack){
	// 	fs.readFile(fromRouter,function(err,data){
	// 		if(err){
	// 			return console.log(chalk.red(err));
	// 		}

	// 		fs.mkdir(makeFolder,{ recursive: true },function(err){
	// 			if(err&&err.code !== "EEXIST"){
	// 				return console.log(chalk.red(err));
	// 			}
	// 			fs.writeFile(toRouter,data.toString(),function(err){
	// 				if(err){
	// 					return console.log(chalk.red(err));
	// 				}

	// 				if(callBack){
	// 					callBack();
	// 				}
	// 			})
	// 		})	
	// 	})
	// }
	// 需要复制的内容
	function copying(){
		obj.names.forEach(function(_name){
			var folderName = _name.split("_")[0] == "xmembers" ? "members" : _name.split("_")[0].replace("Res","");
			// 复制js文件
			var js_fileName = _name.split("_")[0] == "xmembers" ? _name+".js" : _name+"-01.js";
			copyFile(obj.jsRoute+folderName+"\\"+js_fileName,obj.outRoute+_name+"-01001",obj.outRoute+_name+"-01001"+"\\"+js_fileName,function(){
				console.log(chalk.yellow(obj.equipment+"-"+_name))
				shell.exec('gulp jsmin',process.env.buildRouter = obj.outRoute+_name);
			});

			// 复制组件html
			var html_fileName = _name+"-01.html";
			copyFile(obj.htmlRoute+folderName+"\\"+html_fileName,obj.outRoute+_name+"-01001",obj.outRoute+_name+"-01001"+"\\"+html_fileName);
			
			//复制json文件
			var json_fileName = "c_"+_name+"-01.json";
			copyFile(obj.jsonRoute+json_fileName,obj.outRoute+_name+"-01001",obj.outRoute+_name+"-01001"+"\\"+json_fileName);
			// 复制xml文件
			var xml_fileName = _name+".xml";
			copyFile(obj.xmlRoute+xml_fileName,obj.outRoute+_name+"-01001",obj.outRoute+_name+"-01001"+"\\"+xml_fileName);
			// 复制app-designer里的静态内容
			var staticRoute = obj.staticRoute+_name+"\\01001";
			fs.readdir(staticRoute,function(err,files){
				// console.log(files)
				if(err){
					return console.error(err);
				}
				fs.mkdir(obj.outRoute+_name+"-01001",{ recursive: true },function(err){
					if(err&&err.code !== "EEXIST"){
						console.log("1111:"+_name)
						return console.log(chalk.red(err))
					}
					files.forEach(function(file){
						if(file !== "img" && file !== ".idea" && file !== "image"){// 复制非图片文件
							fs.readFile(staticRoute+"\\"+file,function(err,data){
								if(err){
									return console.log(chalk.red(err));
								}

								fs.writeFile(obj.outRoute+_name+"-01001"+"\\"+file,data.toString(),function(err){
									if(err){
										return console.log(chalk.red(err));
									}
								})
							})
						}else if(file === 'img'){// 复制图片
							fs.mkdir(obj.outRoute+_name+"-01001"+"\\img",{ recursive: true },function(err){
								if(err&&err.code !== "EEXIST"){
									return console.log(chalk.red(err))
								}
								fs.readdir(staticRoute+"\\"+file,function(err,imgFiles){
									if(err){
										return console.log(chalk.red(err));
									}

									imgFiles.forEach(function(imgFile){
										fs.readFile(staticRoute+"\\"+file+"\\"+imgFile,function(err,data){
											if (err) {
												return console.log(chalk.red(err));
											}

											fs.writeFile(obj.outRoute+_name+"-01001"+"\\"+file+"\\"+imgFile,data,function(err){
												if(err){
													console.log(chalk.red(err))
												}
											})
										})
									})
								})
							})					
						}	
					})
				})			
			})
		})
	}
}

// 进程结束后，从新开一个进程进行压缩
process.on("exit",function(){
	var rootDirectory = JSON.stringify({
		pc:config.pcParam.outRoute,
		mo:config.moParam.outRoute
	})
	shell.exec("node compress", process.env.rootDirectory = rootDirectory)
})