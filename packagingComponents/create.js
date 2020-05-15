var chileProcess = require('child_process');
var shell = require('shelljs');
var path = require('path');
var fs = require('fs');
var chalk = require('chalk');//控制文字颜色
var copyFile = require('./public').copyFile;
var config = require('./config');

// var curDirectory = path.resolve();
// // 先pull git文件后在派发文件
// shell.cd(config.pcParam.rootDirectory);
// shell.exec('git pull');
// shell.cd(curDirectory);

// 生成代码文件并复制到git工作目录中
if(config.pcParam.createNames && config.pcParam.createNames.length > 0){
    generateFiles(config.pcParam);
}

if(config.moParam.names && config.moParam.names.length > 0){
    generateFiles(config.moParam);
}


// 生成文件
function generateFiles(obj) { 

    var filesAry = fs.readdirSync(path.resolve('template'));//获取模板文件名

    obj.createNames.forEach(function(_name){
        let fileName = `${_name}-01`;
        var baseViewPath = _name.replace("Res","").split("_")[0];//html片段的文件夹名
        let viewPath = `${baseViewPath}/${fileName}`;//properties文件需要替换的变量{{viewPath}}

        let makeRouter = `${obj.outRoute}c_${_name}-01001`;

        fs.mkdirSync(`${makeRouter}//img`, { recursive: true });//创建生成文件的文件路径
        
        let createdFiles = fs.readdirSync(makeRouter)// 获取已生成文件名，用于判断只有未生成的文件才会新生成
        filesAry.forEach(function (file,index) { //遍历模板文件并生成新文件

            let createFileName = file.replace("name",_name);

            if(/^[\s\S]+\..+$/.test(createFileName)){//非文件夹时
                // 读取模板文件并做变量替换
                let fileCon = fs.readFileSync(path.resolve(`template/${file}`))
                            .toString()
                            .replace(/{{parentScope}}/g,`c_${_name}-01001`)
                            .replace(/{{viewPath}}/g,viewPath);
                
                
                if(!createdFiles.includes(createFileName)){//未生成的文件才会生成新文件
                    fs.writeFileSync(`${makeRouter}//${createFileName}`,fileCon);//通过模板文件创建新文件
                }
            }

            // 将创建的文件复制到git工作目录中
            if(/^c_[\s\S]+[(\.css)(\.html)(\.properties)]$/.test(createFileName)){//静态资源
                copyFile(`${makeRouter}//${createFileName}`,`${obj.staticRoute}${_name}//01001//img`,`${obj.staticRoute}${_name}//01001//${createFileName}`);
            }

            if(/^c_[\s\S]+\.json$/.test(createFileName)){//json面板配置文件
                copyFile(`${makeRouter}//${createFileName}`,obj.jsonRoute,`${obj.jsonRoute}//${createFileName}`);
            }

            if(/^[\s\S]+\.js$/.test(createFileName)){//js文件
                copyFile(`${makeRouter}//${createFileName}`,`${obj.jsRoute}//${baseViewPath}`,`${obj.jsRoute}//${baseViewPath}//${createFileName}`);
            }

            if(/^[^(c_)][\s\S]+\.html$/.test(createFileName)){//html文件
                copyFile(`${makeRouter}//${createFileName}`,`${obj.htmlRoute}//${baseViewPath}`,`${obj.htmlRoute}//${baseViewPath}//${createFileName}`);
            }

            if(/^[^(c_)][\s\S]+\.xml$/.test(createFileName)){//xml文件
                copyFile(`${makeRouter}//${createFileName}`,`${obj.xmlRoute}`,`${obj.xmlRoute}//${createFileName}`);
            }

            // 复制图片
            if(/^img$/.test(createFileName)){//xml文件
                fs.readdir(`${makeRouter}\\img`,function(err,imgFiles){
                    if(err){
                        return console.log(chalk.red(err));
                    }

                    imgFiles.forEach(function(imgFile){
                        fs.readFile(`${makeRouter}\\img\\${imgFile}`,function(err,data){
                            if (err) {
                                return console.log(chalk.red(err));
                            }

                            fs.writeFile(`${obj.staticRoute}${_name}//01001//${createFileName}//${imgFile}`,data,function(err){
                                if(err){
                                    console.log(chalk.red(err))
                                }
                            })
                        })
                    })
                })						
            }   
            
        });
        shell.exec('gulp jsmin',process.env.buildRouter = `${obj.outRoute}c_${_name}`);//对js进行压缩
    })
}

// 进程结束后，从新开一个进程进行压缩
process.on("exit",function(){
	var rootDirectory = JSON.stringify({
		pc:config.pcParam.outRoute,
		mo:config.moParam.outRoute
	})
	shell.exec("node compress", process.env.rootDirectory = rootDirectory)
})