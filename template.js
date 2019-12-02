module.exports = {
  HTML:function(title, body){
    return `
    <!doctype html>
    <html>
    <head>
      <title>${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1>${title}</h1>
      ${body}
    </body>
    </html>
    `;
  }
}