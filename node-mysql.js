var mysql      = require('mysql');

var conn = mysql.createConnection({
  host     : 'localhost',
  port : '3307',
  user     : 'root',
  password : 'artnotbluff0',
  database : 'o2'
});
/*
var pool = mysql.createPool({
  connectionLimit : 10,
  host:'localhost',
  user:'root',
  password:'111111',
  database:'myapp'
});
*/
conn.connect();
/*
var sql="select * from topic";
conn.query(sql, function(err, rows, fields){
    if(err)
      console.log(err);
    else{
      for(var i=0;i<rows.length;i++)
        console.log(rows[i].title);
    }
});
*/
/*
var sql = "insert into topic (title, description, author) values(?,?,?)";
var params = ['super', 'wathch', 'grpahi'];
conn.query(sql, params, function(err, rows, fields){
  if(err){
    console.log(err);
  }
  else{
    console.log(rows);
  }
})

*/
/*
var sql = 'update topic set title=?, author=? where id=?';
var params = ['NPM', 'leeazhe', '1'];
conn.query(sql, params, function(err, rows, fields){
  if(err){
    console.log(err);
  }
  else{
    console.log(rows);
  }
})
*/
var sql = 'delete from topic where id=?';
var params = ['1'];
conn.query(sql, params, function(err, rows, fields){
  if(err){
    console.log(err);
  }
  else{
    console.log(rows);
  }
});



/*
connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});
*/
conn.end();
