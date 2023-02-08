--說明
SELECT COUNT(1) FROM products JOIN products_type;
SELECT * FROM products JOIN products_type ON products.type_id = products_type.type_id

SELECT * FROM products AS p
JOIN products_type t ON p.type_id = t.type_id

SELECT p.*, c.name cate_name FROM products p JOIN categories c ON p.`category_sid` = c.sid;

--LEFT OUTER JOIN
--注意順序! 且左邊資料表的所有資料都要出現
SELECT p.*, c.name cate_name FROM products p LEFT JOIN categories c ON p.`category_sid` = c.sid;

--注意主角是誰!
SELECT *  FROM categories c  LEFT JOIN  products p ON p.`category_sid` = c.sid;


--找到訂單的所有明細
SELECT od.*, p.bookname FROM order_details od
  JOIN products p ON od.product_sid = p.sid
  WHERE od.order_sid =11;

--某個會員買過的所有商品
SELECT * FROM orders o 
  JOIN order_details od ON o.sid = od.order_sid  --只拿到商品的id
  JOIN products p ON od.product_sid=p.sid 
  WHERE o.member_sid = 1 GROUP BY p.sid;
  --GROUP BY (先條件篩選後，再放GROUP BY) ->要放WHERE後
  