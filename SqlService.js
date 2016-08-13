"use strict";

var YourApplication = angular.module('YourApplication', ['ngCordova']);
YourApplication.run(function(SqlService, $cordovaSQLite){
    /* 
        DiKKAT : ngCordova ve $cordovaSQLite yüklü olmalıdır..! 
        Eğer sadece websql kullanacaksanız, cordovaSqlite olmadan da rahatlıkla kullanabilirsiniz.
    */


    /* burada db değişkenini tanımlıyoruz */
    
    try {
        // cordovaSqlite için olan kısım
        SqlService.db = $cordovaSQLite.openDB({ name: "my.db" });
    } catch (e) {
        // cordovaSqlite çalışmıyorsa WebSql kullanıyoruz
        SqlService.db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
    }

    /* tablomuzu oluşturuyoruz */
    SqlService.query("CREATE TABLE IF NOT EXISTS test (name, surname)");
});

YourApplication.service('SqlService', function($q) {
    return {
        db: null,

        execute: function (sql, value, type="array") {
            var deferred = $q.defer();

            switch(type) {
                case "array":
                    var list = [];
                    this.db.transaction(function(tx) {
                        tx.executeSql(sql, value, function (tx, res) {
                            for (var i = 0; i < res.rows.length; i++)
                                list.push(res.rows.item(i));
                            deferred.resolve(list);
                        }, function(tx, error) {
                            deferred.resolve(error);
                        });
                    });
                    break;
                case "object":
                    this.db.transaction(function(tx) {
                        tx.executeSql(sql, value, function (tx, res) {
                            deferred.resolve(res.rows.item(0));
                        }, function(tx, error) {
                            deferred.resolve(error);
                        });
                    });
                    break;
                default:
                    this.db.transaction(function(tx) {
                        tx.executeSql(sql, value, function (tx, res) {
                            deferred.resolve(res);
                        }, function(tx, error) {
                            deferred.resolve(error);
                        });
                    });
                    break;
            }

            return deferred.promise;
        },

        select: function(table, field = "*", where, values, order) {
            var deferred = $q.defer();
            var list = [];

            if (where && values) {
                var sql = 'SELECT ' + field + ' FROM ' + table + ' WHERE ' + where;
            } else {
                var sql = 'SELECT ' + field + ' FROM ' + table;
            }
            if (order)
                sql += " ORDER BY " + order;
         
            this.execute(sql, values || []).then(function (res) {
                deferred.resolve(res);
            });

            return deferred.promise;
        },

        insert: function(table, row, values) {
            var deferred = $q.defer();

            var sql = 'INSERT INTO ' + table + ' (';
            for (var i = 0; i < row.length; i++) sql += row[i] + ",";
            sql = sql.slice(0, sql.length - 1);
            sql += ') VALUES(';
            for (var i = 0; i < values.length; i++) sql += "?,";
            sql = sql.slice(0, sql.length - 1);
            sql += ")";

            this.execute(sql, values || [], "popup").then(function (res) {
                deferred.resolve(res);
            });

            return deferred.promise;
        },

        delete: function(table, where, values) {
            var deferred = $q.defer();

            if (where && values)
                var sql = 'DELETE FROM ' + table + ' WHERE ' + where;
            else
                var sql = 'DELETE FROM ' + table;
            
            this.execute(sql, values || [], "popup").then(function (res) {
                deferred.resolve(res);
            });

            return deferred.promise;
        },

        update: function(table, row, values, where, wValues) {
            var deferred = $q.defer();

            var sql = 'UPDATE ' + table + ' SET ';
            for (var i = 0; i < values.length; i++) sql += row[i] + "=?,";
            sql = sql.slice(0, sql.length - 1);
            if (where && wValues) {
                sql += " WHERE " + where;
                for (var i = 0; i < wValues.length; i++)
                    values.push(wValues[i]);
            }

            this.execute(sql, values || [], "popup").then(function (res) {
                deferred.resolve(res);
            });

            return deferred.promise;
        },

        query: function (sql) {
            var deferred = $q.defer();

            this.execute(sql, [], "popup").then(function (res) {
                deferred.resolve(res);
            });

            return deferred.promise;
        }
    }
});