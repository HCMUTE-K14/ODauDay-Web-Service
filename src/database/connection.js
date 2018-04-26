const Sequelize = require('sequelize');

const Config = require('../config');

const Logger = require('../logger');

const TAG = 'DATABASE ';
const MySQLConfig = Config.mysql;

const connection = new Sequelize(MySQLConfig.database_name, MySQLConfig.username, MySQLConfig.password, {
	host: MySQLConfig.host,
	port: MySQLConfig.port,
	dialect: Config.database_client,
	operatorsAliases: false,
	define: {
		charset: 'utf8',
		collate: 'utf8_general_ci',
		timestamps: true
	},
	pool: {
		max: MySQLConfig.max_pool,
		min: 0,
		acquire: 30000,
		idle: 10000
	},

	// logging: function(sql) {
	// 	Logger.info(TAG + sql);
	// }
});

module.exports = connection;