var chalk = require('chalk');//控制文字颜色
var fs = require('fs');
// 复制文件的公共方法
function copyFile(fromRouter,makeFolder,toRouter,callBack){
    /**
     *fromRouter 需要复制的文件路径
      makeFolder 需要创建的文件路径
      toRouter   需要将文件复制到的路径*/ 
    fs.readFile(fromRouter,function(err,data){
        if(err){
            return console.log(chalk.red(err));
        }

        fs.mkdir(makeFolder,{ recursive: true },function(err){
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

exports.copyFile = copyFile;