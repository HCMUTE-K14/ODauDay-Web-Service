const Sequelize = require('sequelize');

const Config = require('../config');
const MySQLConfig = Config.mysql;

const connection = new Sequelize(MySQLConfig.database_name, MySQLConfig.username, MySQLConfig.password, {
	host: MySQLConfig.host,
	dialect: Config.database_client,
	operatorsAliases: false,
	pool: {
		max: MySQLConfig.max_pool,
		min: 0,
		acquire: 30000,
		idle: 10000
	},
});

module.exports = connection;