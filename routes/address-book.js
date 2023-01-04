const express = require('express');
const db = require('../modules/connect-mysql');

const router = express.Router();

router.get('/', async(req, res)=>{
  let page = +req.query.page || 1; 
  //用戶想要看第幾頁
  //加號->轉換成數值

  if(page<1){
    return res.redirect(req.baseUrl); //頁面轉向
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

  res.json({totalRows, totalPages, page, rows});

});
   
module.exports = router;