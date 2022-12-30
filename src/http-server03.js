
const http = require('http');
const fs = require('fs/promises');  //使用promise api

const server = http.createServer(async(req, res)=>{
  console.log(`--------------`, req.url);
  const result=  await fs.readFile(__dirname + '/esm01.html'
  );
  console.log(result.toString());
  res.end(result.toString())
});

server.listen(3000);