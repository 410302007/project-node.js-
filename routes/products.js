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

router.get('/', async(req, res)=>{
  const [rows] = await db.query("SELECT * FROM products");
  res.send(rows);
});


module.exports = router;