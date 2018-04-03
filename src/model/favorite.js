module.exports = (sequelize, DataTypes) => {
	let Favorite = sequelize.define('Favorite', {}, {
		timestamps: true,
		updatedAt: false,
		createdAt: 'date_created',
		tableName: 'tbl_favorite'
	});

	return Favorite;
}