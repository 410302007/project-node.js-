const express = require('express');
const db = require('../modules/connect-mysql');

const router = express.Router();

router.get('/', async(req, res)=>{
  const t_sql = "SELECT COUNT(1) totalRows FROM member";
  const [[{totalRows}]] = await db.query(t_sql);  //解構

  res.json(totalRows);
});
   
module.exports = router;