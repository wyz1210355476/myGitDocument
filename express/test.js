var mysql  = require('mysql');  
 
var connection = mysql.createConnection({     
  host     : 'localhost',       
  user     : 'root',              
  password : '123456',       
  port: '3306',                   
  database: 'nodetest' 
}); 
 
connection.connect();
 
var $sql = "CREATE TABLE runoob_tbl( "
"runoob_id INT NOT NULL AUTO_INCREMENT, "
"runoob_title VARCHAR(100) NOT NULL, "
"runoob_author VARCHAR(40) NOT NULL, "
"submission_date DATE, "
"PRIMARY KEY ( runoob_id ))ENGINE=InnoDB DEFAULT CHARSET=utf8; ";
// var modSqlParams = ['菜鸟移动站', 'https://m.runoob.com',6];
//改
connection.query($sql,function (err, result) {
   if(err){
         console.log('[UPDATE ERROR] - ',err.message);
         return;
   }        
  console.log('--------------------------UPDATE----------------------------');
  console.log('UPDATE affectedRows',"www");
  console.log('-----------------------------------------------------------------\n\n');
});
 
connection.end();