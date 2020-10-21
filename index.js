"use strict";

var SqlService = function () {
	this.db = null;
	this.stack = {
		queries: [],
		binds: [],
	};
	this.timeout = 1000;
	this.isWaiting = false;
	this.wait = null;
	this.RN = false; // rigthNow
	this.DRT = false; // immediately

	this.console = function(type, value, message) {
		switch (type) {
			case 'required':
				console.warn(value + 'is required.');
				break;
			case 'deprecated':
				console.warn(value + ' is deprecated. + ' + message);
				break;
			default:
				break;
		}
	};

	this.rightNow = function() {
		this.RN = true;
		return this;
	};

	this.directly = function() {
		this.DRT = true;
		return this;
	};

	this.init = function(opt) {
		if (typeof opt !== 'object')
			this.console('deprecated', 'init(id, object)', 'Use init({id: \'\', dbObject: object}) instead.');
		else {
			if (!opt.dbObject)
				this.console('required', 'dbObject');
			if (!opt.id)
				this.console('required', 'id');
		}

		var object = opt.dbObject;
		var id = opt.id;
		var version = opt.version || '1.0';
		var description = opt.description || 'Database';

		this.timeout = opt.timeout || this.timeout;
		this.db = object.openDatabase(id + ".db", version, description, 200000);
	};

	this.execute = function(sql, value, type) {
		var self = this;
		type = type || "array";

		return new Promise(function(resolve, reject) {
			var reset = function() {
				self.stack.queries = [];
				self.stack.binds = [];
				self.isWaiting = false;
			};

			var exec = function(doResult) {
				var queries = self.stack.queries;
				var binds = self.stack.binds;
				reset();
				if (queries.length < 1)
					return;

				self.db.transaction(function(tx) {
					var tmpQ, tmpB, execCount = 0, errors = [];

					for (var i = 0; i < queries.length; i++) {
						tmpQ = queries[i];
						tmpB = binds[i];

						tx.executeSql(tmpQ, tmpB, function (tx, res) {
							execCount++;
							if (execCount === queries.length && doResult === true) {
								switch(type) {
									case 'array':
										var list = [];
										for (var i = 0; i < res.rows.length; i++)
											list.push(res.rows.item(i));
										resolve(list, errors);
										break;
									case 'object':
										resolve(res.rows.item(0), errors);
										break;
									default:
										resolve(res, errors);
										break;
								}
							}
						}, function(tx, error) {
							execCount++;
							errors.push(error || tx);
							if (execCount === queries.length && doResult === true)
								reject(errors);
						});
					}
				});
			};

			if (self.RN === true || self.timeout === 0) {
				self.RN = false;

				// this option ignores any pending queries in the queue and runs first
				if (self.DRT) {
					self.DRT = false;

					var queries = self.stack.queries.slice();
					var binds = self.stack.binds.slice();
					self.stack.queries = [sql];
					self.stack.binds = [value];
					exec(true);

					self.stack.queries = queries;
					self.stack.binds = binds;
					return;
				}
				else {
					if (self.wait !== null)
						clearTimeout(self.wait);

					exec(false);
					self.stack.queries.push(sql);
					self.stack.binds.push(value);
					return exec(true);
				}
			}

			self.stack.queries.push(sql);
			self.stack.binds.push(value);

			if (self.isWaiting === true) {
				return;
			}

			self.isWaiting = true;

			self.wait = setTimeout(exec, self.timeout);
		});
	};

	this.select = function(table, field, where, values, order) {
		var self = this;

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

			self.rightNow().execute(sql, values || []).then(resolve, reject);
		});

		return deferred;
	};

	this.insert = function(table, row, values) {
		var self = this;

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

			self.execute(sql, values || [], "popup").then(resolve, reject);
		});

		return deferred;
	};

	this.delete = function(table, where, values) {
		var self = this;

		var deferred = new Promise(function(resolve, reject) {
			if (where && values)
				var sql = 'DELETE FROM ' + table + ' WHERE ' + where;
			else
				var sql = 'DELETE FROM ' + table;

			self.execute(sql, values || [], "popup").then(resolve, reject);
		});

		return deferred;
	};

	this.update = function(table, row, values, where, wValues) {
		var self = this;

		var deferred = new Promise(function(resolve, reject) {
			var sql = 'UPDATE ' + table + ' SET ';
			for (var i = 0; i < values.length; i++) sql += row[i] + "=?,";
			sql = sql.slice(0, sql.length - 1);
			if (where && wValues) {
				sql += " WHERE " + where;
				for (var i = 0; i < wValues.length; i++)
					values.push(wValues[i]);
			}

			self.execute(sql, values || [], "popup").then(resolve, reject);
		});

		return deferred;
	};

	this.query = function(sql, values) {
		var self = this;
		values = values || [];

		var deferred = new Promise(function(resolve, reject) {
			var list = [];

			self.execute(sql, values, "popup", true).then(function (res) {
				for (var i = 0; i < res.rows.length; i++)
					list.push(res.rows.item(i));
				resolve(list);
			}, reject);
		});

		return deferred;
	};
};

module.exports = SqlService;
