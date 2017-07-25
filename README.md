![WebSqLite](http://i.hizliresim.com/1LVQY1.png)

WebSql and Sqlite Compatible SqlService Library

### Install

install command:
```
npm install websqlite --save
```

### Initialize
```javascript
const websqlite = require('websqlite');
var SqlService = new websqlite();

SqlService.init({
	id: 'user', // db name
	dbObject: window, // database object ex: window.
	timeout: 5000 // process waiting time
})
```

### API documentation
[API link](https://github.com/abdurrahmanekr/Websql-Sqlite-Service/tree/master/docs/API.md)


### License
This library MIT license. Copyright Avare Kodcu.