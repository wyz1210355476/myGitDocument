var express = require("express");

/**
//cookie
var cookieParser = require("cookie-parser");

var app = express();

app.use(cookieParser())

app.get("/",function(req,res){
	if(req.cookies.isVisit){
		console.log(req.cookies);
		res.send("欢迎再次访问");
	}else{
		res.cookie("isVisit",1,{maxAge:60*1000});
		res.send("欢迎访问");
	}
})

app.listen(3000)
*/

//session

var session = require("express-session")

var app = express();
app.listen(3000);
app.use(session({
	secret:"recommand 128 bytes random string",
	cookie:{maxAge:60*1000}
}))

app.get("/",function(req,res){
	if(req.session.isVisit){
		req.session.isVisit++;
		res.send("<p>第" + req.session.isVisit + "次来此页面");
	}else{
		req.session.isVisit = 1;
		res.send("第一次来此页面");
		console.log(req.session.cookie);
		console.log(req.cookie)
	}
})