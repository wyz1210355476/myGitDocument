var fs = require('fs');
fs.readFile('data.js', function (err,data) {
    if(err) return console.error(err);
    var requestData = "var data ="+JSON.stringify(JSON.parse(data)[86]);
    // console.log(JSON.stringify(requestData))
    fs.writeFile('newData.js',requestData,function(err){
    	if(err){
    		return console.log(err)
    	}
    	console.log("数据写入成功")
    })
});

console.log('Server running at http://127.0.0.1:8888');