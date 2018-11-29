var chileProcess = require('child_process');
var shell = require('shelljs');
var path = require('path');
var fs = require('fs');
var chalk = require('chalk');//控制文字颜色

var pcNames = ['xibmallaccount_safety','xibmallgoods_detail','xibmallgoods_list','xibmallgoods_related','xibmallgoods_search','xibmallgoods_showcase','xibmallmembers_centeraddressbook','xibmallmembers_findpassword','xibmallmembers_index','xibmallmembers_info','xibmallmembers_loginbutton','xibmallmembers_profit','xibmallorder_checkout','xibmallorder_detail','xibmallorder_myorder','xibmallorder_pay','xibmallordercart_mycart','xibmallordercart_showmini','xmembers_login','xmembers_register']
// var pcNames = ['xibmallorder_checkout','xibmallgoods_detail']
// var moNames = ['xibmallorder_checkout','xibmallgoods_detail'];
var moNames = ['xibmallaccount_safety','xibmallgoods_detail','xibmallgoods_list','xibmallgoods_search','xibmallgoods_showcase','xibmallmembers_centeraddressbook','xibmallmembers_findpassword','xibmallmembers_index','xibmallmembers_info','xibmallmembers_profit','xibmallorder_checkout','xibmallorder_detail','xibmallorder_myorder','xibmallordercart_mycart','xmembers_login','xmembers_register']
// pc
var pcParam = {
		pcNames:pcNames,
		jsRoute:"D:\\shop\\shop_web\\design\\NewPro\\srv\\public\\js\\",
		htmlRoute:"D:\\shop\\shop_web\\design\\NewPro\\srv\\private\\views\\pc\\",
		jsonRoute:"D:\\shop\\shop_web\\design\\app-designer\\application\\designlib\\product\\pc\\panelConfig\\c\\",
		staticRoute:"D:\\shop\\shop_web\\design\\app-designer\\application\\designlib\\product\\pc\\c\\",
		outRoute:"D:\\dir\\pc\\c_",
		equipment:'pc'
	}
copy(pcParam);
// mo
var moParam = {
		pcNames:moNames,
		jsRoute:"D:\\shop\\shop_web\\design\\NewPro\\srv\\public\\m\\js\\",
		htmlRoute:"D:\\shop\\shop_web\\design\\NewPro\\srv\\private\\views\\mobile\\",
		jsonRoute:"D:\\shop\\shop_web\\design\\app-designer\\application\\designlib\\product\\mobile\\panelConfig\\c\\",
		staticRoute:"D:\\shop\\shop_web\\design\\app-designer\\application\\designlib\\product\\mobile\\c\\",
		outRoute:"D:\\dir\\mo\\c_",
		equipment:'mo'
	}
copy(moParam);
function copy(obj){
	// 生成输出文件的地址路径
	var folderAry = obj.outRoute.split("\\");
	fs.mkdir(folderAry[0]+"\\"+folderAry[1],function(err){
		if(err&&err.code !== "EEXIST"){
			return console.log(chalk.red(err));
		}
		fs.mkdir(folderAry[0]+"\\"+folderAry[1]+"\\"+folderAry[2],function(err){
			if(err&&err.code !== "EEXIST"){
				return console.log(chalk.red(err));
			}
			copying();	
		})
	})
	// 复制文件的公共方法
	function copyFile(fromRouter,makeFolder,toRouter,callBack){
		fs.readFile(fromRouter,function(err,data){
			if(err){
				return console.log(chalk.red(err));
			}

			fs.mkdir(makeFolder,function(err){
				if(err&&err.code !== "EEXIST"){
					return console.log(chalk.red(err));
				}
				fs.writeFile(toRouter,data.toString(),function(err){
					if(err){
						return console.log(chalk.red(err));
					}

					if(callBack){
						callBack();
					}
				})
			})	
		})
	}
	// 需要复制的内容
	function copying(){
		obj.pcNames.forEach(function(pcName){
			var folderName = pcName.split("_")[0] == "xmembers" ? "members" : pcName.split("_")[0];
			// 复制js文件
			var js_fileName = pcName.split("_")[0] == "xmembers" ? pcName+".js" : pcName+"-01.js";
			copyFile(obj.jsRoute+folderName+"\\"+js_fileName,obj.outRoute+pcName+"-01001",obj.outRoute+pcName+"-01001"+"\\"+js_fileName,function(){
				console.log(chalk.yellow(obj.equipment+"-"+pcName))
				shell.exec('gulp jsmin',process.env.folderName = pcName,process.env.equipment = obj.equipment);
			});

			// 复制组件html
			var html_fileName = pcName+"-01.html";
			copyFile(obj.htmlRoute+folderName+"\\"+html_fileName,obj.outRoute+pcName+"-01001",obj.outRoute+pcName+"-01001"+"\\"+html_fileName);
			
			//复制json文件
			var json_fileName = "c_"+pcName+"-01.json";
			copyFile(obj.jsonRoute+"c_"+pcName+"-01.json",obj.outRoute+pcName+"-01001",obj.outRoute+pcName+"-01001"+"\\"+json_fileName);
			
			// 复制app-designer里的静态内容
			var staticRoute = obj.staticRoute+pcName+"\\01001";
			fs.readdir(staticRoute,function(err,files){
				// console.log(files)
				if(err){
					return console.error(err);
				}
				fs.mkdir(obj.outRoute+pcName+"-01001",function(err){
					if(err&&err.code !== "EEXIST"){
						console.log("1111:"+pcName)
						return console.log(chalk.red(err))
					}
					files.forEach(function(file){
						if(file !== "img" && file !== ".idea" && file !== "image"){// 复制非图片文件
							fs.readFile(staticRoute+"\\"+file,function(err,data){
								if(err){
									return console.log(chalk.red(err));
								}

								fs.writeFile(obj.outRoute+pcName+"-01001"+"\\"+file,data.toString(),function(err){
									if(err){
										return console.log(chalk.red(err));
									}
								})
							})
						}else if(file === 'img'){// 复制图片
							fs.mkdir(obj.outRoute+pcName+"-01001"+"\\img",function(err){
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

											fs.writeFile(obj.outRoute+pcName+"-01001"+"\\"+file+"\\img"+imgFile,data,function(err){
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
		pc:pcParam.outRoute,
		mo:moParam.outRoute
	})
	shell.exec("node compress", process.env.rootDirectory = rootDirectory)
})