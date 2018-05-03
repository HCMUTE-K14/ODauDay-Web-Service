const Sequelize = require('sequelize');
const Fs = require('fs');
const Path = require('path');

const Connection = require('../database/connection');
const BaseName = Path.basename(__filename);

const db = {};
let sequelize = Connection;

Fs.readdirSync(__dirname)
	.filter(file => {
		return (file.indexOf('.') !== 0) && (file !== BaseName) && (file.slice(-3) === '.js');
	})
	.forEach(file => {
		let model = sequelize['import'](Path.join(__dirname, file));
		db[model.name] = model;
	});

Object.keys(db).forEach(modelName => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});


Sequelize.Validator.notNull = function (item) {
    return !this.isNull(item);
};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;