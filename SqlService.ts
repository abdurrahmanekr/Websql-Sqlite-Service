import { Storage, SqlStorage } from 'ionic-angular';

export class SqlService {

    constructor() { }

    private static execute(sql, value, type) {
        type = type || "array";
        let db = new Storage(SqlStorage);
        switch (type) {
            case "array":
                let list = [];
                return new Promise((resolve) => {
                    db.query(sql, value).then(res => {
                        res = res.res;
                        for (var i = 0; i < res.rows.length; i++)
                            list.push(res.rows.item(i));
                        resolve(list);
                    });
                });
            case "object":
                return new Promise((resolve) => {
                    db.query(sql, value).then(res => {
                        res = res.res;
                        resolve(res.rows.item(0));
                    });
                });
            default:
                return new Promise((resolve) => {
                    let list = [];
                    db.query(sql, value).then(res => {
                        res = res.res;
                        for (var i = 0; i < res.rows.length; i++)
                            list.push(res.rows.item(i));
                        resolve(list);
                    });
                });
        }
    }

    public static select(table, field = "*", where = "", values = null, order = null) {
        return new Promise((resolve) => {
            var list = [];

            if (where && values) {
                var sql = 'SELECT ' + field + ' FROM ' + table + ' WHERE ' + where;
            } else {
                var sql = 'SELECT ' + field + ' FROM ' + table;
            }
            if (order)
                sql += " ORDER BY " + order;

            this.execute(sql, values || [], null).then(function(res) {
                resolve(res);
            });
        });
    }

    public static insert(table, row, values) {
        return new Promise((resolve) => {

            var sql = 'INSERT INTO ' + table + ' (';
            for (var i = 0; i < row.length; i++) sql += row[i] + ",";
            sql = sql.slice(0, sql.length - 1);
            sql += ') VALUES ';

            if (typeof values[0][0] == "Array") {
                for (var i = 0; i < values.length; i++) {
                    sql += '(';
                    for (var j = 0; j < values[i].length; j++)
                        sql += (j != values[i].length - 1) ? "'" + values[i][j] + "'," : "'" + values[i][j] + "'),";
                }
                sql = sql.slice(0, sql.length - 1);
                values = [];
            } else {
                sql += "(";
                for (var i = 0; i < values.length; i++) sql += "?,";
                sql = sql.slice(0, sql.length - 1);
                sql += ")";
            }

            this.execute(sql, values || [], "popup").then(function(res) {
                resolve(res);
            });
        });
    }

    public static delete(table, where = null, values = null) {
        return new Promise((resolve) => {

            if (where && values)
                var sql = 'DELETE FROM ' + table + ' WHERE ' + where;
            else
                var sql = 'DELETE FROM ' + table;

            this.execute(sql, values || [], "popup").then(function(res) {
                resolve(res);
            });
        });
    }

    public static update(table, row, values, where = null, wValues = null) {
        return new Promise((resolve) => {

            var sql = 'UPDATE ' + table + ' SET ';
            for (var i = 0; i < values.length; i++) sql += row[i] + "=?,";
            sql = sql.slice(0, sql.length - 1);
            if (where && wValues) {
                sql += " WHERE " + where;
                for (var i = 0; i < wValues.length; i++)
                    values.push(wValues[i]);
            }

            this.execute(sql, values || [], "popup").then(function(res) {
                resolve(res);
            });
        });
    }

    public static query(sql, values = []) {
        return new Promise((resolve) => {
            this.execute(sql, values, "popup").then(function(res) {
                resolve(res);
            });
        });
    }
}