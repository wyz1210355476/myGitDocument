var express = require("express");
var app = express();
var fs = require("fs");
var rs = fs.readFileSync("jquery.js");
app.get("/",function(req,res){
	res.send(rs);
})

app.listen(3000,function(){
	console.log("success")
})

// var rs = fs.createReadStream("jquery.js");

// rs.on("data",function(context){
// 	var bin = new Buffer(context);
// 	var str = bin.toString("utf-8");
// 	console.log(str);
// })

// rs.on("end",function(){
// 	console.log("2");
// })
// var context = fs.readFileSync("data.json");

// var bin = new Buffer(context);

// var str = bin.toString("utf-8");
// console.log(str);
// console.log(fs.chmod("jquery.js"))
// var rs = fs.createReadStream("jquery.js");
// var ws = fs.createWriteStream("jqueryCopy.js");

// rs.on("data",function(chunk){
// 	ws.write(chunk);
// })

// rs.on("end",function(){
// 	ws.end();
// })