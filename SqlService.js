"use strict";

var YourApplication = angular.module('YourApplication', []);
YourApplication.run(function(SqlService){
    /* not: cordovaSqlite için şu an için uyumluluğu yoktur. yakın zamanda uyumlu hale gelirilecektir */
    
    /* burada db değişkenini tanımlıyoruz */
    SqlService.db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
    
    /* tablomuzu oluşturuyoruz */
    SqlService.query("CREATE TABLE IF NOT EXISTS test (name, surname)");
});

YourApplication.service('SqlService', function($q) {
    return {
        db: null,

        select: function(table, field = "*", where, values) {
            var deferred = $q.defer();
            var list = [];

            if (where && values) {
                var sql = 'SELECT ' + field + ' FROM ' + table + ' WHERE ' + where;
                this.db.transaction(function(tx) {
                    tx.executeSql(sql, values, function(tx, results) {
                        angular.forEach(results.rows, function(item, index) {
                            list.push(item);
                        })
                        deferred.resolve(list);
                    }, function(tx, error) {
                        deferred.resolve(error);
                    });
                });
            } else {
                field = field || "*";
                var sql = 'SELECT ' + field + ' FROM ' + table;
                this.db.transaction(function(tx) {
                    tx.executeSql(sql, [], function(tx, results) {
                        angular.forEach(results.rows, function(item, index) {
                            list.push(item);
                        })
                        deferred.resolve(list);
                    }, function(tx, error) {
                        deferred.resolve(error);
                    });
                });
            }

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

            this.db.transaction(function(tx) {
                tx.executeSql(sql, values, function(tx, results) {
                    deferred.resolve(results);
                }, function(tx, error) {
                    deferred.resolve(error);
                });
            });

            return deferred.promise;
        },

        delete: function(table, where, values) {
            var deferred = $q.defer();

            if (where && values) {
                var sql = 'DELETE FROM ' + table + ' WHERE ' + where;
                this.db.transaction(function(tx) {
                    tx.executeSql(sql, values, function(tx, results) {
                        deferred.resolve(results);
                    }, function(tx, error) {
                        deferred.resolve(error);
                    });
                });
            } else {
                var sql = 'DELETE FROM ' + table;
                this.db.transaction(function(tx) {
                    tx.executeSql(sql, [], function(tx, results) {
                        deferred.resolve(results);
                    }, function(tx, error) {
                        deferred.resolve(error);
                    });
                });
            }

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

                this.db.transaction(function(tx) {
                    tx.executeSql(sql, values, function(tx, results) {
                        deferred.resolve(results);
                    }, function(tx, error) {
                        deferred.resolve(error);
                    });
                });
            } else {
                this.db.transaction(function(tx) {
                    tx.executeSql(sql, values, function(tx, results) {
                        deferred.resolve(results);
                    }, function(tx, error) {
                        deferred.resolve(error);
                    });
                });
            }
            
            return deferred.promise;
        },

        query: function (sql) {
            var deferred = $q.defer();

            this.db.transaction(function(tx) {
                tx.executeSql(sql, [], function(tx, results) {
                    deferred.resolve(results);
                }, function(tx, error) {
                    deferred.resolve(error);
                });
            });

            return deferred.promise;
        }
    }
});