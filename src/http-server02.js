
const http = require('http');
const fs = require('fs/promises');  //使用promise api

const server = http.createServer(async(req, res)=>{
  const no_return_data =  await fs.writeFile(__dirname + '/header01.txt', JSON.stringify(req.headers, null ,4)
  );
  res.end(`<h2>error: ${no_return_data}</h2>`)
});

server.listen(3000);