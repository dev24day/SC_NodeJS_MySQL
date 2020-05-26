var mysql = require('mysql');
var userinfo = require('../userinfo.js');

var db = mysql.createConnection({
	host: '',
	user: '',
	password: '',
	database: ''
});

db.connect();
module.exports = db;