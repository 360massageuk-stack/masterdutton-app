const http = require('http');
const fs = require('fs');
const path = require('path');

http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];
  let file = urlPath === '/' ? 'index.html' : urlPath.substring(1);
  const filePath = path.join(__dirname, file);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    } else {
      let ext = path.extname(file);
      let mime = 'text/plain';
      if (ext === '.html') mime = 'text/html';
      else if (ext === '.css') mime = 'text/css';
      else if (ext === '.js') mime = 'application/javascript';
      else if (ext === '.png') mime = 'image/png';
      else if (ext === '.json') mime = 'application/json';

      res.writeHead(200, { 'Content-Type': mime });
      res.end(data);
    }
  });
}).listen(8080);

console.log('Static server started at http://localhost:8080');
