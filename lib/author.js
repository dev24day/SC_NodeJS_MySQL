var template = require('./template.js');
var db = require("./db.js");

exports.index = function(request, response) {
	db.query("SELECT * FROM author", function(error, authors, fields) {
		if (error) throw error;
		var title = 'Authors';
		var authorTable = template.authorTable(authors, fields);
		var html = template.html(
			title,
			'',
			authorTable,
			`<a href="/create_author">Create</a>`
		);
		response.writeHead(200);
		response.end(html);
	});
};