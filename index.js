require('dotenv').config();
const multer = require('multer');
const upload = require('./modules/upload-img');
 
const express = require('express');

const app = express();

app.set('view engine','ejs'); //安裝ejs

//top-level middleware 
app.use(express.urlencoded({extended: false}));
app.use(express.json());

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

app.post(['/try-post','/try-post2'], (req,res)=>{
  res.json(req.body);  
});
//若沒使用urlencodedParser幫忙處理，req.body為undefined
//根據檔頭來判斷 資料進來時是否要運作

app.get('/try-post-form', (req,res)=>{
  res.render('try-post-form');
});

app.post('/try-post-form', (req,res)=>{
  // res.json(req.body);
  res.render('try-post-form', req.body);
});

app.post('/try-upload', upload.single('avatar'), (req,res)=>{
  res.json(req.file); //上傳單一檔案
}); 

app.post('/try-uploads', upload.array('photos'), (req,res)=>{
  res.json(req.files); //上傳多個檔案
}); 

//寬鬆規則
app.get('/my-params1/:action?/:id?', (req,res)=>{
  res.json(req.params); 
}); 

//手機號碼
app.get(/^\/m\/09\d{2}-?\d{3}-?\d{3}$/i, (req,res)=>{
  let u = req.url.slice(3);  // 從第三個以後開始顯示
  u = u.split('?')[0];       //丟掉query String
  u = u.split('-').join(''); //去掉減號
  res.send(u); 
}); 


//嚴謹規則(因放於寬鬆規則後，此路由永遠無法拜訪)
app.get('/my-params1/abc', (req,res)=>{
  res.json(req.params); 
}); 
//!!越寬鬆規則放越後面，嚴謹放前面


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