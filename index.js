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
  console.log(data); //取得已經是原生類型
  // res.json(data);  
  res.render('json-sales',{data});
});

// app.get('/json-sales3',(req,res)=>{
//   const data = require(__dirname + '/data/sales.json');

//   const handleAr = [
//     {
//       key: 'name_asc',
//       label:'姓名由小到大',
//       sort:(a,b)=>{},
//     },
//     {
//       key: 'name_desc',
//       label:'姓名由大到小',
//       sort:(a,b)=>{},
//     },
//     { key: 'age_asc',
//       label:'年齡由小到大',
//       sort:(a,b)=>{},
//     },
//     {
//       key:'age_desc',
//       label:'年齡由大到小',
//       sort:(a,b)=>{},
//     },
// ];

//   res.render('json-sales',{data, handleObj});
// });

app.get('/json-sales2',(req,res)=>{
  const data = require(__dirname + '/data/sales.json');
  const {orderby} = req.query;

  const handleObj = {
    name_asc: {
      label:'姓名由小到大',
      sort:(a,b)=>{
      return a.name < b.name? -1: 1;
    },
  },
    name_desc:{
      label:'姓名由大到小',
      sort:(a,b)=>{
      return a.name > b.name? -1: 1;
      },
    },
    age_asc: {
      label:'年齡由小到大',
      sort:(a,b)=>(
        a.age - b.age)
    },
    age_desc : {
      label:'年齡由大到小',
      sort:(a,b)=>(
        b.age - a.age
      ),
    },

  };
  //有對應到key 才做排序
  if(handleObj[orderby]){
    data.sort(handleObj[orderby].sort);
  }

  res.render('json-sales2',{data, handleObj, orderby});
});

//取得queryString資料
//可重複給值 (變成陣列)
app.get('/try-qs',(req,res)=>{
  res.json(req.query);  
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