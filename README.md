# Angularjs SqlService Cordova WebSql Compatible
#### WebSql ve CordovaSqlite Uyumlu Angularjs Sql Servisi (şu an bu uyumluluk yok, yakın zamanda yapılacaktır)

İonic ile ( veya başka ui ) çalışırken device ile browser üzerinde testleri kolaylaştırmak için yapılmıştır.

Toplamda 5 adet komutu var bunlar : select, insert, update, delete, query

## select

> table : tablonun ismini içerir.

>  field : burada çekilecek sütun isimleri yer alıyor.

>  where : Sorgunun şartı.

>  values : Sorgu şartında bulunan '?' ifadelerinin dolduracak array.


```
SqlService.select(table, field, where,values).then(res){ 
  // res : dönen sonuç
}
```

basit bir select sorgusu
```
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
```
$scope.list = [];
SqlService.select("chatList", "*", "(message LIKE ?)", ['%avare kodcu%']).then(function(res){
	angular.forEach(res,function(item, index){
		$scope.list.push({
			message: item.message
		});
	})
});
```
Bunlara benzer kullanımları yapabilirsiniz.

##insert

> table : tablonun ismini içerir

>  row : burada insert yapılacak sütun isimleri yer alıyor

>  values :  row içinde bulunan sütunlara ait değerler

```
SqlService.insert(table, row, values).then(function(res){
	//res : dönen sonuç
});
```
basit bir insert ( zaten başka insert türü yok :D )
```
SqlService.insert("chatList", ["message"], ["avare kodcu"]).then(function(res){
	console.log(res)
});
```

##update


> table : tablonun ismini içerir

>  row : burada insert yapılacak sütun isimleri yer alıyor

>  values : row içinde bulunan sütunlara ait değerler

>  where: Sorgu şartı

>  wValues : Sorgu şartında bulunan '?' ifadelerinin dolduracak array

```
SqlService.update(table, row, values, where, wValues).then(function(res){
	//res : dönen sonuç
});
```
basit bir update işlemi
```
SqlService.update("chatList", ["message"], ["avare kodcu"], "chatId = ?", ["C0001"]).then(function(res){
	console.log(res);
});
```
sorguları değiştirerek çeşitli update işlemi yapılabilir.

##delete

" Silmek ya da silmemek işte bütün mesele bu.." :) Bir veri asla silinmez ama ben yinede komutunu yazdım :)
> table : tablonun ismini içerir

>  where: Sorgu şartı

>  values : Sorgu şartında bulunan '?' ifadelerinin dolduracak array

```
SqlService.delete(table, where, values).then(function(res){
	//res : dönen sonuç
});
```
basit bir delete işlemi
```
SqlService.delete("chatList", "chatId = ?", ["C0001"]).then(function(res){
	console.log(res);
});
```
ve son olarak 
##query

Bunu da karışık sorgular içeren, ufak bir işlem içeren, tablo oluşturmak için kullanılabilecek sorgular olur diye yazdım

> sql :  sorgunun tamamı

örneğiyle beraber ;
```
SqlService.query("CREATE TABLE IF NOT EXISTS chatList (chatId VARCHAR(255) NOT NULL, message TEXT)").then(function(res){
	console.log(res);
});
```
