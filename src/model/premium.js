module.exports = (sequelize, DataTypes) => {
	let Premium = sequelize.define('Premium', {
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV4
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		description: {
			type: DataTypes.STRING
		},
		value: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		real_value: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		status: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				isIn: ['active', 'disable']
			}
		}
	}, {
		timestamps: true,
		createdAt: 'date_created',
		updatedAt: 'date_modified',
		tableName: 'tbl_premium'
	});

	Premium.associate = function(models) {
		Premium.hasMany(models.GiftCode, {
			foreignKey: 'id',
			as: 'gift_code'
		});
	};

	return Premium;
}