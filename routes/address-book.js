const express = require('express');
const db = require('../modules/connect-mysql');
const upload = require('../modules/upload-img');
const moment = require('moment-timezone');


const router = express.Router();

//針對此模組的頂層 ; 經過路由前，會先經過此middleware
//url, baseUrl, originalUrl 要在這裡拿，若在index那裡拿，originalUrl會一樣，但url & baseUrl會不同 
router.use((req, res, next)=>{
  const{url, baseUrl, originalUrl} = req;
  res.locals={...res.locals,url, baseUrl, originalUrl};
  //不能使用-> res.locals.url = url (會將先前在index設定的middleware排除)
  next();
});

//呈現新增表單
const getListData = async(req, res)=>{ 
  let page = +req.query.page || 1;
  //用戶想要看第幾頁 //加號->轉換成數值

  if(page<1){
    return res.redirect(req.baseUrl+trq.url); //頁面轉向
  }
  let where  = ' WHERE 1 ';   //1 = 相當於true

  let search = req.query.search || '';
  if(search){
    const esc_search = db.escape(`%${search}%`);  // SQL 跳脫單引號, 避免 SQL injection ; 頭尾加%
    console.log({esc_search});
    where += ` AND (\`name\` LIKE ${esc_search} OR \`mobile\` LIKE ${esc_search} OR \`address\` LIKE ${esc_search})`;  //頭尾給空格
  }

  const perPage = 20;
  const t_sql = `SELECT COUNT(1) totalRows FROM member ${where}`;  //總筆數
  const [[{totalRows}]] = await db.query(t_sql);  //解構
  const totalPages = Math.ceil(totalRows/perPage);  //總頁數

  let rows = [];
  if(totalRows>0){
    if(page>totalPages){
      return res.redirect("?page="+ totalPages); //如果超過頁面，轉到最後一頁
    }

    const sql = `SELECT * FROM member ${where} ORDER BY mid DESC LIMIT ${(page-1)*perPage}, ${perPage}`;

    // return res.send(sql); 輸出sql至頁面，除錯用
    [rows] = await db.query(sql);


  }

  return  {totalRows, totalPages, page, rows};

};
//新增api
router.get('/add', async(req, res)=>{ 
  res.render('ab-add');
});

router.post('/add', upload.none(), async(req, res)=>{ 
  const output = {
    success:false,
    postData: req.body, //除錯用
    code:0,
    errors: {}
  };

  let {name,email,mobile,birthday,address,pet_type}=req.body; //解構

  if(!name || name.length<2 ){
    output.errors.name='請輸入正確的姓名';
    return res.json(output);   //輸出，但後面不執行時->加return
  }
  
  birthday = moment(birthday);
  birthday = birthday.isValid() ? birthday.format('YYYY-MM-DD') : null;   //如果格式錯誤，填空值

  //TODO: 資料檢查
    const sql = "INSERT INTO `member`(`name`, `email`,`mobile`, `birthday`, `address`, `pet_type`,`created_at`)VALUES(?, ?, ?, ?, ?, ?,NOW())";
  const [result] = await db.query(sql, [name, email , mobile, birthday, address, pet_type]);

  output.result = result; 
  output.success = !!result.affectedRows; //轉成boolean (affectedRows 1 : true ; affectedRows 0 :false )
  
  //affectedRows
  res.json(output);   //=>結束，所以不須加return                   
  //upload.none()->不要上傳，但需要middleware幫忙解析資料
});

router.get('/edit/:mid', async(req, res)=>{ 
  const mid = +req.params.mid || 0; //轉換成數值
  if(!mid){
    return res.redirect(req.baseUrl); //呈現表單-> 轉向列表頁(不要用json)
  }
  const sql = "SELECT * FROM member WHERE mid=?";
  const [rows] = await db.query(sql,[mid]);
  if(rows.length<1){
    return res.redirect(req.baseUrl); //轉向列表頁
  }
  const row = rows[0];  //若有資料就拿第一筆資料
  // res.json(row);

  //從哪邊來
  const referer = req.get('Referer') || req.baseUrl; //若沒有值->回到baseUrl ->第一頁
  res.render('ab-edit', {...row, referer});  //展開->email、name..這些變數 
});
//http方法->使用put;  RESTful API 基本規定-> CRUD -> get/ post / 修改:put / delete
router.put('/edit/:mid', upload.none(), async(req, res)=>{ 
  const output = {   //定義要輸出資訊的格式
    success:false,
    postData: req.body, //除錯用
    code:0,
    errors: {}
  };
  const mid = +req.params.mid || 0; //轉換成數值
  if(!mid){
    output.errors.mid='沒有會員資料編號'
    return res.json(output); //回傳錯誤訊息-> json(API不要用轉向->會將列表頁內容傳給前端)
  }

  let {name,email,mobile,birthday,address,pet_type,member_status}=req.body; //解構

  if(!name || name.length<2 ){
    output.errors.name='請輸入正確的姓名';
    return res.json(output);   //輸出，但後面不執行時->加return
  }
  
  birthday = moment(birthday);
  birthday = birthday.isValid() ? birthday.format('YYYY-MM-DD') : null;   //如果格式錯誤，填空值

  //TODO: 資料檢查
    const sql = "UPDATE `member` SET `name`=?,`email`=?,`mobile`=?,`birthday`=?,`address`=?,`pet_type`=?,`member_status`=? WHERE `mid`=?";
  const [result] = await db.query(sql, [name, email, mobile, birthday, address, pet_type, member_status, mid]);

  output.result = result; 
  output.success = !!result.changedRows; //轉成boolean (changedRows 1 : true ; changedRows 0 :false )
  
 
  res.json(output);   //=>結束，所以不須加return                   
  //upload.none()->不要上傳，但需要middleware幫忙解析資料
});



router.get('/', async(req, res)=>{ 
  const output = await getListData(req, res); //output
  res.render('ab-list', output);
});

router.get('/api', async(req, res)=>{ 
  const output = await getListData(req, res); //output
  for(let item of output.rows){
    item.birthday = res.locals.toDateString(item.birthday); //修改birthday格式
    item.created_at = res.locals.toDatetimeString(item.created_at); //修改created_at格式
  }
  //TODO: 用output.rows.forEach()再寫一次功能
  res.json(output); //拿到路由-> 轉成json
});

router.delete('/:mid', async(req, res)=>{ 
  const output = {
    success:false,
    error:''
  }
  const mid = +req.params.mid || 0 ;
  if(!mid){
    output.error='沒有mid'
    return res.json(output);
  }
  const sql = "DELETE FROM `member` WHERE  mid=?"; 

  const [result] = await db.query(sql,[mid]);
 
  output.success =!! result.affectedRows //boolean值轉換(1->true)
  res.json(output);
 });

module.exports = router;