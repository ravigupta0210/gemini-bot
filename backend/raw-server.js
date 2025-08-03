const http = require('http');

http.createServer((req, res) => {
  console.log("Request received");
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('It works!\n');
}).listen(5000);

console.log("Raw server listening on port 5000");
