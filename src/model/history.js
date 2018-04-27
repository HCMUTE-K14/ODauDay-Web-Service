module.exports = (sequelize, DataTypes) => {
	let History = sequelize.define('History', {
		user_id: {
			type: DataTypes.STRING,
			primaryKey: true
        },
        property_id: {
			type: DataTypes.STRING,
			primaryKey: true
        }
	}, {
		timestamps: true,
		updatedAt: false,
		createdAt: 'date_created',
		tableName: 'tbl_history'
	});

	return History;
}