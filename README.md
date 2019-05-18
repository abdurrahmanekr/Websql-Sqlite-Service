![WebSqLite](https://user-images.githubusercontent.com/15075759/39400628-ac2aeb12-4b3c-11e8-8b1a-b2f2b57f531d.png)

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
	dbObject: window, // database object eg: window.openDatabase
	timeout: 5000 // process waiting time
})
```

| name | description |
| --- | --- |
| id | database name |
| dbObject | database object |
| timeout | sql process timeout |
| version | database version (default: 1.0)|
| description | database description (default: Database)|


### API documentation
[API link](https://github.com/abdurrahmanekr/Websql-Sqlite-Service/tree/master/docs/API.md)


### License
This library MIT license. Copyright Avare Kodcu.