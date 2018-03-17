const MessageHelper = require('../util/message/message-helper');

module.exports = (sequelize, DataTypes) => {
	let CodePremium = sequelize.define('CodePremium', {
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV4
		},
		code: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
			validate: {
				len: {
					args: [6, 10],
					msg: JSON.stringify(MessageHelper.VI['code_premium_len'])
				}
			}
		},
		status: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				isIn: {
					args: [
						['active', 'disabled']
					],
					msg: JSON.stringify(MessageHelper.VI['status_code_premium_invalid'])
				}
			}
		},
		type: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				isIn: {
					args: [
						['increase_amount', 'discount']
					],
					msg: JSON.stringify(MessageHelper.VI['type_code_premium_invalid'])
				}
			}
		},
		value: {
			type: DataTypes.STRING,
			allowNull: false
		},
		num_of_active: {
			type: DataTypes.INTEGER,
			defaultValue: 1
		},
		date_end: {
			type: DataTypes.DATE
		}
	}, {
		timestamps: true,
		createdAt: 'date_created',
		updatedAt: 'date_modified',
		tableName: 'tbl_code_premium'
	});

	CodePremium.associate = function(models) {

	};

	return CodePremium;
}