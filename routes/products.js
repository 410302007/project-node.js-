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

router.get('/toggle-like/:pid', async(req, res)=>{
  const output={
    success:false,
    error:'',
    action:'',
  };
  //必須為已登入的會員
  if(! req.session.user){
    output.error = '必須登入會員，才能將商品加到最愛!'
    return res.json(output);
  }

  const sql1 = "SELECT * FROM product_likes WHERE `mid`=? AND `product_id`=?"
  const [likes] = await db.query(sql1,[
    req.session.user.id,
    req.params.pid
  ]);
  if(likes.length){ //如果有收藏就取消
    const sql2 = "DELETE FROM `product_likes` WHERE sid" + likes[0].sid;
    const [result] = await db.query(sql2);
    output.success = !! result.affectedRows;
    output.action = 'delete';
  }else{
    //TODO: 判斷有無此商品

    const sql3 = "INSERT INTO `product_likes`(`mid`, `product_id`) VALUES (?,?)";
    const [result] = await db.query(sql3,[
      req.session.user.id,
      req.params.pid
    ]);
    output.success = !! result.affectedRows
    output.action = 'insert';
  }
  res.json(output);
});
//products
router.get('/', async(req, res)=>{
  const [rows] = await db.query("SELECT * FROM products");
  res.json(rows);
});


module.exports = router;