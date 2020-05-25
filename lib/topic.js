var url = require('url');
var template = require('./template.js');
var sanitizeHtml = require('sanitize-html');
var path = require('path');
var db = require('./db.js');
var qs = require('querystring');

exports.index = function(request, response) {
	db.query('SELECT * FROM topic', function(error, topics, fields) {
		if (error) throw error;
		var title = 'Welcome';
		var description = 'Hello, People';
		var list = template.list(topics);
		var html = template.HTML(
			title,
			list,
			`<h2>${title}</h2>${description}`,
			`<a href="/create">create</a>`
		);
		response.writeHead(200);
		response.end(html);
	});
};
exports.page = function(request, response) {
	var _url = request.url;
	var queryData = url.parse(_url, true).query;
	db.query('SELECT * FROM topic', function(error, topics) {
		if (error) throw error;
		var filteredId = path.parse(queryData.id).base;
		db.query(
			`SELECT * FROM topic LEFT JOIN author on topic.author_id=author.id WHERE topic.id=?`,
			[filteredId],
			function(error2, result) {
				if (error2) throw error2;
				var sanitizedTitle = sanitizeHtml(result[0].title);
				var sanitizedDesc = sanitizeHtml(result[0].description, {
					allowedTags: ['h1']
				});
				var list = template.list(topics);
				var html = template.HTML(
					sanitizedTitle,
					list,
					`<h2>${sanitizedTitle}</h2>${sanitizedDesc}<p>by ${result[0].name}</p>`,
					`<a href="/create">create</a>
				  <a href="/update?id=${filteredId}">update</a>
				  <form action="/delete_process" method="post">
				  <input type="hidden" name="id" value="${filteredId}">
				  <input type="submit" value="delete">
				  </form>`
				);

				response.writeHead(200);
				response.end(html);
			}
		);
	});
};
exports.create = function(request, response) {
	db.query('SELECT * FROM topic', function(error, topics) {
		if (error) throw error;
		db.query('SELECT * FROM author', function(error2, authors) {
			if (error2) throw error2;
			var title = 'Web - create';
			var html = template.HTML(
				title,
				'',
				`
        <form action="/create_process" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p>
        <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
        ${template.author_combobox(authors)}
        </p>
        <p>
        <input type="submit">
        </p>
        </form>
        `,
				''
			);
			response.writeHead(200);
			response.end(html);
		});
	});
};
exports.create_process = function(request, response) {
	var body = '';
	request.on('data', function(data) {
		body = body + data;
	});
	request.on('end', function() {
		var post = qs.parse(body);
		db.query(
			`INSERT INTO topic (title, description, created, author_id) VALUES(?, ?, NOW(), ?)`,
			[post.title, post.description, post.author],
			function(err, result, fields) {
				if (err) throw err;
				response.writeHead(302, { Location: `/?id=${result.insertId}` });
				response.end();
			}
		);
	});
};
exports.update = function(request, response) {
	var _url = request.url;
	var queryData = url.parse(_url, true).query;
	db.query('SELECT * FROM topic', function(error, topics) {
		if (error) throw error;
		var filteredId = path.parse(queryData.id).base;
		db.query(`SELECT * FROM topic WHERE id=?`, [filteredId], function(error2, result) {
			if (error2) throw error2;
			db.query('SELECT * FROM author', function(error3, authors) {
				if (error3) throw error3;
				var sanitizedTitle = sanitizeHtml(result[0].title);
				var sanitizedDesc = sanitizeHtml(result[0].description, {
					allowedTags: ['h1']
				});
				var html = template.HTML(
					sanitizedTitle,
					'',
					`<form action="/update_process" method="post">
          <input type="hidden" name="id" value="${filteredId}">
          <p>
          <input type="text" name="title" placeholder="title" value="${sanitizedTitle}">
          </p>
          <p>
          <textarea name="description" placeholder="description">${sanitizedDesc}</textarea>
          </p>
          <p>
          ${template.author_combobox(authors, result[0].author_id)}
          </p>
          <p><input type="submit"></p>
          </form>`,
					''
				);
				response.writeHead(200);
				response.end(html);
			});
		});
	});
};
exports.update_process = function(request, response) {
	var body = '';
	request.on('data', function(data) {
		body = body + data;
	});
	request.on('end', function() {
		var post = qs.parse(body);
		db.query(
			`UPDATE topic SET title=?, description=?, author_id=? WHERE id=?`,
			[post.title, post.description, post.author, post.id],
			function(err, result) {
				response.writeHead(302, { Location: `/?id=${post.id}` });
				response.end();
			}
		);
	});
};
exports.delete_process = function(request, response) {
	var body = '';
	request.on('data', function(data) {
		body = body + data;
	});
	request.on('end', function() {
		var post = qs.parse(body);
		var id = post.id;
		var filteredId = path.parse(id).base;
		db.query(`DELETE FROM topic WHERE id=?`, [filteredId], function(err, result, fields) {
			if (err) throw err;
			response.writeHead(302, { Location: '/' });
			response.end();
		});
	});
};