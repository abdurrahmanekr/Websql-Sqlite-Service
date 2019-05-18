![WebSqLite](http://i.hizliresim.com/1LVQY1.png)

### WebSql ve Sqlite Uyumlu SqlService Kütüphanesi
Gereksiz ve can sıkıcı SQL sorugularını yazmamak için yapılmış bir kütüphanedir. İçindeki methodlar ile basitçe gerekli olan işlerinizi halledebilirsiniz.

Toplamda 5 adet methodu var bunlar:

- [x] [select](#select)
- [x] [insert](#insert)
- [x] [update](#update)
- [x] [delete](#delete)
- [x] [query](#query)

## En Son Değişiklikler

> version ve description ayarları eklendi.

## select

> table : Tablonun ismi.

>  fields : Çekilecek sütun isimleri.

>  where : Sorgunun şartı.

>  values : Sorgu şartında bulunan '?' ifadelerini dolduracak array.

>  order : Sorguda bulunacak order işlemine ait string ifade.


```javascript
SqlService.select(table, fields, where, values, order).then(res => {
  // res : dönen sonuç
});
```

Basit bir select sorgusu:
```javascript
SqlService.select("chatList", "*", "chatId = ?", ["C0001"]).then(res => {
    var result = res.map(x => x.message);
    console.log(result);
});
```
like kullanımı:
```javascript
SqlService.select("chatList", "*", "(message LIKE ?)", ['%avare kodcu%']).then(res => {
    var result = res.map(x => x.message);
    console.log(result);
});
```
order by kullanımı:
```javascript
SqlService.select("chatList", "*", "", "", "rowid, message").then(res => {
    var result = res.map(x => x.message);
    console.log(result);
});
```

Bunlara benzer kullanımları yapabilirsiniz.

## insert

> table : Tablonun ismi.

>  fields : insert yapılacak sütun isimleri.

>  values :  fields içinde bulunan sütunlara ait değerler.

```javascript
SqlService.insert(table, fields, values).then(res => {
    //res : dönen sonuç
});
```
Tekli insert işlemi:
```javascript
SqlService.insert("chatList", ["message"], ["avare kodcu"]).then(res => {
    console.log(res)
});
```
Çoklu insert işlemi:

```javascript
SqlService.insert(
    "chatList",
    ["message"],
    [
        ["avare kodcu"],
        ["Ya olduğun gibi görün, ya göründüğün gibi ol!"]
    ]
).then(res => {
    console.log(res)
});
```

## update


> table : Tablonun ismi.

>  fields : insert yapılacak sütun isimleri.

>  values : fields içinde bulunan sütunlara ait değerler.

>  where: Sorgu şartı.

>  wValues : Sorgu şartında bulunan '?' ifadelerini dolduracak array.

```javascript
SqlService.update(table, fields, values, where, wValues).then(res => {
    //res : dönen sonuç
});
```
Basit bir update işlemi:
```javascript
SqlService.update("chatList", ["message"], ["avare kodcu"], "chatId = ?", ["C0001"]).then(res => {
    console.log(res);
});
```
Sorguları değiştirerek çeşitli update işlemi yapılabilir.

## delete


> table : Tablonun ismi.

>  where: Sorgu şartı.

>  values : Sorgu şartında bulunan '?' ifadelerini dolduracak array.

```javascript
SqlService.delete(table, where, values).then(res => {
    //res : dönen sonuç
});
```
Basit bir delete işlemi:
```javascript
SqlService.delete("chatList", "chatId = ?", ["C0001"]).then(res => {
    console.log(res);
});
```
ve son olarak 
## query

Özel sorgu için kullanılır.

> sql :  Sorgunun tamamı.

Örneğiyle beraber;
```javascript
SqlService.query("CREATE TABLE IF NOT EXISTS chatList (chatId VARCHAR(255) NOT NULL, message TEXT)").then(res => {
    console.log(res);
});
```