var mysql      = require('mysql');
var userinfo = require('../userinfo.js');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : userinfo.user,
  password : userinfo.password,
  database : 'opentutorials'
});

connection.connect();
 
connection.query('SELECT * FROM topic', function (error, results, fields) {
  if (error) throw error;
  console.log(results);
});
 
connection.end();