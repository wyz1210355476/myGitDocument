var express = require('express');
var utility = require('utility');

var app = express();

app.get('/',function(req,res){
	console.log(req)
	var q = req.query.q;
	var md5Value = utility.sha1(q);
	res.send(md5Value);
});

app.listen(3000,function(){
	console.log('success');
})