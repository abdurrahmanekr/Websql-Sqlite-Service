const SQLite 			 = require('react-native-sqlite-storage'); // plugin
const NativeEventEmitter = require('NativeEventEmitter');		   // super worked

class SqlService extends NativeEventEmitter {

	constructor(props) {
		super(props);
	}

	async execute(sql, value, type) {
		type = type || "array";
		let db = SQLite.openDatabase("react.db", "1.0", "React Database", 200000);
		const tx = await (
					new Promise(resolve =>
							db.transaction(resolve)
					)
			);
		return await (
			new Promise((resolve, reject) => {
				switch (type) {
					case "array":
						tx.executeSql(sql, value, (tx, res) => {
							let list = [];
							res = res;
							for (var i = 0; i < res.rows.length; i++)
								list.push(res.rows.item(i));
							resolve(list);
						});
						break;
					case "object":
						tx.executeSql(sql, value, (tx, res) => {
							res = res;
							resolve(res.rows.item(0));
						});
						break;
					default:
						tx.executeSql(sql, value, (tx, res) => {
							let list = [];
							res = res;
							for (var i = 0; i < res.rows.length; i++)
								list.push(res.rows.item(i));
							resolve(list);
						});
						break;
				}
			})
		);
	}

	select(table, field = "*", where = "", values = null, order = null) {
		var list = [];

		if (where && values) {
			var sql = 'SELECT ' + field + ' FROM ' + table + ' WHERE ' + where;
		} else {
			var sql = 'SELECT ' + field + ' FROM ' + table;
		}
		if (order)
			sql += " ORDER BY " + order;

		return this.execute(sql, values || [], null).then(function(res) {
			return res;
		});
	}

	insert(table, row, values) {
		var sql = 'INSERT INTO ' + table + ' (';
		for (var i = 0; i < row.length; i++) sql += row[i] + ",";
		sql = sql.slice(0, sql.length - 1);
		sql += ') VALUES ';

		if (typeof values[0] == "object") {
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

		return this.execute(sql, values || [], "popup").then(function(res) {
			return res;
		});
	}

	delete(table, where = null, values = null) {
		if (where && values)
			var sql = 'DELETE FROM ' + table + ' WHERE ' + where;
		else
			var sql = 'DELETE FROM ' + table;

		return this.execute(sql, values || [], "popup").then(function(res) {
			return res;
		});
	}

	update(table: string, row, values, where: string, wValues: Array<any>) {
		var sql = 'UPDATE ' + table + ' SET ';
		for (var i = 0; i < values.length; i++) sql += row[i] + "=?,";
		sql = sql.slice(0, sql.length - 1);
		if (where && wValues) {
			sql += " WHERE " + where;
			for (var i = 0; i < wValues.length; i++)
				values.push(wValues[i]);
		}

		return this.execute(sql, values || [], "popup").then(function(res) {
			return res;
		});
	}

	query(sql: string, values: Array<any>): Promise<any> {
		return this.execute(sql, values, "popup").then(function(res) {
			return res;
		});
	}
}
module.exports = new SqlService();
