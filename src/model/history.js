module.exports = (sequelize, DataTypes) => {
	let History = sequelize.define('History', {}, {
		timestamps: true,
		updatedAt: false,
		createdAt: 'date_created',
		tableName: 'tbl_history'
	});

	return History;
}