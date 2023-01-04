const express = require('express');
const db = require('../modules/connect-mysql');

const router = express.Router();

router.get('/', async(req, res)=>{
  let page = +req.query.page || 1; 
  //用戶想要看第幾頁
  //加號->轉換成數值

  const perPage = 20;
  const t_sql = "SELECT COUNT(1) num FROM member";  //總筆數
  const [[{num : totalRows}]] = await db.query(t_sql);  //解構
  const totalPages = Math.ceil(totalRows/perPage);  //總頁數
  res.json({totalRows, totalPages, page});
});
   
module.exports = router;