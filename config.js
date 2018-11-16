var path = require('path');
var fs = require("fs");
// console.log('resolve : ' + path.resolve('main.js'));
fs.readdir("D:\\packagingComponents",function(err,files){
	if(err){
		return console.error(err);
	}
	// console.log(files)
	files.forEach(function(file){
		fs.readFile(file,function(err,data){
			if(err){
				return console.log(err);
			}

			console.log(data.toString())
			fs.writeFile("D:\\dir\\input.js",data.toString(),function(err){
				if(err){
					return console.log(err);
				}

				console.log("文件写入成功")
			})
		})
	})
})