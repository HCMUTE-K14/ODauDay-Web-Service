module.exports = (sequelize, DataTypes) => {
	let Transaction = sequelize.define('Transaction', {
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV4
		},
		status: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				isIn: {
					args: [
						['failure', 'success']
					]
				}
			}
		},
		value: {
			type: DataTypes.STRING
		},
		payment_gateway_session_id: {
			type: DataTypes.STRING,
			defaultValue: DataTypes.UUIDV4
		}
	}, {
		timestamps: true,
		updatedAt: 'date_modified',
		createdAt: 'date_created',
		tableName: 'tbl_transaction'
	});

	Transaction.associate = function(models) {
		Transaction.belongsTo(models.User, {
			foreignKey: 'user_id',
			as: 'transactions'
		});
	}
	return Transaction;
}