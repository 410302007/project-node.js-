
const http = require('http');
const fs = require('fs/promises');  //使用promise api

const server = http.createServer(async(req, res)=>{
  console.log(`--------------`, req.url);
  res.writeHead(200,{
    'Content-Type':'text/plain'
  });
  const result=  await fs.readFile(__dirname + '/header01.txt'
  );
  console.log(result.toString());
  res.end(result.toString())
});

server.listen(3000);