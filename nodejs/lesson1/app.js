var express = require('express');
var app = express();
// process.env.node_env = 'product'
console.log(process.env)
app.get('/',function(req,res){
	res.send("hello world");
});
app.listen(3000,function(){
	console.log('app is listening at port 3000')
})