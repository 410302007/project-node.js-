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
  res.redirect   
----------------------
前端傳入的資料
get:
  req.query() //取得query string parameters
  req.params //網址列上的參數
  req.session //使用express-session時

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

3.filter()會回傳一個陣列，條件是return為true的物件，很適合用在搜尋功能，能找到符合條件的資料

4.使用map()將原有的陣列，透過函式內所回傳的值組合成另一個陣列(回傳數量等於原始陣列的長度)

5.可使用此方法/app.use('/api1', require('./routes/api1'));/ 掛在不同api下

6.(專題)環境設定-> production.env(npm start)

7.記得將dev.env 放入gitinore(不要放入專題的github)

8.只有ab-list05.html可透過liveServer開啟(檔頭: http://127.0.0.1:5500/public/ab-list05.html)-> 使用cors設定

9.使用檔頭為127.0.0.1:3002/cors-sess.html -> 發送ajax並沒有將cookie發送出去; 送不出去-> 因domain不同
  使用檔頭為localhost:3002/cors-sess.html -> 發送ajax 將cookie發送出去;

10. 白名單(WhiteList)-> ex:(let Whitelist = {'http://localhost:8080',undefined, 'http://localhost:3000'};)
->在陣列裡放主機/ domain/port-> 在陣列裡代表允許

11.domain一樣 & 通訊協定一樣 ->才吃的到session (port不同->還是可吃的到session)

12.cors.sess/html
   (1)(使用liveServer開啟:
      Access-Control-Allow-Credentials: true
      Access-Control-Allow-Origin: http://127.0.0.1:5500);
   (2)(使用http://127.0.0.1:3002/cors-sess.html開啟 -> credentials:true; allow-origin:http://127.0.0.1:3002)  

13.(專題):若要使用session ， 統一使用localhost:3002/ 127.0.0.1:3002 擇一! 

14.使用標籤的class的用意:  1.與css相關    
                          2.js想透過class拿到element
   只有form表單欄位，才需要加name; 其他element不須加name

15. req.body(表單)-> body-parser只會處理
    urlencoded & json格式 -> 必須使用upload.none()-> 才能收到資料
-----------------------
基本類型轉換: 
parseInt(100000000000000000000000)
=> 1
100000000000000000000000
=>1e+23
parseInt(1e+23)
=>1
parseInt('100000000000000000000000')
=>1e+23

b= 'FF'
=> 'FF'
parseInt(b,16) //16進位
=>255
(254).toString(16)
=> 'fe'