var http = require('http');
var url = require('url');
var topic = require('./lib/topic.js');
var author = require('./lib/author.js');

var app = http.createServer(function(request, response) {
	var _url = request.url;
	var pathname = url.parse(_url, true).pathname;
	var queryData = url.parse(_url, true).query;
	if (pathname === '/') {
		if (queryData.id === undefined) {
			topic.index(request, response);
		} else {
			topic.page(request, response);
		}
	} else if (pathname === '/author') {
		author.index(request, response);
	} else if (pathname === '/create') {
		topic.create(request, response);
	} else if (pathname === '/create_process') {
		topic.create_process(request, response);
	} else if (pathname === '/update') {
		topic.update(request, response);
	} else if (pathname === '/update_process') {
		topic.update_process(request, response);
	} else if (pathname === '/delete_process') {
		topic.delete_process(request, response);
	} else {
		response.writeHead(404);
		response.end('Not found; Unusual Approach');
	}
});
app.listen(3000);