const express = require('express');
const db = require('../modules/connect-mysql');
const upload = require('../modules/upload-img');
const moment = require('moment-timezone');


const router = express.Router();

const getListData = async(req, res)=>{
  const output ={
    totalRows:0,
    totalRows:0,
    page:1,
    rows:[],
  }
  let page = +req.query.page || 1; 
  //用戶想要看第幾頁
  //加號->轉換成數值

  if(page<1){
    return res.redirect(req.baseUrl+trq.url); //頁面轉向
  }

  const perPage = 20;
  const t_sql = "SELECT COUNT(1) num FROM member";  //總筆數
  const [[{num : totalRows}]] = await db.query(t_sql);  //解構
  const totalPages = Math.ceil(totalRows/perPage);  //總頁數

  let rows = [];
  if(totalRows>0){
    if(page>totalPages){
      return res.redirect("?page="+ totalPages); //如果超過頁面，轉到最後一頁
    }

    const sql = `SELECT * FROM member ORDER BY mid DESC LIMIT ${(page-1)*perPage}, ${perPage}`;

    // return res.send(sql); 輸出sql至頁面，除錯用
    [rows] = await db.query(sql);


  }

  return  {totalRows, totalPages, page, rows};

};
router.get('/add', async(req, res)=>{ 
  res.render('ab-add');
});

router.post('/add', upload.none(), async(req, res)=>{ 
  const output = {
    success:false,
    postData: req.body, //除錯用
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