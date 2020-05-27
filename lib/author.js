var template = require("./template.js");
var db = require("./db.js");
var qs = require("querystring");
var url = require("url");
var path = require("path");
var sanitizeHtml = require("sanitize-html");

exports.index = function(request, response) {
  db.query("SELECT * FROM author", function(error, authors, fields) {
    if (error) throw error;
    var title = "Authors";
    var authorTable = template.authorTable(authors, fields);
    var html = template.html(
      title,
      "",
      authorTable,
      `<a href="/author_create">Create</a>`
    );
    response.writeHead(200);
    response.end(html);
  });
};
exports.create = function(request, response) {
  db.query("SELECT * FROM author", function(error, authors, fields) {
    if (error) throw error;
    var title = "Author - create";
    var authorTable = template.authorTable(authors, fields);
    var html = template.html(
      title,
      "",
      `
      ${authorTable}
      <form action="/author_create_process" method="post">
      <p><input type="text" name="name" placeholder="name"></p>
      <p>
      <textarea name="profile" placeholder="profile"></textarea>
      </p>
      <p>
      <input type="submit">
      </p>
      </form>
      `,
      ""
    );
    response.writeHead(200);
    response.end(html);
  });
};

exports.create_process = function(request, response) {
  var body = "";
  request.on("data", function(data) {
    body = body + data;
  });
  request.on("end", function() {
    var post = qs.parse(body);
	var sanitizedName = sanitizeHtml(post.name);
	var sanitizedProf = sanitizeHtml(post.profile);
    db.query(
      `INSERT INTO author (name, profile) VALUES(?, ?)`,
      [sanitizedName, sanitizedProf],
      function(err, result) {
        if (err) throw err;
        response.writeHead(302, { Location: `/author` });
        response.end();
      }
    );
  });
};
exports.update = function(request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var filteredId = path.parse(queryData.author_id).base;
  db.query(`SELECT * FROM author WHERE id=?`, [filteredId], function(
    error2,
    result
  ) {
    if (error2) throw error2;
    var name = result[0].name;
    var profile = result[0].profile;
    var html = template.html(
      name,
      "",
      `
      <form action="/author_update_process" method="post">
      <input type="hidden" name="id" value="${filteredId}">
      <p>
      <input type="text" name="name" placeholder="name" value="${name}">
      </p>
      <p>
      <textarea name="profile" placeholder="profile">${profile}</textarea>
      </p>
      <p><input type="submit"></p>
      </form>
      `,
      ""
    );
    response.writeHead(200);
    response.end(html);
  });
};
exports.update_process = function(request, response) {
  var body = "";
  request.on("data", function(data) {
    body = body + data;
  });
  request.on("end", function() {
    var post = qs.parse(body);
	var sanitizedName = sanitizeHtml(post.name);
	var sanitizedProf = sanitizeHtml(post.profile);
    db.query(
      `UPDATE author SET name=?, profile=? WHERE id=?`,
      [sanitizedName, sanitizedProf, post.id],
      function(err, result) {
        response.writeHead(302, { Location: `/author` });
        response.end();
      }
    );
  });
};
exports.delete_process = function(request, response) {
  var body = "";
  request.on("data", function(data) {
    body = body + data;
  });
  request.on("end", function() {
    var post = qs.parse(body);
    var id = post.id;
    var filteredId = path.parse(id).base;
    db.query(`DELETE FROM author WHERE id=?`, [filteredId], function(
      err,
      result
    ) {
      if (err) throw err;
      response.writeHead(302, { Location: "/author" });
      response.end();
    });
  });
};