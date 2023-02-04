if(process.argv[2]==='production'){
  require('dotenv').config({path:__dirname+ '/production.env'});
}else{
  require('dotenv').config({path:__dirname+ '/dev.env'});
};

const bcrypt = require('bcryptjs')
const multer = require('multer');
const upload = require('./modules/upload-img');
const session = require('express-session');  //session 放最前面(注意順序!)
const MYsqlStore = require('express-mysql-session')(session);
const moment = require('moment-timezone');
const db = require('./modules/connect-mysql');
const sessionStore = new MYsqlStore({}, db);  //{}->放連線的帳號和密碼，因已設定，所以不用放
 
const express = require('express');

const app = express();

app.set('view engine','ejs'); //安裝ejs

const corsOptions = {
  credentials:true,
  origin: (origin, callback)=>{
    console.log({origin});
    callback(null, true);
  },
};
app.use(require('cors')(corsOptions));

//top-level middleware 
//解析cookie，拿到sessionId，再把session資料放到req.session
app.use(session({
  saveUninitialized: false, //session尚未初始化時 是否存起來(與儲存媒介有關)
  resave: false,  //沒變更內容是否強制回存
  secret: 'skdjskdakslkdjlkflqwlkelkdjs', //加密
  store: sessionStore,
  // cookie:{
  //   maxAge: 1200_000    //存活20分鐘
  // }   //瀏覽器持續開著，session基本上一直存活
}));
app.use(express.urlencoded({extended: false}));
app.use(express.json());


//自訂middleware
app.use((req, res, next)=>{
  res.locals.title = process.env.SITE_TITLE || "*** 沒有設定 ***";
  //res.locals =>進到template
  //掛在locals底下的屬性會變成template裡的全域變數

  //樣板輔助函式 helper function
  res.locals.toDateString = d=>moment(d).format('YYYY-MM-DD');
  res.locals.toDatetimeString = d=>moment(d).format('YYYY-MM-DD HH:mm:ss');
  //直接將session 資料放到locals(res.locals.sessiond)，讓template可以吃到session
  res.locals.session = req.session;
  next();   //若要往下傳->必須呼叫next()
})

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
  res.locals.title = res.locals.title? ('測試-' + res.locals.title):  '測試';

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

//可同時把router掛在不同baseUrl底下
app.use(require('./routes/admin2')); 
app.use('/admins', require('./routes/admin2'));
// app.use('/admins-new', require('./routes/new')); //切換版本(admin3做法)

app.get('/try-sess', (req, res)=>{
  req.session.my_var = req.session.my_var || 0;  //預設為0
  req.session.my_var ++;        
  res.json({
    my_var: req.session.my_var, 
    session: req.session          //session不要取名為cookie
  }) 
});

app.get('/try-moment', (req, res)=>{
  const d1 = new Date();
 const m1 = moment();  //new Date()
 const m1a = m1.format('YYYY/MM/DD'); 
 const m1b = m1.format('YYYY-MM-DD HH:mm:ss'); 
 const m1c = m1.tz('Asia/Tokyo').format('YYYY-MM-DD HH:mm:ss');
 const m2 = moment('2023-01-05');  //new Date()
 res.json({m1a, m1b, d1, m1c, m2});
});

//查詢資料庫->非同步 -> async await 
app.get('/try-db', async (req, res)=>{
//  const [rows, fields] = await db.query("SELECT * FROM categories");

//  res.json({rows, fields});
const [rows] = await db.query("SELECT * FROM categories");

res.json(rows);
});

//新增會員資料
app.get('/add-member', async (req, res)=>{
  return res.json({}); //已新增就不要再新增了
  const sql = "INSERT INTO `member`(`name`, `email`, `password`, `hash`, `created_at`) VALUES ('王大副', ?, ?, '', Now())";
  const password = await bcrypt.hash('24680',10);
  const [result] = await db.query(sql,['money@test.com', password]);
  
  res.json(result);
  });
//登入
app.get('/login', async (req, res)=>{
  return res.render('login');   
});
app.post('/login', upload.none(), async (req, res)=>{
  const output ={
    success:false,
    code:0,
    error:'',
  };
  const {email, password} = req.body;
  if(!email | !password){  //若email或密碼 其中一個沒有
    output.error = '欄位資料不足'
    output.code = 400;
    return res.json(output);
  }
  const sql = "SELECT * FROM  member WHERE email =?";
  const [rows] = await db.query(sql,[email]); //上方的? => [email]
  if(rows.length < 1){
    output.error = '信箱錯誤'
    output.code = 410;
    return res.json(output);
  }
   const row = rows[0];
   
   //密碼比對
   const result = await bcrypt.compare(password,row.password);
   if(result){
    output.success = true;
    //成功登入->設定session
    req.session.user={
      email,  //=>[email]
      name : row.name
    };
   }else{
    output.error = "密碼錯誤";
    output.code = 420;
   }

  return res.json(output);   
});

//登出
app.get('/logout', async (req, res)=>{
   delete req.session.user; //刪掉session
   return res.redirect('/');  //轉向首頁
});
  

//baseUrl
app.use('/address-book', require('./routes/address-book'));

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