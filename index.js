require('dotenv').config();

const express = require('express');

const app = express();

app.set('view engine','ejs'); //安裝ejs


//路由設定，routes
app.get('/', (req,res)=>{
  res.render('main',{name: '南西'});
  //測試EJS
});

app.get('/json-sales',(req,res)=>{
  const data = require(__dirname + '/data/sales.json');
  //require 可以在程式的任何地方使用
  res.json(data);  //data(json格式)->沒有要呈現html
  // res.render('json-sales');
});



app.use(express.static('public'));
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