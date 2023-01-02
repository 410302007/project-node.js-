process
行程

thread
執行緒
----------------------

輸出給前端
  res.end()
  res.send()
  res.render()
  res.json()

----------------------
前端傳入的資料
get:
  req.query() //取得query string parameters
  req.params //網址列上的參數

post:
  req.body   //表單資料 (body-> http的body)
  req.file   //上傳單一檔案
  req.files  //上傳多個檔案時



----------------------
RESTful API 簡略的規則:

GET    /member       #取得資料列表
GET    /member/:mid  #取得單筆資料列表 

POST   /member       #新增資料
PUT    /member/:mid  #修改資料
DELETE /member/:mid  #刪除資料
-----------------------
app.get()=> 
  get 代表此路由只接受get方法

app.post()=>
  post 代表此路由只接受post方法

app.use()=>
  use 代表接受所有http的方法



-----------------------
1.在ejs裡並沒有傳值進來，使用typeof

2. image resize -> (1)jimp & (2)sharp