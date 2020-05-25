var mysql = require('mysql');
var userinfo = require('../userinfo.js');

var db = mysql.createConnection({
	host: 'localhost',
	user: userinfo.user,
	password: userinfo.password,
	database: 'opentutorials'
});

db.connect();
module.exports = db;