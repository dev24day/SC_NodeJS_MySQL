exports.html = function(title, list, body, control) {
  return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `;
};
exports.list = function(topics) {
  var list = "<ul>";
  var i = 0;
  while (i < topics.length) {
    list += `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`;
    i += 1;
  }
  list = list + "</ul>";
  return list;
};
exports.author_combobox = function(authors, author_id = 1) {
  var box = "";
  var i = 0;
  while (i < authors.length) {
    selected = "";
    if (authors[i].id === author_id) selected = " selected";
    box += `<option value="${authors[i].id}"${selected}>${authors[i].name}</option>`;
    i += 1;
  }
  return `<select name="author">${box}</select>`;
};
