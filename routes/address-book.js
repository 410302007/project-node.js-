const express = require('express');
const db = require('../modules/connect-mysql');


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

router.post('/add', async(req, res)=>{ 
  
  // res.render('ab-list', output);
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

module.exports = router;