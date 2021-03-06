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
exports.authorTable = function(authors, fields) {
  var table = "<table border='1'>";
  fields.forEach(field => {
    table += `<th>${field.name}</th>`;
  });
  table += "<th>Update</th><th>Delete</th>";
  authors.forEach(author => {
    table += "<tr align='center'>";
    header = Object.keys(author);
    header.forEach(h => {
      table += `<td>${author[h]}</td>`;
    });
    table += `
    <td>
    <a href="/author_update?author_id=${author.id}">
    <button type="submit">⟳</button>
    </a>
    </td>`;
    table += `<td>
    <form action="/author_delete_process" method="post">
    <input type="hidden" name="id" value="${author.id}">
    <button type="submit">⌧</button>
    </form>
    </td>`;
    table += "</tr>";
  });
  table += "</table>";
  return table;
};
