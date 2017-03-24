# Websql Sqlite Service
### WebSql ve Sqlite Uyumlu SqlService Kütüphanesi

İonic ile ( veya başka ui ) çalışırken device ile browser üzerinde testleri kolaylaştırmak için yapılmıştır.

Toplamda 5 adet methodu var bunlar:

- [x] [select](https://github.com/abdurrahmanekr/Websql-Sqlite-Service/#select)
- [x] [insert](https://github.com/abdurrahmanekr/Websql-Sqlite-Service/#insert)
- [x] [update](https://github.com/abdurrahmanekr/Websql-Sqlite-Service/#update)
- [x] [delete](https://github.com/abdurrahmanekr/Websql-Sqlite-Service/#delete)
- [x] [query](https://github.com/abdurrahmanekr/Websql-Sqlite-Service/#query)

## En Son Değişiklikler (Last Update)

> Javascript Desteği getirildi

## select

> table : tablonun ismini içerir.

>  field : burada çekilecek sütun isimleri yer alıyor.

>  where : Sorgunun şartı.

>  values : Sorgu şartında bulunan '?' ifadelerinin dolduracak array.

>  order : Sorguda bulunacak order işlemine ait string ifade.


```javascript
SqlService.select(table, field, where, values, order).then(function(res){ 
  // res : dönen sonuç
});
```

basit bir select sorgusu
```javascript
$scope.list = [];
SqlService.select("chatList", "*", "chatId = ?", ["C0001"]).then(function(res){
	angular.forEach(res,function(item, index){
		$scope.list.push({
			message: item.message
		});
	})
});
```
like kullanımına bir örnek
```javascript
$scope.list = [];
SqlService.select("chatList", "*", "(message LIKE ?)", ['%avare kodcu%']).then(function(res){
	angular.forEach(res,function(item, index){
		$scope.list.push({
			message: item.message
		});
	})
});
```
order by kullanımı
```javascript
$scope.list = [];
SqlService.select("chatList", "*", "", "", "rowid, message").then(function(res){
	angular.forEach(res,function(item, index){
		$scope.list.push({
			message: item.message
		});
	})
});
```

Bunlara benzer kullanımları yapabilirsiniz.

## insert

> table : tablonun ismini içerir

>  row : burada insert yapılacak sütun isimleri yer alıyor

>  values :  row içinde bulunan sütunlara ait değerler

```javascript
SqlService.insert(table, row, values).then(function(res){
	//res : dönen sonuç
});
```
tekli insert işlemi
```javascript
SqlService.insert("chatList", ["message"], ["avare kodcu"]).then(function(res){
	console.log(res)
});
```
çoklu insert işlemi

```javascript
SqlService.insert("chatList", ["message"], [["avare kodcu"], ["Allah birdir!"]]).then(function(res){
	console.log(res)
});
```

## update


> table : tablonun ismini içerir

>  row : burada insert yapılacak sütun isimleri yer alıyor

>  values : row içinde bulunan sütunlara ait değerler

>  where: Sorgu şartı

>  wValues : Sorgu şartında bulunan '?' ifadelerinin dolduracak array

```javascript
SqlService.update(table, row, values, where, wValues).then(function(res){
	//res : dönen sonuç
});
```
basit bir update işlemi
```javascript
SqlService.update("chatList", ["message"], ["avare kodcu"], "chatId = ?", ["C0001"]).then(function(res){
	console.log(res);
});
```
sorguları değiştirerek çeşitli update işlemi yapılabilir.

## delete

" Silmek ya da silmemek işte bütün mesele bu.." :) Bir veri asla silinmez ama ben yinede komutunu yazdım :)
> table : tablonun ismini içerir

>  where: Sorgu şartı

>  values : Sorgu şartında bulunan '?' ifadelerinin dolduracak array

```javascript
SqlService.delete(table, where, values).then(function(res){
	//res : dönen sonuç
});
```
basit bir delete işlemi
```javascript
SqlService.delete("chatList", "chatId = ?", ["C0001"]).then(function(res){
	console.log(res);
});
```
ve son olarak 
## query

Bunu da karışık sorgular içeren, ufak bir işlem içeren, tablo oluşturmak için kullanılabilecek sorgular olur diye yazdım

> sql :  sorgunun tamamı

örneğiyle beraber ;
```javascript
SqlService.query("CREATE TABLE IF NOT EXISTS chatList (chatId VARCHAR(255) NOT NULL, message TEXT)").then(function(res){
	console.log(res);
});
```
