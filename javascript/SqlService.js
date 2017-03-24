"use strict";
var SqlService = {
	db: null,

	execute: function (sql, value, type) {
		return new Promise(function (resolve, reject){
			type = type || "array";
			switch(type){
				case "array":
					var list = [];
					SqlService.db.transaction(function(tx) {
						tx.executeSql(sql, value, function (tx, res) {
							for (var i = 0; i < res.rows.length; i++)
								list.push(res.rows.item(i));
							resolve(list);
						}, function(tx, error) {
							resolve(error);
						});
					});
					break;
				case "object":
					SqlService.db.transaction(function(tx) {
						tx.executeSql(sql, value, function (tx, res) {
							resolve(res.rows.item(0));
						}, function(tx, error) {
							resolve(error);
						});
					});
					break;
				default:
					SqlService.db.transaction(function(tx) {
						tx.executeSql(sql, value, function (tx, res) {
							resolve(res);
						}, function(tx, error) {
							resolve(error);
						});
					});
					break;
			}
		});
	},

	select: function(table, field, where, values, order) {
		var deferred = new Promise(function(resolve, reject) {

			field = field || "*";
			var list = [];

			if (where && values) {
				var sql = 'SELECT ' + field + ' FROM ' + table + ' WHERE ' + where;
			} else {
				var sql = 'SELECT ' + field + ' FROM ' + table;
			}
			if (order)
				sql += " ORDER BY " + order;

			SqlService.execute(sql, values || []).then(function (res) {
				resolve(res);
			});
		});

		return deferred;
	},

	insert: function(table, row, values) {
		var deferred = new Promise(function(resolve, reject) {
			var sql = 'INSERT INTO ' + table + ' (';
			for (var i = 0; i < row.length; i++) sql += row[i] + ",";
			sql = sql.slice(0, sql.length - 1);
			sql += ') VALUES ';

			if (typeof values[0] == "object" && values[0]) {
				for (var i = 0; i < values.length; i++) {
					sql += '(';
					for (var j = 0; j < values[i].length; j++)
						sql += ( j != values[i].length - 1 ) ? "'"+values[i][j]+"'," : "'"+values[i][j]+"'),";
				}
				sql = sql.slice(0, sql.length - 1);
				values = [];
			} else {
				sql += "(";
				for (var i = 0; i < values.length; i++) sql += "?,";
				sql = sql.slice(0, sql.length - 1);
				sql += ")";
			}

			SqlService.execute(sql, values || [], "popup").then(function (res) {
				resolve(res);
			});
		});

		return deferred;
	},
	
	delete: function(table, where, values) {
		var deferred = new Promise(function(resolve, reject) {
			if (where && values)
				var sql = 'DELETE FROM ' + table + ' WHERE ' + where;
			else
				var sql = 'DELETE FROM ' + table;

			SqlService.execute(sql, values || [], "popup").then(function (res) {
				resolve(res);
			});
		});

		return deferred;
	},

	update: function(table, row, values, where, wValues) {
		var deferred = new Promise(function(resolve, reject) {
			var sql = 'UPDATE ' + table + ' SET ';
			for (var i = 0; i < values.length; i++) sql += row[i] + "=?,";
			sql = sql.slice(0, sql.length - 1);
			if (where && wValues) {
				sql += " WHERE " + where;
				for (var i = 0; i < wValues.length; i++)
					values.push(wValues[i]);
			}

			SqlService.execute(sql, values || [], "popup").then(function (res) {
				resolve(res);
			});
		});

		return deferred;
	},

	query: function (sql) {
		var deferred = new Promise(function(resolve, reject) {
			var list = [];

			SqlService.execute(sql, [], "popup").then(function (res) {
				for (var i = 0; i < res.rows.length; i++)
					list.push(res.rows.item(i));
				resolve(list);
			});
		});

		return deferred;
	}
}
