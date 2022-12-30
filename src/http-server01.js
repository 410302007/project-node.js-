
const http = require('http');

const server = http.createServer((req, res)=>{
  //response.writeHead(statusCode[, statusMessage][,headers])
  res.writeHead(200,{
    'Content-Type': 'text/html',
  });
  res.end(`<h2>Hello</h2>
  <p>${req.url}</p>`)
});

server.listen(3000);