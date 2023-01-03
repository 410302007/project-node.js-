const express = require('express');
const db = require('../modules/connect-mysql');

const router = express.Router();

router.get('/', async(req, res)=>{
  const [rows] = await db.query("SELECT * FROM products LIMIT 5 ");

  res.json(rows);
});

module.exports = router;