var archiver = require('archiver');
var fs = require("fs");
var chalk = require('chalk');//控制文字颜色

function getRoot(equipment){
	var rootDirectory = JSON.parse(process.env.rootDirectory);
	return rootDirectory[equipment].replace(/\\c_$/,"");
}

// pc
compress(getRoot("pc"));
// mo
compress(getRoot("mo"));

function compress(router){
	fs.readdir(router,function(err,files){
		if (err) {
			return console.log(chalk.red(err));
		}
		
		files.forEach(function(file){
			if(/.zip$/.test(file)){
				return;
			}
			var output = fs.createWriteStream(router+"\\"+file+".zip");
			var zipArchiver = archiver('zip',{
				zlib: { level: 9 }
			});
		
			output.on('close', function() {
			    // console.log('压缩完成');
			});
			zipArchiver.on('error', function(err) {
			    throw chalk.red(err);
			});
			zipArchiver.pipe(output);
			// 递归执行要压缩的文件
			recursion(router,file,zipArchiver)
			zipArchiver.directory(file+'/');
			zipArchiver.finalize();
		})
		
	})
	// 递归添加需要压缩的文件的方法
	function recursion(router,_file,zipArchiver){
		var files = fs.readdirSync(router+"\\"+_file);

		files.forEach(function(file){
			var extension = file.match(/\.[^\.]+$/);
			if(extension && extension[0] !== ".zip"){
				zipArchiver.append(fs.createReadStream(router+"\\"+_file+"\\"+file), { name: _file+"\\"+file})
			}else{
				recursion(router,_file+"\\"+file,zipArchiver)
			}
		})
	}
}