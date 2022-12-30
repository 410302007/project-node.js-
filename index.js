require('dotenv').config();

const express = require('express');

const app = express();


//路由設定，routes
app.get('/', (req,res)=>{
  res.send(`<h1>泥好</h1>`);

});

//*****所有路由設定都要放在這行之前*****
app.use((req,res)=>{
  res.type('text/html');
  res.status(404).send(`<h1>404找不到你要的頁面</h1>`);
}); 



//*****所有路由設定都要放在這行之前*****
const port = process.env.PORT ||3001;
app.listen(port,()=>{
  console.log(`server started: ${port}`);
})