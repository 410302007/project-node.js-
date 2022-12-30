require('dotenv').config();

const express = require('express');

const app = express();

//路由設定，routes
app.get('/', (req,res)=>{
  res.send(`<h1>泥好</h1>`);

});
const port = process.env.PORT ||3001;
app.listen(port,()=>{
  console.log(`server started: ${port}`);
})